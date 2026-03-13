"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Heart,
  MessageCircle,
  Music,
  Shield,
  Loader2
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [stats, setStats] = useState({ likes: 0, comments: 0 })
  const [isAdmin, setIsAdmin] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "")
      setDisplayName((profile as { display_name?: string }).display_name || "")
      setAvatarPreview(profile.avatar_url)
    }
  }, [profile])

  useEffect(() => {
    if (user) {
      fetchStats()
      checkAdminStatus()
    }
  }, [user])

  const fetchStats = async () => {
    if (!user) return

    try {
      const [likesResult, commentsResult] = await Promise.all([
        supabase.from("likes").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("comments").select("id", { count: "exact" }).eq("user_id", user.id)
      ])

      setStats({
        likes: likesResult.count || 0,
        comments: commentsResult.count || 0
      })
    } catch (err) {
      console.error("Error fetching stats:", err)
    }
  }

  const checkAdminStatus = async () => {
    if (!user) return

    try {
      // Check if this is the first registered user
      const { data, error } = await supabase
        .from("profiles")
        .select("id, created_at")
        .order("created_at", { ascending: true })
        .limit(1)
        .single()

      if (data && !error && data.id === user.id) {
        setIsAdmin(true)
      }
    } catch (err) {
      console.error("Error checking admin status:", err)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    try {
      let avatarUrl = profile?.avatar_url

      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, { upsert: true })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(fileName)
          avatarUrl = publicUrl
        }
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          display_name: displayName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)

      if (error) throw error

      await refreshProfile()
      setIsEditing(false)
      setAvatarFile(null)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setUsername(profile?.username || "")
    setDisplayName((profile as { display_name?: string })?.display_name || "")
    setAvatarPreview(profile?.avatar_url || null)
    setAvatarFile(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  const joinDate = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('ru-RU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : ""

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/graffiti-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header Banner */}
          <div className="h-32 sm:h-40 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 relative">
            <div className="absolute inset-0 bg-[url('/graffiti-bg.jpg')] bg-cover bg-center opacity-20" />
          </div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 sm:-mt-20 mb-6 flex justify-center sm:justify-start">
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-background bg-gradient-to-br from-primary/30 to-accent/30 overflow-hidden shadow-xl"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-primary/50" />
                    </div>
                  )}
                </motion.div>

                {isEditing && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 text-center sm:text-left">
                {isEditing ? (
                  <div className="space-y-4 max-w-sm mx-auto sm:mx-0">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        Имя пользователя
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-glass-border focus:border-primary/50 focus:outline-none transition-colors text-foreground"
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        Отображаемое имя
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-glass-border focus:border-primary/50 focus:outline-none transition-colors text-foreground"
                        placeholder="Ваше имя"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {(profile as { display_name?: string })?.display_name || profile?.username || "Пользователь"}
                      </h1>
                      {isAdmin && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    {profile?.username && (
                      <p className="text-muted-foreground">@{profile.username}</p>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center sm:justify-end gap-2">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={cancelEdit}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-secondary/50 text-foreground font-medium flex items-center gap-2 hover:bg-secondary/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Отмена
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Сохранить
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded-xl bg-secondary/50 text-foreground font-medium flex items-center gap-2 hover:bg-secondary/70 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Редактировать
                    </motion.button>
                    {isAdmin && (
                      <Link href="/admin">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Админ-панель
                        </motion.button>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-2xl bg-secondary/30 border border-glass-border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-2xl bg-secondary/30 border border-glass-border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Дата регистрации</p>
                    <p className="font-medium text-foreground">{joinDate}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20 text-center"
              >
                <Heart className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                <p className="text-2xl font-bold text-foreground">{stats.likes}</p>
                <p className="text-xs text-muted-foreground">Лайков</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center"
              >
                <MessageCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{stats.comments}</p>
                <p className="text-xs text-muted-foreground">Комментариев</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center"
              >
                <Music className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Плейлистов</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <Link href="/tracks">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-5 rounded-2xl backdrop-blur-xl bg-glass border border-glass-border cursor-pointer group"
            >
              <Music className="w-8 h-8 mb-3 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground">Слушать треки</h3>
              <p className="text-sm text-muted-foreground">Откройте для себя новую музыку</p>
            </motion.div>
          </Link>

          <Link href="/services">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="p-5 rounded-2xl backdrop-blur-xl bg-glass border border-glass-border cursor-pointer group"
            >
              <Edit3 className="w-8 h-8 mb-3 text-accent group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground">Заказать трек</h3>
              <p className="text-sm text-muted-foreground">Создадим музыку вместе</p>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
