"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  X
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

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  if (!currentTrack) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Маленькая плавающая кнопка
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-2xl flex items-center justify-center"
      >
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      </motion.button>
    )
  }

  // Развернутый плеер
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:bottom-6 md:left-auto md:right-6 md:w-96"
      >
        <motion.div
          animate={{ height: isMinimized ? 60 : 120 }}
          className="backdrop-blur-xl bg-glass border border-glass-border rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Заголовок */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-glass-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                <Music className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm font-medium truncate max-w-[150px]">
                {currentTrack.title}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Контент плеера */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4"
              >
                {/* Информация о треке */}
                <div className="flex items-center gap-3 mb-4">
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

                {/* Прогресс */}
                <div className="flex items-center gap-2 mb-4">
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

                {/* Управление */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={playPrev}
                      className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                    >
                      <SkipBack size={18} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={isPlaying ? pauseTrack : resumeTrack}
                      className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={playNext}
                      className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                    >
                      <SkipForward size={18} />
                    </motion.button>
                  </div>

                  {/* Громкость */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                    >
                      {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </motion.button>
                    
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => changeVolume(parseFloat(e.target.value))}
                      className="w-16 h-1 bg-secondary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}