"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, LogOut, Shield, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { usePlayer } from "@/contexts/player-context"

interface GlassNavigationProps {
  onOpenAuth: (type: "login" | "register") => void
}

const navItems = [
  { id: "home", label: "Главная", href: "/" },
  { id: "tracks", label: "Треки", href: "/tracks" },
  { id: "services", label: "Услуги", href: "/services" },
  { id: "about", label: "Обо мне", href: "/about" },
  { id: "contacts", label: "Контакты", href: "/contacts" },
]

export function GlassNavigation({ onOpenAuth }: GlassNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const { currentTrack, isPlayerVisible, setIsPlayerVisible } = usePlayer()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
        <nav className="max-w-6xl mx-auto backdrop-blur-xl bg-glass border border-glass-border rounded-2xl px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BIG BABY
              </span>
            </Link>
            <div className="w-20 h-9 bg-secondary/50 rounded-xl animate-pulse" />
          </div>
        </nav>
      </header>
    )
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <nav className="max-w-6xl mx-auto backdrop-blur-xl bg-glass border border-glass-border rounded-2xl px-4 md:px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
            >
              BIG BABY
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Кнопка админ-панели (только для админа) */}
                {user.email === "bigbaby.xyz@gmail.com" && (
                  <Link href="/admin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Админ</span>
                    </motion.button>
                  </Link>
                )}
                
                {/* Кнопка профиля */}
                <Link href="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Профиль</span>
                  </motion.button>
                </Link>
                
                {/* Кнопка выхода */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={signOut}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth("login")}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
                >
                  Войти
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
                >
                  Регистрация
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-secondary/50 text-foreground"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full px-4 py-3 rounded-xl text-left font-medium ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-foreground hover:bg-secondary"
                      }`}
                    >
                      {item.label}
                    </button>
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                {user ? (
                  <div className="flex flex-col gap-2 pt-2">
                    {/* Админка в мобильном меню */}
                    {user.email === "bigbaby.xyz@gmail.com" && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/20 text-primary">
                          <Shield className="w-5 h-5" />
                          <span>Админ-панель</span>
                        </button>
                      </Link>
                    )}
                    
                    {/* Профиль в мобильном меню */}
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary/70">
                        <User className="w-5 h-5" />
                        <span>Профиль</span>
                      </button>
                    </Link>
                    
                    {/* Выход в мобильном меню */}
                    <button
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 text-destructive"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Выйти</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        onOpenAuth("login")
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 text-foreground"
                    >
                      Войти
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth("register")
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground"
                    >
                      Регистрация
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Кнопка для скрытия/открытия плеера (только если есть трек) */}
      {currentTrack && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed right-6 top-24 z-40 px-4 py-2 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
          onClick={() => setIsPlayerVisible(!isPlayerVisible)}
        >
          {isPlayerVisible ? (
            <>
              <ChevronDown size={18} />
              <span className="text-sm font-medium">Скрыть плеер</span>
            </>
          ) : (
            <>
              <ChevronUp size={18} />
              <span className="text-sm font-medium">Показать плеер</span>
            </>
          )}
        </motion.button>
      )}
    </motion.header>
  )
}