"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Music, Plus, Edit3, Trash2, Eye, EyeOff, Save, X, Upload, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Только этот email имеет доступ (временно отключено)
const ADMIN_EMAIL = "bigbaby.xyz@gmail.com"

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

export default function AdminPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    artist: "Big Baby",
    genre: "",
    duration: 0,
    cover_url: "",
    audio_url: "",
    is_published: true
  })

  // Проверка доступа (ВРЕМЕННО ОТКЛЮЧЕНО)
  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
    
    // Проверка по email ЗАКОММЕНТИРОВАНА
    // if (user.email !== ADMIN_EMAIL) {
    //   router.push("/")
    //   return
    // }

    fetchTracks()
  }, [user])

  const fetchTracks = async () => {
    const { data } = await supabase
      .from("tracks")
      .select("*")
      .order("created_at", { ascending: false })
    
    setTracks(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTrack) {
      await supabase
        .from("tracks")
        .update(formData)
        .eq("id", editingTrack.id)
    } else {
      await supabase
        .from("tracks")
        .insert([{ ...formData, user_id: user?.id }])
    }
    
    setShowModal(false)
    setEditingTrack(null)
    fetchTracks()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить трек?")) return
    await supabase.from("tracks").delete().eq("id", id)
    fetchTracks()
  }

  const togglePublish = async (track: Track) => {
    await supabase
      .from("tracks")
      .update({ is_published: !track.is_published })
      .eq("id", track.id)
    fetchTracks()
  }

  // Если пользователь не залогинен - редирект
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Шапка */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-card/30 border">
            <p className="text-sm text-muted-foreground">Всего треков</p>
            <p className="text-3xl font-bold">{tracks.length}</p>
          </div>
          <div className="p-6 rounded-2xl bg-card/30 border">
            <p className="text-sm text-muted-foreground">Опубликовано</p>
            <p className="text-3xl font-bold">{tracks.filter(t => t.is_published).length}</p>
          </div>
          <div className="p-6 rounded-2xl bg-card/30 border">
            <p className="text-sm text-muted-foreground">Прослушиваний</p>
            <p className="text-3xl font-bold">
              {tracks.reduce((acc, t) => acc + (t.plays_count || 0), 0)}
            </p>
          </div>
        </div>

        {/* Кнопка добавления */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Управление треками</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white"
          >
            <Plus className="w-4 h-4" />
            Добавить трек
          </button>
        </div>

        {/* Список треков */}
        {loading ? (
          <div className="text-center py-20">Загрузка...</div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-20 border rounded-2xl">
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p>Треков пока нет</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tracks.map((track) => (
              <div key={track.id} className="p-4 border rounded-2xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Music className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => togglePublish(track)}>
                    {track.is_published ? <EyeOff /> : <Eye />}
                  </button>
                  <button onClick={() => {
                    setEditingTrack(track)
                    setFormData(track)
                    setShowModal(true)
                  }}>
                    <Edit3 />
                  </button>
                  <button onClick={() => handleDelete(track.id)}>
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Модалка добавления/редактирования */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTrack ? "Редактировать" : "Новый трек"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Название"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Исполнитель"
                value={formData.artist}
                onChange={(e) => setFormData({...formData, artist: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Жанр"
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Длительность (сек)"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: +e.target.value})}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}