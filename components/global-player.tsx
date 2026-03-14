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
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
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
  const [isMinimized, setIsMinimized] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  if (!currentTrack) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / duration) * 100 || 0

  // Кнопка для открытия плеера (когда он скрыт)
  if (!isVisible) {
    return (
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-2xl flex items-center gap-2 hover:shadow-3xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="w-5 h-5" />
        <span className="font-medium">Показать плеер</span>
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        animate={{ height: isMinimized ? 70 : 180 }}
        className="backdrop-blur-xl bg-glass border-t border-glass-border shadow-2xl relative"
      >
        {/* Анимированная полоса прогресса на фоне */}
        <motion.div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />

        {/* Заголовок с кнопками управления */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-glass-border relative">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center overflow-hidden shadow-lg"
            >
              {currentTrack.cover_url ? (
                <img src={currentTrack.cover_url} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-5 h-5 text-primary" />
              )}
            </motion.div>
            <div>
              <motion.h4 
                className="font-semibold"
                animate={{ color: isHovering ? "var(--primary)" : "var(--foreground)" }}
              >
                {currentTrack.title}
              </motion.h4>
              <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors relative overflow-hidden"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, y: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVisible(false)}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <ChevronDown size={18} />
            </motion.button>
          </div>
        </div>

        {/* Контент плеера (скрывается при сворачивании) */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {/* Прогресс с красивым ползунком */}
              <div className="flex items-center gap-3 mb-6">
                <motion.span 
                  className="text-xs font-mono text-muted-foreground w-10"
                  animate={{ scale: isHovering ? 1.1 : 1 }}
                >
                  {formatTime(currentTime)}
                </motion.span>
                
                <div className="flex-1 relative group">
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => seekTo(parseFloat(e.target.value))}
                    className="w-full h-2 bg-secondary/30 rounded-full appearance-none cursor-pointer 
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:w-4 
                      [&::-webkit-slider-thumb]:h-4 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-primary 
                      [&::-webkit-slider-thumb]:shadow-lg
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-125
                      [&::-webkit-slider-thumb]:active:scale-90"
                  />
                  {/* Анимированный фон прогресса */}
                  <motion.div
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary to-accent rounded-full pointer-events-none"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                </div>
                
                <motion.span 
                  className="text-xs font-mono text-muted-foreground w-10 text-right"
                  animate={{ scale: isHovering ? 1.1 : 1 }}
                >
                  {formatTime(duration)}
                </motion.span>
              </div>

              {/* Управление по центру */}
              <div className="flex items-center justify-center gap-6 mb-4">
                <motion.button
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={playPrev}
                  className="p-3 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  <SkipBack size={22} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={isPlaying ? pauseTrack : resumeTrack}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center shadow-xl relative overflow-hidden"
                >
                  {/* Пульсирующий эффект при воспроизведении */}
                  {isPlaying && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={playNext}
                  className="p-3 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  <SkipForward size={22} />
                </motion.button>
              </div>

              {/* Громкость справа */}
              <div className="flex items-center justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </motion.button>
                
                <div className="relative group">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-24 h-1.5 bg-secondary/30 rounded-full appearance-none cursor-pointer 
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:w-3 
                      [&::-webkit-slider-thumb]:h-3 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-primary
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-125"
                  />
                  <motion.div
                    className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full pointer-events-none"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}