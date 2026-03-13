"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Heart, MessageCircle, Send, Music2, Plus } from "lucide-react"

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
  isOwner?: boolean
}

interface Track {
  id: string
  title: string
  duration: string
  plays: number
  likes: number
  isLiked: boolean
  comments: Comment[]
  coverGradient: string
}

// Start with empty tracks - user will add their own
const initialTracks: Track[] = []

export function TracksSection() {
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<string | null>(null)

  const togglePlay = (trackId: string) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId)
  }

  const toggleComments = (trackId: string) => {
    setExpandedComments(expandedComments === trackId ? null : trackId)
  }

  const addComment = (trackId: string, text: string) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              comments: [
                {
                  id: `c${Date.now()}`,
                  author: "Вы",
                  text,
                  timestamp: "Только что",
                  isOwner: true,
                },
                ...track.comments,
              ],
            }
          : track
      )
    )
  }

  const toggleLike = (trackId: string) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
              ...track,
              isLiked: !track.isLiked,
              likes: track.isLiked ? track.likes - 1 : track.likes + 1,
            }
          : track
      )
    )
  }

  return (
    <section id="tracks" className="relative py-16 sm:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Мои треки
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg px-4">
            Музыка, созданная на стыке человеческого творчества и ИИ
          </p>
        </motion.div>

        {/* Tracks List or Empty State */}
        {tracks.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {tracks.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                index={index}
                isPlaying={playingTrack === track.id}
                isExpanded={expandedComments === track.id}
                onTogglePlay={() => togglePlay(track.id)}
                onToggleComments={() => toggleComments(track.id)}
                onAddComment={(text) => addComment(track.id, text)}
                onToggleLike={() => toggleLike(track.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyTracksState />
        )}
      </div>
    </section>
  )
}

function EmptyTracksState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl p-8 sm:p-12 text-center"
    >
      {/* Animated Music Icon */}
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
        className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
      >
        <Music2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
      </motion.div>

      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
        Скоро здесь появятся треки
      </h3>
      <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-6">
        Новая музыка уже в работе. Подпишитесь, чтобы первым узнать о релизах.
      </p>

      {/* Animated placeholder cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="h-16 sm:h-20 rounded-xl bg-secondary/30 border border-dashed border-border flex items-center justify-center"
          >
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/50" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

interface TrackCardProps {
  track: Track
  index: number
  isPlaying: boolean
  isExpanded: boolean
  onTogglePlay: () => void
  onToggleComments: () => void
  onAddComment: (text: string) => void
  onToggleLike: () => void
}

function TrackCard({
  track,
  index,
  isPlaying,
  isExpanded,
  onTogglePlay,
  onToggleComments,
  onAddComment,
  onToggleLike,
}: TrackCardProps) {
  const [commentInput, setCommentInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentInput.trim()) {
      onAddComment(commentInput.trim())
      setCommentInput("")
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg"
    >
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cover Art */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTogglePlay}
            className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${track.coverGradient} flex items-center justify-center cursor-pointer shadow-lg overflow-hidden flex-shrink-0`}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/20"
                >
                  <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" fill="currentColor" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Music2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground/80" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Playing animation */}
            {isPlaying && (
              <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="w-0.5 sm:w-1 bg-primary-foreground rounded-full"
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground truncate">
              {track.title}
            </h3>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              <span>{track.duration}</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">{formatNumber(track.plays)} прослушиваний</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleLike}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors ${
                track.isLiked
                  ? "bg-red-100 text-red-500"
                  : "bg-secondary/50 text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={track.isLiked ? "currentColor" : "none"} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleComments}
              className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors ${
                isExpanded
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/50 text-muted-foreground hover:text-primary"
              }`}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTogglePlay}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium shadow-md"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? "Пауза" : "Слушать"}</span>
            </motion.button>
          </div>
        </div>

        {/* Stats - Mobile */}
        <div className="flex items-center gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {formatNumber(track.likes)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {track.comments.length}
          </span>
          <span className="sm:hidden flex items-center gap-1">
            {formatNumber(track.plays)} прослуш.
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
            <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
              {/* Comment Input */}
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <motion.input
                  ref={inputRef}
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Напишите комментарий..."
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-secondary/70 outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </form>

              {/* Comments List */}
              <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto">
                {track.comments.length > 0 ? (
                  track.comments.map((comment, i) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                        comment.isOwner
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-secondary/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <span className={`text-sm font-medium ${comment.isOwner ? "text-primary" : "text-foreground"}`}>
                          {comment.author}
                        </span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{comment.text}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4 text-sm sm:text-base">
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
