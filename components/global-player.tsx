"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ChevronDown
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

  const [isVisible, setIsVisible] = useState(true)
  const progressRef = useRef<HTMLInputElement>(null)

  if (!currentTrack) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Если плеер скрыт - показываем только маленькую стрелочку
  if (!isVisible) {
    return (
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronDown className="w-5 h-5 rotate-180" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <motion.div className="backdrop-blur-xl bg-glass border-t border-glass-border shadow-2xl relative">
        {/* Кнопка скрытия справа */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 -top-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg hover:bg-primary/90 transition-colors z-10"
          title="Скрыть плеер"
        >
          <ChevronDown size={16} />
        </button>

        <div className="px-3 py-2 md:px-4 md:py-3 pt-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
            {/* Информация о треке */}
            <div className="flex items-center gap-2 md:w-64 pr-8 md:pr-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                {currentTrack.cover_url ? (
                  <img src={currentTrack.cover_url} alt={currentTrack.title} className="w-full h-full object-cover" />
                ) : (
                  <Music className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm md:text-base truncate">{currentTrack.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Управление и прогресс */}
            <div className="flex-1 flex flex-col items-center">
              {/* Прогресс */}
              <div className="w-full flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground w-8 text-right">{formatTime(currentTime)}</span>
                <input
                  ref={progressRef}
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-3 
                    [&::-webkit-slider-thumb]:h-3 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-primary
                    [&::-webkit-slider-thumb]:shadow-md"
                />
                <span className="text-xs text-muted-foreground w-8">{formatTime(duration)}</span>
              </div>

              {/* Кнопки управления */}
              <div className="flex items-center gap-4 md:gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    console.log("Prev clicked")
                    playPrev()
                  }}
                  className="p-1.5 md:p-2 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  <SkipBack size={18} className="md:w-5 md:h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    console.log("Play/Pause clicked")
                    if (isPlaying) {
                      pauseTrack()
                    } else {
                      resumeTrack()
                    }
                  }}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center shadow-lg"
                >
                  {isPlaying ? <Pause size={16} className="md:w-5 md:h-5" /> : <Play size={16} className="md:w-5 md:h-5 ml-0.5" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    console.log("Next clicked")
                    playNext()
                  }}
                  className="p-1.5 md:p-2 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  <SkipForward size={18} className="md:w-5 md:h-5" />
                </motion.button>
              </div>
            </div>

            {/* Громкость */}
            <div className="flex items-center justify-center gap-2 mt-2 md:mt-0 md:w-48 md:justify-end">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="p-1.5 md:p-2 rounded-full hover:bg-secondary/50 transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX size={16} className="md:w-5 md:h-5" /> : <Volume2 size={16} className="md:w-5 md:h-5" />}
              </motion.button>
              
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-16 md:w-20 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer 
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-3 
                  [&::-webkit-slider-thumb]:h-3 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}