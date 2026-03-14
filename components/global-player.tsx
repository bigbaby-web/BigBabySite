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

  if (!currentTrack || !isPlayerVisible) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / duration) * 100 || 0

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <motion.div
        animate={{ height: isMinimized ? 60 : 100 }}
        className="backdrop-blur-xl bg-glass border-t border-glass-border shadow-2xl"
      >
        {/* Верхняя панель с информацией */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-glass-border">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center overflow-hidden">
              {currentTrack.cover_url ? (
                <img src={currentTrack.cover_url} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{currentTrack.title}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground truncate">{currentTrack.artist}</span>
              </div>
              {/* Прогресс бар сверху */}
              <div className="w-full h-1 bg-secondary/30 rounded-full mt-1">
                <motion.div
                  className="h-1 bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Нижняя панель с управлением (скрывается при сворачивании) */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 40 }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 flex items-center justify-between"
            >
              {/* Время */}
              <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>

              {/* Кнопки управления */}
              <div className="flex items-center gap-3">
                <button
                  onClick={playPrev}
                  className="p-1.5 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  <SkipBack size={16} />
                </button>
                
                <button
                  onClick={isPlaying ? pauseTrack : resumeTrack}
                  className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                
                <button
                  onClick={playNext}
                  className="p-1.5 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Громкость */}
              <div className="flex items-center gap-2 w-20">
                <button
                  onClick={toggleMute}
                  className="p-1 rounded-full hover:bg-secondary/50 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-12 h-1 bg-secondary rounded-full appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-2 
                    [&::-webkit-slider-thumb]:h-2 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}