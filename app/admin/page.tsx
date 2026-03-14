"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
    if (user && user.email !== "bigbaby.xyz@gmail.com") {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || user.email !== "bigbaby.xyz@gmail.com") {
    return null
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Админ-панель</h1>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Выйти
        </button>
      </div>
      <p>Добро пожаловать, {user.email}</p>
      <p className="mt-4 text-green-600">✅ Всё работает!</p>
    </div>
  )
}