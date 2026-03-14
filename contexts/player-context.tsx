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
  isPlayerVisible: boolean
  setIsPlayerVisible: (visible: boolean) => void
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
  const [isPlayerVisible, setIsPlayerVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const supabase = createClient()

  useEffect(() => {
    audioRef.current = new Audio()
    
    audioRef.current.addEventListener('timeupdate', () => {
      setCurrentTime(audioRef.current?.currentTime || 0)
    })
    
    audioRef.current.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current?.duration || 0)
    })
    
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false)
      setHasIncrementedPlay(false)
      playNext()
    })
    
    audioRef.current.addEventListener('play', () => setIsPlaying(true))
    audioRef.current.addEventListener('pause', () => setIsPlaying(false))

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playTrack = async (track: Track) => {
    if (!audioRef.current) return

    if (currentTrack?.id === track.id) {
      audioRef.current.play()
      return
    }

    setHasIncrementedPlay(false)
    
    audioRef.current.pause()
    
    audioRef.current.src = track.audio_url || ''
    audioRef.current.volume = isMuted ? 0 : volume
    
    try {
      await audioRef.current.play()
      setCurrentTrack(track)
      setIsPlayerVisible(true)
      
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
      await audioRef.current.play()
    }
  }

  const playNext = () => {
    if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
      const nextIndex = (currentIndex + 1) % queue.length
      playTrack(queue[nextIndex])
    }
  }

  const playPrev = () => {
    if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
      const prevIndex = (currentIndex - 1 + queue.length) % queue.length
      playTrack(queue[prevIndex])
    }
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0
      setIsMuted(!isMuted)
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
      isPlayerVisible,
      setIsPlayerVisible,
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