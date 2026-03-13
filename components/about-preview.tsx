"use client"

import { motion } from "framer-motion"
import { Brain, Sparkles, ArrowRight, Instagram } from "lucide-react"
import Link from "next/link"

export function AboutPreview() {
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
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Обо мне</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Кто я такой
          </h2>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl p-6 sm:p-10"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0"
            >
              <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
            </motion.div>

            {/* Text */}
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                BIG BABY
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Музыкант и продюсер, который создаёт уникальную музыку на стыке человеческого 
                творчества и искусственного интеллекта. Каждый трек — это эксперимент, 
                каждый звук — открытие нового.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg"
                  >
                    <span>Узнать больше</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                
                <Link
                  href="https://www.instagram.com/bigbaby.one?igsh=ejl1c3drbXU3dmRt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-foreground font-medium shadow-lg hover:bg-white/15 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>Instagram</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
