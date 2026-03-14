"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Music, 
  Upload, 
  Save,
  X,
  Eye,
  EyeOff,
  Play,
  Pause,
  LogOut,
  Shield,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
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
  created_at: string
  plays_count: number
}

export default function AdminPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [tracks, setTracks] = useState<Track[]>([])
  const [tracksLoading, setTracksLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    artist: "Big Baby",
    genre: "",
    cover_url: "",
    audio_url: "",
    is_published: true
  })

  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [audioDuration, setAudioDuration] = useState(0)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/")
      } else if (user.email !== "bigbaby.xyz@gmail.com") {
        router.push("/")
      } else {
        fetchTracks()
      }
    }
  }, [user, loading, router])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const fetchTracks = async () => {
    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tracks:", error)
      showNotification('error', 'Ошибка загрузки треков')
    } else {
      setTracks(data || [])
    }
    setTracksLoading(false)
  }

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.src = URL.createObjectURL(file)
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.round(audio.duration))
        URL.revokeObjectURL(audio.src)
      })
    })
  }

  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string | null> => {
    // Очищаем имя файла
    const cleanName = file.name
      .replace(/[^a-zA-Z0-9.]/g, '_')
      .toLowerCase()
    const fileName = `${folder}/${Date.now()}-${cleanName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return publicUrl
    } catch (err) {
      console.error("Upload error:", err)
      return null
    }
  }

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      // Получаем длительность аудио
      const duration = await getAudioDuration(file)
      setAudioDuration(duration)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let audioUrl = formData.audio_url
      let coverUrl = formData.cover_url
      let duration = editingTrack?.duration || 0

      if (audioFile) {
        const uploadedAudioUrl = await uploadFile(audioFile, "tracks", "audio")
        if (uploadedAudioUrl) {
          audioUrl = uploadedAudioUrl
          duration = audioDuration
        }
      }

      if (coverFile) {
        const uploadedCoverUrl = await uploadFile(coverFile, "tracks", "covers")
        if (uploadedCoverUrl) coverUrl = uploadedCoverUrl
      }

      const trackData = {
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        duration: duration,
        cover_url: coverUrl || null,
        audio_url: audioUrl || null,
        is_published: formData.is_published,
        user_id: user?.id
      }

      if (editingTrack) {
        const { error } = await supabase
          .from("tracks")
          .update(trackData)
          .eq("id", editingTrack.id)

        if (error) throw error
        showNotification('success', 'Трек успешно обновлен!')
      } else {
        const { error } = await supabase
          .from("tracks")
          .insert([trackData])

        if (error) throw error
        showNotification('success', 'Трек успешно добавлен!')
      }

      resetForm()
      fetchTracks()
    } catch (error) {
      console.error("Error saving track:", error)
      showNotification('error', 'Ошибка сохранения трека')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот трек?")) return

    const { error } = await supabase
      .from("tracks")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting track:", error)
      showNotification('error', 'Ошибка удаления трека')
    } else {
      showNotification('success', 'Трек удален')
      fetchTracks()
    }
  }

  const togglePublish = async (track: Track) => {
    const { error } = await supabase
      .from("tracks")
      .update({ is_published: !track.is_published })
      .eq("id", track.id)

    if (error) {
      console.error("Error toggling publish:", error)
      showNotification('error', 'Ошибка изменения статуса')
    } else {
      showNotification('success', track.is_published ? 'Трек скрыт' : 'Трек опубликован')
      fetchTracks()
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      artist: "Big Baby",
      genre: "",
      cover_url: "",
      audio_url: "",
      is_published: true
    })
    setAudioFile(null)
    setCoverFile(null)
    setAudioDuration(0)
    setShowAddModal(false)
    setEditingTrack(null)
  }

  const startEdit = (track: Track) => {
    setEditingTrack(track)
    setFormData({
      title: track.title,
      artist: track.artist,
      genre: track.genre,
      cover_url: track.cover_url || "",
      audio_url: track.audio_url || "",
      is_published: track.is_published
    })
    setAudioDuration(track.duration)
    setShowAddModal(true)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading || tracksLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || user.email !== "bigbaby.xyz@gmail.com") {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-xl border ${
              notification.type === 'success' 
                ? 'bg-green-500/20 border-green-500/30 text-green-400'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent"
              >
                Big Baby
              </motion.div>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Админ-панель</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tracks.length}</p>
                <p className="text-sm text-muted-foreground">Всего треков</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tracks.filter(t => t.is_published).length}</p>
                <p className="text-sm text-muted-foreground">Опубликовано</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tracks.reduce((acc, t) => acc + (t.plays_count || 0), 0)}</p>
                <p className="text-sm text-muted-foreground">Прослушиваний</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Управление треками</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Добавить трек
          </motion.button>
        </div>

        {tracks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-12 text-center"
          >
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Треков пока нет</h3>
            <p className="text-muted-foreground mb-6">Добавьте свой первый трек</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              Добавить трек
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {track.cover_url ? (
                    <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-8 h-8 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">{track.artist} • {track.genre}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDuration(track.duration)} • {track.plays_count || 0} прослушиваний
                  </p>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  track.is_published 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {track.is_published ? 'Опубликован' : 'Скрыт'}
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePublish(track)}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                    title={track.is_published ? "Скрыть" : "Опубликовать"}
                  >
                    {track.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEdit(track)}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                    title="Редактировать"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(track.id)}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={resetForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg backdrop-blur-xl bg-card border border-border/50 rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingTrack ? "Редактировать трек" : "Добавить трек"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetForm}
                  className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название трека *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Введите название"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Исполнитель</label>
                  <input
                    type="text"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Big Baby"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Жанр</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border/50 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Hip-Hop, R&B, Pop..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Аудио файл *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileChange}
                      className="hidden"
                      id="audio-upload"
                      required={!editingTrack}
                    />
                    <label
                      htmlFor="audio-upload"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border/50 border-dashed cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {audioFile ? audioFile.name : "Выберите аудио файл"}
                      </span>
                    </label>
                  </div>
                  {audioDuration > 0 && (
                    <p className="text-xs text-green-500 mt-1">
                      Длительность: {formatDuration(audioDuration)}
                    </p>
                  )}
                  {formData.audio_url && !audioFile && (
                    <p className="text-xs text-muted-foreground mt-1">Текущий файл загружен</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Обложка</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border/50 border-dashed cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {coverFile ? coverFile.name : "Выберите изображение"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="font-medium">Опубликовать сразу</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.is_published ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      formData.is_published ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingTrack ? "Сохранить изменения" : "Добавить трек"}
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}