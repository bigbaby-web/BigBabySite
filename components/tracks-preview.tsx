"use client"

import { motion } from "framer-motion"
import { Music2, ArrowRight, Disc3 } from "lucide-react"
import Link from "next/link"

export function TracksPreview() {
  return (
    <section className="relative py-16 sm:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <Disc3 className="w-5 h-5" />
            <span className="font-medium">Музыка</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Мои треки
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg px-4 max-w-2xl mx-auto">
            Музыка, созданная на стыке человеческого творчества и ИИ
          </p>
        </motion.div>

        {/* Preview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl p-8 sm:p-12 text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
          >
            <Music2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </motion.div>

          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            Откройте мою музыку
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-8">
            Слушайте, комментируйте и наслаждайтесь уникальными треками
          </p>

          <Link href="/tracks">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(176, 212, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg"
            >
              <span>Перейти к трекам</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
