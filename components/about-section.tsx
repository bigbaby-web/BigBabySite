"use client"

import { motion } from "framer-motion"
import { Cpu, Headphones, Sparkles, Zap } from "lucide-react"

const features = [
  {
    icon: Cpu,
    title: "Искусственный интеллект",
    description: "Использую передовые нейросети для создания уникальных звуковых текстур и мелодий",
  },
  {
    icon: Headphones,
    title: "Профессиональное качество",
    description: "Каждый трек проходит профессиональный мастеринг для идеального звучания",
  },
  {
    icon: Sparkles,
    title: "Миллион стилей",
    description: "От эмбиента до техно — ИИ помогает исследовать безграничные музыкальные горизонты",
  },
  {
    icon: Zap,
    title: "Быстрое создание",
    description: "Технологии позволяют создавать качественную музыку в кратчайшие сроки",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
            Обо мне
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Привет! Я Big Baby — музыкальный продюсер, который объединяет человеческое творчество 
            с возможностями искусственного интеллекта
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4"
              >
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
              </motion.div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-1.5 sm:mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 sm:mt-16 backdrop-blur-xl bg-glass border border-glass-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-lg"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-5 sm:mb-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground">BB</span>
            </motion.div>
            
            <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-foreground mb-4 sm:mb-6 leading-relaxed px-2">
              {"«"}Музыка — это язык эмоций. ИИ помогает мне говорить на этом языке 
              с бесконечной палитрой красок и оттенков{"»"}
            </blockquote>
            
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed px-2">
              Я начал экспериментировать с ИИ в музыке в 2023 году и с тех пор создал 
              сотни уникальных треков. Каждая композиция — это симбиоз человеческой 
              креативности и машинного обучения. Мой подход — это не замена живого 
              творчества, а его усиление и расширение границ возможного.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
