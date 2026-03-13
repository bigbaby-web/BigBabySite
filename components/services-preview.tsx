"use client"

import { motion } from "framer-motion"
import { Mic2, Music, Headphones, Wand2, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Music,
    title: "Создание треков",
    gradient: "from-rose-500 to-orange-500",
  },
  {
    icon: Mic2,
    title: "Биты на заказ",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Headphones,
    title: "Сведение и мастеринг",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Wand2,
    title: "AI-консультации",
    gradient: "from-emerald-500 to-teal-500",
  },
]

export function ServicesPreview() {
  return (
    <section className="relative py-16 sm:py-24 px-4">
      <div className="max-w-5xl mx-auto">
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
            <span className="font-medium">Услуги</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Что я предлагаю
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg px-4 max-w-2xl mx-auto">
            Профессиональные музыкальные услуги с использованием AI-технологий
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl p-5 text-center group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg`}
              >
                <service.icon className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                {service.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-glass border border-glass-border text-foreground font-medium hover:bg-secondary/50 transition-colors"
            >
              <span>Все услуги</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
