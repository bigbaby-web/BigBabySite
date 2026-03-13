"use client"

import { motion } from "framer-motion"
import { Music, Mic2, Headphones, Radio, Sparkles, Layers } from "lucide-react"

const services = [
  {
    icon: Music,
    title: "Создание битов",
    description: "Уникальные инструментальные треки в любом жанре — от хип-хопа до электроники",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Mic2,
    title: "Запись вокала",
    description: "Профессиональная обработка и сведение вокальных партий",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Headphones,
    title: "Мастеринг",
    description: "Финальная обработка треков для релиза на всех платформах",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    icon: Radio,
    title: "Сведение",
    description: "Балансировка и объединение всех элементов в единый микс",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Sparkles,
    title: "AI обработка",
    description: "Использование нейросетей для создания уникальных звуковых текстур",
    color: "from-violet-500/20 to-indigo-500/20",
  },
  {
    icon: Layers,
    title: "Аранжировка",
    description: "Полноценная аранжировка ваших идей и демо-записей",
    color: "from-teal-500/20 to-cyan-500/20",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="relative py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4"
          >
            Услуги
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
            Что я могу для вас сделать
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Полный спектр услуг по созданию и обработке музыки с использованием современных технологий
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group"
            >
              <div className="h-full backdrop-blur-xl bg-glass border border-glass-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg hover:border-primary/30 transition-all">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4`}
                >
                  <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10 sm:mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(176, 212, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base shadow-lg hover:bg-primary/90 transition-colors"
          >
            Обсудить проект
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
