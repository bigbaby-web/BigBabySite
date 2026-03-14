"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ChevronDown,
  ChevronUp
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
    isPlayerVisible,
    pauseTrack,
    resumeTrack,
    playNext,
    playPrev,
    seekTo,
    toggleMute,
    changeVolume
  } = usePlayer()

  const [isMinimized, setIsMinimized] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  if (!currentTrack || !isPlayerVisible) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / duration) * 100 || 0

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const percentage = x / width
    const newTime = percentage * duration
    seekTo(newTime)
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <motion.div
        animate={{ height: isMinimized ? 70 : 130 }}
        className="backdrop-blur-xl bg-glass border-t border-glass-border shadow-2xl"
      >
        {/* Верхняя панель с информацией */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-glass-border">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center overflow-hidden shadow-md">
              {currentTrack.cover_url ? (
                <img src={currentTrack.cover_url} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-base truncate">{currentTrack.title}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground truncate">{currentTrack.artist}</span>
              </div>
              {/* Кликабельный прогресс бар */}
              <div 
                ref={progressRef}
                onClick={handleProgressClick}
                className="w-full h-2 bg-secondary/30 rounded-full cursor-pointer hover:h-3 transition-all"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100" />
                </motion.div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
                <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              title={isMinimized ? "Развернуть" : "Свернуть"}
            >
              {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {/* Нижняя панель с управлением (скрывается при сворачивании) */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 50 }}
              exit={{ opacity: 0, height: 0 }}
              className="px-5 flex items-center justify-between"
            >
              {/* Кнопки управления по центру */}
              <div className="flex-1" /> {/* Пустой слева для центрирования */}
              
              <div className="flex items-center gap-4">
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
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
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

              {/* Громкость справа */}
              <div className="flex-1 flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </motion.button>
                
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-16 h-1.5 bg-secondary/30 rounded-full appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-3 
                    [&::-webkit-slider-thumb]:h-3 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-primary
                    [&::-webkit-slider-thumb]:shadow-md"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}