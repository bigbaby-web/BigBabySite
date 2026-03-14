"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Music, Play, Heart, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

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
}

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTracks()
  }, [])

  const fetchTracks = async () => {
    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tracks:", error)
    } else {
      setTracks(data || [])
    }
    setLoading(false)
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Мои Треки
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Слушай, комментируй и наслаждайся уникальной музыкой, созданной на стыке творчества и ИИ
          </p>
        </motion.div>

        {/* Filters */}
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

        {/* Tracks Grid */}
        {tracks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Скоро здесь появятся треки</h3>
            <p className="text-muted-foreground">Новая музыка уже в работе. Следите за обновлениями!</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-4 flex items-center gap-4 hover:bg-card/50 transition-colors cursor-pointer"
              >
                {/* Cover */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {track.cover_url ? (
                    <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-8 h-8 text-primary" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">{track.artist} • {track.genre}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDuration(track.duration)} • {track.plays_count || 0} прослушиваний
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-primary text-primary-foreground">
                    <Play className="w-5 h-5" />
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