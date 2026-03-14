"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

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
  const { user, profile, signOut, loading } = useAuth()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <nav className="max-w-6xl mx-auto backdrop-blur-xl bg-glass border border-glass-border rounded-2xl px-4 md:px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
            >
              BIG BABY
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                label={item.label}
                href={item.href}
                isActive={isActive(item.href)}
              />
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-9 bg-secondary/50 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {profile?.username || "Профиль"}
                    </span>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenAuth("login")}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  Войти
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(176, 212, 255, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenAuth("register")}
                  className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md"
                >
                  Регистрация
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-secondary/50 text-foreground"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-foreground hover:bg-secondary"
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                <div className="pt-2">
                  {user ? (
                    <div className="flex items-center gap-2">
                      <Link href="/profile" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                            {profile?.avatar_url ? (
                              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              {profile?.username || "Профиль"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          signOut()
                          setIsMobileMenuOpen(false)
                        }}
                        className="p-4 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        title="Выйти"
                      >
                        <LogOut className="w-5 h-5" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onOpenAuth("login")
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex-1 px-4 py-3 rounded-xl text-center font-medium bg-secondary/50 text-foreground hover:bg-secondary/70 transition-colors"
                      >
                        Войти
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onOpenAuth("register")
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex-1 px-4 py-3 rounded-xl text-center font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        Регистрация
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

function NavButton({
  label,
  href,
  isActive,
}: {
  label: string
  href: string
  isActive: boolean
}) {
  return (
    <Link href={href}>
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer block ${
          isActive
            ? "text-primary-foreground"
            : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 bg-primary rounded-xl shadow-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">{label}</span>
      </motion.span>
    </Link>
  )
}