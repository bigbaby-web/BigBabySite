"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music
} from "lucide-react"
import { usePlayer } from "@/contexts/player-context"

export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    pauseTrack,
    resumeTrack,
    playNext,
    playPrev,
    seekTo,
    toggleMute,
    changeVolume
  } = usePlayer()

  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)

  useEffect(() => {
    if (currentTrack && isPlaying) {
      setHasPlayedOnce(true)
    }
  }, [currentTrack, isPlaying])

  if (!currentTrack) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-glass border-t border-glass-border shadow-2xl h-20"
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        {/* Информация о треке */}
        <div className="flex items-center gap-3 w-64">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center overflow-hidden">
            {currentTrack.cover_url ? (
              <img src={currentTrack.cover_url} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <Music className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{currentTrack.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Управление */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={playPrev}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
            >
              <SkipBack size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={isPlaying ? pauseTrack : resumeTrack}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={playNext}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
            >
              <SkipForward size={20} />
            </motion.button>
          </div>

          {/* Прогресс */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-secondary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Громкость */}
        <div className="w-64 flex items-center justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </motion.button>
          
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-secondary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />
        </div>
      </div>
    </motion.div>
  )
}