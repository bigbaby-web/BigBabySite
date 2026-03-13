"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Pause, 
  Heart, 
  MessageCircle, 
  Music2, 
  Disc3, 
  Sparkles,
  TrendingUp,
  Clock,
  Filter,
  Send,
  User
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { MusicPlayer, type Track as PlayerTrack } from "@/components/music-player"
import { StaggerContainer, StaggerItem, BlurIn } from "@/components/page-transition"
import Link from "next/link"

interface Comment {
  id: string
  user_id: string
  content: string
  created_at: string
  profiles: {
    username: string | null
    avatar_url: string | null
  } | null
}

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  plays: number
  audio_url: string | null
  cover_url: string | null
  created_at: string
  likes: { count: number }[]
  comments: Comment[]
  user_has_liked?: boolean
}

const gradients = [
  "from-rose-400 via-fuchsia-500 to-indigo-500",
  "from-emerald-400 via-cyan-500 to-blue-500",
  "from-orange-400 via-amber-500 to-yellow-500",
  "from-violet-400 via-purple-500 to-fuchsia-500",
  "from-sky-400 via-blue-500 to-indigo-500",
  "from-pink-400 via-rose-500 to-red-500",
]

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [expandedComments, setExpandedComments] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "popular" | "recent">("all")
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    fetchTracks()
  }, [filter])

  const fetchTracks = async () => {
    setLoading(true)
    
    let query = supabase
      .from("tracks")
      .select(`
        *,
        likes:track_likes(count),
        comments:track_comments(
          id,
          user_id,
          content,
          created_at,
          profiles(username, avatar_url)
        )
      `)

    if (filter === "popular") {
      query = query.order("plays", { ascending: false })
    } else if (filter === "recent") {
      query = query.order("created_at", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (!error && data) {
      // Check if user has liked each track
      if (user) {
        const { data: userLikes } = await supabase
          .from("track_likes")
          .select("track_id")
          .eq("user_id", user.id)

        const likedTrackIds = new Set(userLikes?.map(l => l.track_id) || [])
        
        setTracks(data.map(track => ({
          ...track,
          user_has_liked: likedTrackIds.has(track.id)
        })))
      } else {
        setTracks(data)
      }
    }
    
    setLoading(false)
  }

  const handlePlay = (track: Track, index: number) => {
    const playerTrack: PlayerTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      audio_url: track.audio_url,
      cover_url: track.cover_url,
      coverGradient: `bg-gradient-to-br ${gradients[index % gradients.length]}`,
    }

    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(playerTrack)
      setIsPlaying(true)
      
      // Update play count
      supabase
        .from("tracks")
        .update({ plays: track.plays + 1 })
        .eq("id", track.id)
        .then(() => {
          setTracks(prev => prev.map(t => 
            t.id === track.id ? { ...t, plays: t.plays + 1 } : t
          ))
        })
    }
  }

  const handleLike = async (trackId: string) => {
    if (!user) return

    const track = tracks.find(t => t.id === trackId)
    if (!track) return

    if (track.user_has_liked) {
      await supabase
        .from("track_likes")
        .delete()
        .eq("track_id", trackId)
        .eq("user_id", user.id)
    } else {
      await supabase
        .from("track_likes")
        .insert({ track_id: trackId, user_id: user.id })
    }

    setTracks(prev => prev.map(t => 
      t.id === trackId 
        ? { 
            ...t, 
            user_has_liked: !t.user_has_liked,
            likes: [{ count: t.likes[0].count + (t.user_has_liked ? -1 : 1) }]
          } 
        : t
    ))
  }

  const handleAddComment = async (trackId: string, content: string) => {
    if (!user || !content.trim()) return

    const { data, error } = await supabase
      .from("track_comments")
      .insert({ track_id: trackId, user_id: user.id, content: content.trim() })
      .select(`
        id,
        user_id,
        content,
        created_at,
        profiles(username, avatar_url)
      `)
      .single()

    if (!error && data) {
      setTracks(prev => prev.map(t => 
        t.id === trackId 
          ? { ...t, comments: [data, ...t.comments] }
          : t
      ))
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return "Только что"
    if (minutes < 60) return `${minutes} мин назад`
    if (hours < 24) return `${hours} ч назад`
    if (days < 7) return `${days} дн назад`
    return date.toLocaleDateString("ru-RU")
  }

  return (
    <div className="min-h-screen pt-24 pb-32 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <BlurIn>
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Disc3 className="w-5 h-5" />
              <span className="font-medium">Музыкальная библиотека</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Мои Треки
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Слушай, комментируй и наслаждайся уникальной музыкой, созданной на стыке творчества и ИИ
            </p>
          </div>
        </BlurIn>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          <FilterButton 
            icon={<Sparkles className="w-4 h-4" />}
            label="Все треки"
            isActive={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterButton 
            icon={<TrendingUp className="w-4 h-4" />}
            label="Популярные"
            isActive={filter === "popular"}
            onClick={() => setFilter("popular")}
          />
          <FilterButton 
            icon={<Clock className="w-4 h-4" />}
            label="Новые"
            isActive={filter === "recent"}
            onClick={() => setFilter("recent")}
          />
        </motion.div>

        {/* Tracks List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary/50 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-48 bg-secondary/50 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-secondary/30 rounded animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : tracks.length > 0 ? (
          <StaggerContainer className="space-y-4">
            {tracks.map((track, index) => (
              <StaggerItem key={track.id}>
                <TrackCard
                  track={track}
                  index={index}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  isExpanded={expandedComments === track.id}
                  onPlay={() => handlePlay(track, index)}
                  onLike={() => handleLike(track.id)}
                  onToggleComments={() => setExpandedComments(
                    expandedComments === track.id ? null : track.id
                  )}
                  onAddComment={(content) => handleAddComment(track.id, content)}
                  formatDuration={formatDuration}
                  formatNumber={formatNumber}
                  formatDate={formatDate}
                  isLoggedIn={!!user}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Music Player */}
      <MusicPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => {
          const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
          if (currentIndex < tracks.length - 1) {
            handlePlay(tracks[currentIndex + 1], currentIndex + 1)
          }
        }}
        onPrevious={() => {
          const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
          if (currentIndex > 0) {
            handlePlay(tracks[currentIndex - 1], currentIndex - 1)
          }
        }}
        onClose={() => {
          setCurrentTrack(null)
          setIsPlaying(false)
        }}
      />
    </div>
  )
}

