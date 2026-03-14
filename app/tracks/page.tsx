"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Music, Play, Heart, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { usePlayer } from "@/contexts/player-context"

type FilterType = "all" | "popular" | "new"

interface Track {
  id: string
  title: string
  artist: string
  genre: string
  duration: number
  cover_url: string | null
  audio_url: string | null
  is_published: boolean
  plays_count: number
  created_at: string
  liked?: boolean
  likes_count?: number
}

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const { user } = useAuth()
  const { playTrack, currentTrack, isPlaying, addToQueue } = usePlayer()
  const supabase = createClient()

  useEffect(() => {
    fetchTracks()
  }, [user])

  useEffect(() => {
    applyFilter()
  }, [tracks, activeFilter])

  const fetchTracks = async () => {
    const { data: tracksData, error: tracksError } = await supabase
      .from("tracks")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (tracksError) {
      console.error("Error fetching tracks:", tracksError)
      setLoading(false)
      return
    }

    if (user) {
      const { data: likesData } = await supabase
        .from("likes")
        .select("track_id")
        .eq("user_id", user.id)

      const likedTrackIds = new Set(likesData?.map(l => l.track_id) || [])

      const tracksWithLikes = await Promise.all(
        (tracksData || []).map(async (track) => {
          const { count } = await supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("track_id", track.id)

          return {
            ...track,
            liked: likedTrackIds.has(track.id),
            likes_count: count || 0
          }
        })
      )

      setTracks(tracksWithLikes)
    } else {
      const tracksWithLikes = await Promise.all(
        (tracksData || []).map(async (track) => {
          const { count } = await supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("track_id", track.id)

          return {
            ...track,
            likes_count: count || 0
          }
        })
      )

      setTracks(tracksWithLikes)
    }

    setLoading(false)
  }

  const applyFilter = () => {
    let filtered = [...tracks]

    switch (activeFilter) {
      case "popular":
        filtered = filtered.sort((a, b) => (b.plays_count || 0) - (a.plays_count || 0))
        break
      case "new":
        filtered = filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      default:
        filtered = filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }

    setFilteredTracks(filtered)
  }

  const handleLike = async (trackId: string, currentlyLiked: boolean) => {
    if (!user) {
      alert("Пожалуйста, войдите чтобы ставить лайки")
      return
    }

    if (currentlyLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("track_id", trackId)
    } else {
      await supabase
        .from("likes")
        .insert({ user_id: user.id, track_id: trackId })
    }

    fetchTracks()
  }

  const handlePlay = (track: Track) => {
    // Добавляем в очередь все треки для возможности переключения
    if (filteredTracks.length > 0) {
      filteredTracks.forEach(t => {
        if (t.id !== track.id) {
          addToQueue(t)
        }
      })
    }
    // Запускаем выбранный трек
    playTrack(track)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const filterButtons: { id: FilterType; label: string }[] = [
    { id: "all", label: "Все" },
    { id: "popular", label: "Популярные" },
    { id: "new", label: "Новые" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-24 px-4 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-24 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Мои Треки
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Слушай, комментируй и наслаждайся уникальной музыкой
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6 sm:mb-8 justify-center px-2"
        >
          {filterButtons.map((button) => (
            <motion.button
              key={button.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(button.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
                activeFilter === button.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary/50 text-foreground hover:bg-secondary/70"
              }`}
            >
              {button.label}
            </motion.button>
          ))}
        </motion.div>

        {filteredTracks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <Music className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Скоро здесь появятся треки</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Новая музыка уже в работе</p>
          </motion.div>
        ) : (
          <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-card/50 transition-colors"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {track.cover_url ? (
                    <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{track.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {track.artist} • {track.genre}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {formatDuration(track.duration)} • {track.plays_count || 0} прослушиваний
                    {track.likes_count ? ` • ❤️ ${track.likes_count}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(track.id, track.liked || false)}
                    className={`p-1.5 sm:p-2 rounded-full hover:bg-primary/10 transition-colors ${
                      track.liked ? 'text-red-500' : 'text-muted-foreground'
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${track.liked ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePlay(track)}
                    className={`p-2 sm:p-2.5 rounded-full ${
                      currentTrack?.id === track.id && isPlaying
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}