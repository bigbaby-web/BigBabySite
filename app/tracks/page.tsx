"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Music, Play, Pause, Heart, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

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
  const [loading, setLoading] = useState(true)
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    fetchTracks()
  }, [user])

  useEffect(() => {
    // Создаем аудио элемент при монтировании
    audioRef.current = new Audio()
    audioRef.current.onended = () => {
      setPlayingTrack(null)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

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

  const handlePlay = async (track: Track) => {
    if (!track.audio_url) {
      alert("Аудио файл не загружен")
      return
    }

    if (!audioRef.current) return

    if (playingTrack === track.id) {
      // Останавливаем текущий трек
      audioRef.current.pause()
      setPlayingTrack(null)
    } else {
      // Останавливаем предыдущий трек если был
      if (playingTrack) {
        audioRef.current.pause()
      }
      
      try {
        // Запускаем новый
        audioRef.current.src = track.audio_url
        await audioRef.current.play()
        setPlayingTrack(track.id)

        // Увеличиваем счетчик прослушиваний
        await supabase
          .from("tracks")
          .update({ plays_count: (track.plays_count || 0) + 1 })
          .eq("id", track.id)
        
        fetchTracks()
      } catch (error) {
        console.error("Ошибка воспроизведения:", error)
        alert("Не удалось воспроизвести аудио. Проверьте ссылку на файл.")
      }
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Мои Треки
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Слушай, комментируй и наслаждайся уникальной музыкой
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 justify-center"
        >
          <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground">
            Все треки
          </button>
          <button className="px-4 py-2 rounded-full bg-secondary/50 text-foreground hover:bg-secondary/70">
            Популярные
          </button>
          <button className="px-4 py-2 rounded-full bg-secondary/50 text-foreground hover:bg-secondary/70">
            Новые
          </button>
        </motion.div>

        {tracks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Скоро здесь появятся треки</h3>
            <p className="text-muted-foreground">Новая музыка уже в работе</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-4 flex items-center gap-4 hover:bg-card/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {track.cover_url ? (
                    <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-8 h-8 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">{track.artist} • {track.genre}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDuration(track.duration)} • {track.plays_count || 0} прослушиваний
                    {track.likes_count ? ` • ❤️ ${track.likes_count}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(track.id, track.liked || false)}
                    className={`p-2 rounded-full hover:bg-primary/10 transition-colors ${
                      track.liked ? 'text-red-500' : 'text-muted-foreground'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${track.liked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handlePlay(track)}
                    className={`p-2 rounded-full ${
                      playingTrack === track.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {playingTrack === track.id ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}