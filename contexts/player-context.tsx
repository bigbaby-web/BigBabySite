"use client"

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

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

interface PlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  queue: Track[]
  playTrack: (track: Track) => Promise<void>
  pauseTrack: () => void
  resumeTrack: () => Promise<void>
  playNext: () => void
  playPrev: () => void
  seekTo: (time: number) => void
  toggleMute: () => void
  changeVolume: (vol: number) => void
  addToQueue: (track: Track) => void
  clearQueue: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [queue, setQueue] = useState<Track[]>([])
  const [hasIncrementedPlay, setHasIncrementedPlay] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const supabase = createClient()

  useEffect(() => {
    audioRef.current = new Audio()
    
    const audio = audioRef.current
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }
    
    const handleEnded = () => {
      setIsPlaying(false)
      setHasIncrementedPlay(false)
      // Автоматически играем следующий трек
      if (queue.length > 0 && currentTrack) {
        playNext()
      }
    }
    
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Обновляем эффект при изменении queue и currentTrack для handleEnded
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setIsPlaying(false)
      setHasIncrementedPlay(false)
      if (queue.length > 0 && currentTrack) {
        playNext()
      }
    }

    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [queue, currentTrack])

  const playTrack = async (track: Track) => {
    if (!audioRef.current) return

    // Если это тот же трек
    if (currentTrack?.id === track.id) {
      try {
        await audioRef.current.play()
        return
      } catch (error) {
        console.error("Ошибка воспроизведения:", error)
      }
      return
    }

    // Останавливаем текущий трек
    audioRef.current.pause()
    setHasIncrementedPlay(false)
    
    // Загружаем новый
    audioRef.current.src = track.audio_url || ''
    audioRef.current.volume = isMuted ? 0 : volume
    
    try {
      await audioRef.current.play()
      setCurrentTrack(track)
      
      // Добавляем в очередь, если ещё нет
      if (!queue.find(t => t.id === track.id)) {
        setQueue(prev => [...prev, track])
      }
      
      // Увеличиваем счетчик только один раз
      if (!hasIncrementedPlay) {
        await supabase
          .from("tracks")
          .update({ plays_count: (track.plays_count || 0) + 1 })
          .eq("id", track.id)
        setHasIncrementedPlay(true)
      }
    } catch (error) {
      console.error("Ошибка воспроизведения:", error)
    }
  }

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const resumeTrack = async () => {
    if (audioRef.current && currentTrack) {
      try {
        await audioRef.current.play()
      } catch (error) {
        console.error("Ошибка воспроизведения:", error)
      }
    }
  }

  const playNext = () => {
    if (queue.length === 0 || !currentTrack) return
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
    if (currentIndex === -1) return
    
    const nextIndex = (currentIndex + 1) % queue.length
    playTrack(queue[nextIndex])
  }

  const playPrev = () => {
    if (queue.length === 0 || !currentTrack) return
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
    if (currentIndex === -1) return
    
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length
    playTrack(queue[prevIndex])
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const changeVolume = (vol: number) => {
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
    if (vol === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track])
  }

  const clearQueue = () => {
    setQueue([])
  }

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      queue,
      playTrack,
      pauseTrack,
      resumeTrack,
      playNext,
      playPrev,
      seekTo,
      toggleMute,
      changeVolume,
      addToQueue,
      clearQueue
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error("usePlayer must be used within PlayerProvider")
  return context
}