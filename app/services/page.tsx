"use client"

import { motion } from "framer-motion"
import { 
  Mic2, 
  Music, 
  Headphones, 
  Wand2, 
  Sparkles, 
  Zap,
  CheckCircle2,
  ArrowRight
} from "lucide-react"
import { BlurIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/page-transition"
import Link from "next/link"

const services = [
  {
    icon: Music,
    title: "Создание треков",
    description: "Полный цикл создания музыки от идеи до готового трека с использованием ИИ-технологий",
    features: [
      "Уникальный стиль звучания",
      "Использование нейросетей",
      "Современные тренды",
      "Быстрые сроки"
    ],
    gradient: "from-rose-500 to-orange-500",
  },
  {
    icon: Mic2,
    title: "Биты на заказ",
    description: "Эксклюзивные биты под ваш стиль и видение. От трэпа до лоу-фай.",
    features: [
      "Любой жанр",
      "Полные права",
      "Stems включены",
      "Ревизии бесплатно"
    ],
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Headphones,
    title: "Сведение и мастеринг",
    description: "Профессиональная обработка вашего трека для идеального звучания",
    features: [
      "Чистый микс",
      "Громкий мастер",
      "Все платформы",
      "Быстро и качественно"
    ],
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Wand2,
    title: "AI-консультации",
    description: "Научу использовать нейросети для создания музыки и расскажу о своём workflow",
    features: [
      "Обзор инструментов",
      "Практические советы",
      "Персональный подход",
      "Онлайн формат"
    ],
    gradient: "from-emerald-500 to-teal-500",
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <BlurIn>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Услуги и сотрудничество</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Мои услуги
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Создам для вас уникальную музыку с использованием передовых AI-технологий
            </p>
          </div>
        </BlurIn>

        {/* Services Grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-6 mb-16">
          {services.map((service, index) => (
            <StaggerItem key={service.title}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl p-6 sm:p-8 shadow-lg h-full group"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <service.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Title & Description */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/contacts">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-primary font-medium group-hover:underline"
                  >
                    Заказать
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA Section */}
        <ScaleIn delay={0.5}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="backdrop-blur-xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-glass-border rounded-3xl p-8 sm:p-12 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center"
            >
              <Zap className="w-10 h-10 text-primary" />
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Готовы начать?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Расскажите о вашем проекте, и мы вместе создадим что-то уникальное. 
              Первая консультация — бесплатно!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacts">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(176, 212, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg"
                >
                  Связаться со мной
                </motion.button>
              </Link>
              <Link href="/tracks">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-glass border border-glass-border text-foreground font-semibold"
                >
                  Послушать треки
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </ScaleIn>
      </div>
    </div>
  )
}
