"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  ChevronUp,
  ChevronDown,
  Music2,
  X
} from "lucide-react"

export interface Track {
  id: string
  title: string
  artist: string
  duration: number
  audio_url: string | null
  cover_url: string | null
  coverGradient?: string
}

interface MusicPlayerProps {
  track: Track | null
  isPlaying: boolean
  onPlayPause: () => void
  onNext?: () => void
  onPrevious?: () => void
  onClose: () => void
}

export function MusicPlayer({ 
  track, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  onClose 
}: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, track])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      audioRef.current.currentTime = percent * duration
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!track) return null

  return (
    <>
      {/* Audio Element */}
      {track.audio_url && (
        <audio
          ref={audioRef}
          src={track.audio_url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onNext}
          loop={isRepeat}
        />
      )}

      {/* Expanded Player Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
          >
            <div className="h-full flex flex-col items-center justify-center p-8">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(false)}
                className="absolute top-6 right-6 p-3 rounded-full bg-secondary/50 text-foreground"
              >
                <ChevronDown className="w-6 h-6" />
              </motion.button>

              {/* Cover Art - Large */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl shadow-2xl overflow-hidden mb-8 ${track.coverGradient || "bg-gradient-to-br from-primary/40 to-accent/40"}`}
              >
                {track.cover_url ? (
                  <img 
                    src={track.cover_url} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 className="w-24 h-24 text-primary-foreground/50" />
                  </div>
                )}
                
                {/* Animated vinyl effect */}
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border-2 border-primary-foreground/20"
                />
              </motion.div>

              {/* Track Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {track.title}
                </h2>
                <p className="text-muted-foreground">{track.artist}</p>
              </motion.div>

              {/* Progress Bar - Large */}
              <div className="w-full max-w-md mb-8">
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="relative h-2 bg-secondary/50 rounded-full cursor-pointer overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    style={{ width: `${progress}%` }}
                    layoutId="progress-expanded"
                  />
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%`, marginLeft: "-8px" }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls - Large */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-6"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-3 rounded-full transition-colors ${isShuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Shuffle className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onPrevious}
                  className="p-3 rounded-full text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <SkipBack className="w-8 h-8" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onPlayPause}
                  className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10" fill="currentColor" />
                  ) : (
                    <Play className="w-10 h-10 ml-1" fill="currentColor" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onNext}
                  className="p-3 rounded-full text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <SkipForward className="w-8 h-8" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`p-3 rounded-full transition-colors ${isRepeat ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Repeat className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Volume & Like */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-8 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-full transition-colors ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                >
                  <Heart className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} />
                </motion.button>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </motion.button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value))
                      setIsMuted(false)
                    }}
                    className="w-24 h-1 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Player */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6"
          >
            <div className="max-w-4xl mx-auto backdrop-blur-xl bg-glass border border-glass-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Progress Bar */}
              <div
                onClick={handleProgressClick}
                className="relative h-1 bg-secondary/30 cursor-pointer"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary"
                  style={{ width: `${progress}%` }}
                  layoutId="progress-mini"
                />
              </div>

              <div className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                {/* Cover Art */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(true)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl cursor-pointer overflow-hidden flex-shrink-0 ${track.coverGradient || "bg-gradient-to-br from-primary/40 to-accent/40"}`}
                >
                  {track.cover_url ? (
                    <img 
                      src={track.cover_url} 
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music2 className="w-6 h-6 text-primary-foreground/50" />
                    </div>
                  )}
                  
                  {/* Playing indicator */}
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, 14, 4] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-1 bg-primary-foreground rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Track Info */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setIsExpanded(true)}
                >
                  <h4 className="font-semibold text-foreground truncate text-sm sm:text-base">
                    {track.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {track.artist}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`hidden sm:block p-2 rounded-lg transition-colors ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                  >
                    <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onPrevious}
                    className="hidden sm:block p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <SkipBack className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onPlayPause}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
                    ) : (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" fill="currentColor" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onNext}
                    className="hidden sm:block p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(true)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