function FilterButton({ 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void 
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
        isActive
          ? "bg-primary text-primary-foreground shadow-lg"
          : "bg-glass border border-glass-border text-foreground hover:bg-secondary/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  )
}

interface TrackCardProps {
  track: Track
  index: number
  isPlaying: boolean
  isExpanded: boolean
  onPlay: () => void
  onLike: () => void
  onToggleComments: () => void
  onAddComment: (content: string) => void
  formatDuration: (seconds: number) => string
  formatNumber: (num: number) => string
  formatDate: (dateString: string) => string
  isLoggedIn: boolean
}

function TrackCard({
  track,
  index,
  isPlaying,
  isExpanded,
  onPlay,
  onLike,
  onToggleComments,
  onAddComment,
  formatDuration,
  formatNumber,
  formatDate,
  isLoggedIn,
}: TrackCardProps) {
  const [commentInput, setCommentInput] = useState("")
  const gradient = gradients[index % gradients.length]

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentInput.trim()) {
      onAddComment(commentInput.trim())
      setCommentInput("")
    }
  }

  return (
    <motion.div
      layout
      className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-4">
          {/* Cover Art with Play Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlay}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center cursor-pointer shadow-lg overflow-hidden flex-shrink-0 group`}
          >
            {track.cover_url ? (
              <img 
                src={track.cover_url} 
                alt={track.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music2 className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
            )}
            
            {/* Play/Pause Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" fill="currentColor" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              )}
            </div>
            
            {/* Playing Animation */}
            {isPlaying && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 14, 4] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-white rounded-full"
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-foreground truncate">
              {track.title}
            </h3>
            <p className="text-sm text-muted-foreground">{track.artist}</p>
            <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(track.duration)}
              </span>
              <span className="flex items-center gap-1">
                <Play className="w-3.5 h-3.5" />
                {formatNumber(track.plays)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLike}
              disabled={!isLoggedIn}
              className={`p-2.5 rounded-xl transition-colors ${
                track.user_has_liked
                  ? "bg-red-100 text-red-500"
                  : "bg-secondary/50 text-muted-foreground hover:text-red-500"
              } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart className="w-5 h-5" fill={track.user_has_liked ? "currentColor" : "none"} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleComments}
              className={`p-2.5 rounded-xl transition-colors ${
                isExpanded
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/50 text-muted-foreground hover:text-primary"
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlay}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-md"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Пауза</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Слушать</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-glass-border/50 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            {formatNumber(track.likes[0]?.count || 0)} лайков
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            {track.comments.length} комментариев
          </span>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-glass-border overflow-hidden"
          >
            <div className="p-4 sm:p-6 space-y-4">
              {/* Comment Input */}
              {isLoggedIn ? (
                <form onSubmit={handleSubmitComment} className="flex gap-3">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Напишите комментарий..."
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 shadow-md"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-2">Войдите, чтобы оставить комментарий</p>
                  <Link href="/?auth=login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium"
                    >
                      Войти
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {track.comments.length > 0 ? (
                  track.comments.map((comment, i) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 p-3 rounded-xl bg-secondary/30"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                        {comment.profiles?.avatar_url ? (
                          <img 
                            src={comment.profiles.avatar_url} 
                            alt={comment.profiles.username || "User"}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">
                            {comment.profiles?.username || "Пользователь"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-6">
                    Пока нет комментариев. Будьте первым!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl p-12 text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
      >
        <Music2 className="w-12 h-12 text-primary" />
      </motion.div>

      <h3 className="text-2xl font-bold text-foreground mb-3">
        Скоро здесь появятся треки
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Новая музыка уже в работе. Следите за обновлениями!
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="w-20 h-20 rounded-xl bg-secondary/30 border border-dashed border-border"
          />
        ))}
      </div>
    </motion.div>
  )
}
