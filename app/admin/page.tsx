"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    // Проверка по твоему email
    if (user.email !== "bigbaby.xyz@gmail.com") {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return <div>Загрузка...</div>
  }

  if (user.email !== "bigbaby.xyz@gmail.com") {
    return null
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Админ-панель</h1>
      <p>Добро пожаловать, {user.email}!</p>
      <p>Здесь будет управление треками</p>
    </div>
  )
}