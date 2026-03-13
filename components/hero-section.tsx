"use client"

import { motion } from "framer-motion"
import { Sparkles, Brain, Layers, Music, Zap, Palette, Mic2, Waves, Instagram } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const badges = [
  { icon: Brain, label: "AI-музыкант", delay: 0.2 },
  { icon: Sparkles, label: "Нейросетевой продюсер", delay: 0.4 },
  { icon: Layers, label: "Миллион+ стилей", delay: 0.6 },
  { icon: Music, label: "Уникальное звучание", delay: 0.8 },
]

const features = [
  { icon: Zap, title: "Быстро", desc: "Создание треков за минуты" },
  { icon: Palette, title: "Креативно", desc: "Уникальный стиль каждого трека" },
  { icon: Mic2, title: "Качественно", desc: "Профессиональный звук" },
  { icon: Waves, title: "Современно", desc: "Актуальные тренды музыки" },
]

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden"
    >
      {/* Graffiti Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/graffiti-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.08]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80" />
      </div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-6 sm:mb-8 relative z-10"
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight"
          style={{
            textShadow: `
              0 1px 0 rgba(255,255,255,0.8),
              0 2px 0 rgba(255,255,255,0.6),
              0 3px 0 rgba(200,220,255,0.4),
              0 4px 0 rgba(176,212,255,0.3),
              0 5px 0 rgba(176,212,255,0.2),
              0 6px 6px rgba(100,150,200,0.15),
              0 10px 20px rgba(100,150,200,0.1)
            `,
          }}
        >
          <motion.span
            className="inline-block bg-gradient-to-br from-foreground via-foreground/90 to-primary bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            BIG BABY
          </motion.span>
        </motion.h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-center max-w-2xl mb-8 sm:mb-10 px-4 relative z-10"
      >
        <span className="font-medium text-foreground">Продюсер из будущего:</span>{" "}
        Сочиняю музыку вместе с ИИ
      </motion.p>

      {/* Instagram Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8 relative z-10"
      >
        <Link
          href="https://www.instagram.com/bigbaby.one?igsh=ejl1c3drbXU3dmRt"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(176, 212, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-foreground font-semibold shadow-lg hover:bg-white/15 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span>Подписаться в Instagram</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12 max-w-2xl md:max-w-4xl px-4 relative z-10"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -3 }}
            className="backdrop-blur-xl bg-glass border border-glass-border rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center group shadow-lg"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
            >
              <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </motion.div>
            <div className="text-sm sm:text-base font-semibold text-foreground mb-0.5">{feature.title}</div>
            <div className="text-xs text-muted-foreground">{feature.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Badges */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 max-w-3xl px-2 relative z-10">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: badge.delay,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.08,
              y: -5,
              boxShadow: "0 15px 40px rgba(176, 212, 255, 0.25)",
            }}
            className="group"
          >
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 backdrop-blur-xl bg-glass border border-glass-border rounded-xl sm:rounded-2xl shadow-lg cursor-default"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10"
              >
                <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </motion.div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                {badge.label}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 sm:mt-12 w-full sm:w-auto px-4 sm:px-0 relative z-10"
      >
        <Link href="/tracks" className="w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(176, 212, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base shadow-lg hover:bg-primary/90 transition-colors"
          >
            Слушать треки
          </motion.button>
        </Link>
        <Link href="/contacts" className="w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-glass border border-glass-border text-foreground font-semibold text-sm sm:text-base backdrop-blur-xl hover:bg-secondary/50 transition-colors"
          >
            Связаться
          </motion.button>
        </Link>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Листай вниз</span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5 sm:pt-2">
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-muted-foreground"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
