"use client"

import { motion } from "framer-motion"
import { 
  Brain, 
  Sparkles, 
  Music, 
  Mic2, 
  Headphones, 
  Award,
  Target,
  Zap,
  Instagram
} from "lucide-react"
import { StaggerContainer, StaggerItem, BlurIn, Float } from "@/components/page-transition"
import Link from "next/link"

const skills = [
  { icon: Brain, label: "AI Music Production", description: "Создание музыки с использованием нейросетей" },
  { icon: Mic2, label: "Вокал и Lyrics", description: "Написание текстов и вокальные партии" },
  { icon: Music, label: "Beatmaking", description: "Создание уникальных битов и аранжировок" },
  { icon: Headphones, label: "Mixing & Mastering", description: "Профессиональная обработка звука" },
]

const achievements = [
  { number: "1M+", label: "Стилей ИИ" },
  { number: "24/7", label: "Творческий процесс" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <BlurIn>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Продюсер из будущего</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Обо мне
              </span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Привет! Я <span className="text-foreground font-semibold">BIG BABY</span> — музыкант и продюсер, 
              который создаёт уникальную музыку на стыке человеческого творчества и искусственного интеллекта.
            </p>
          </div>
        </BlurIn>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left Column - Story */}
          <StaggerContainer className="space-y-6">
            <StaggerItem>
              <div className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Моя миссия</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Исследовать границы возможного в музыке, объединяя человеческую креативность 
                  с мощью нейросетей. Каждый трек — это эксперимент, каждый звук — открытие нового.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Подход</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  ИИ — это мой инструмент, а не замена творчества. Я использую нейросети для генерации 
                  идей, экспериментов со звуком и создания уникальных текстур, но финальное решение 
                  всегда за мной.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-glass-border rounded-3xl p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Связаться со мной</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://www.instagram.com/bigbaby.one?igsh=ejl1c3drbXU3dmRt"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-foreground font-medium shadow-lg hover:bg-white/15 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      Instagram
                    </motion.button>
                  </Link>
                  <Link href="/contacts">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-foreground font-medium"
                    >
                      Написать
                    </motion.button>
                  </Link>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Right Column - Stats & Skills */}
          <StaggerContainer className="space-y-6">
            {/* Achievement Stats */}
            <StaggerItem>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl p-5 text-center"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                      {item.number}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </StaggerItem>

            {/* Skills */}
            <StaggerItem>
              <div className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Навыки</h2>
                </div>

                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <skill.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{skill.label}</h3>
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Float duration={5}>
            <blockquote className="backdrop-blur-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-glass-border rounded-3xl p-8 sm:p-12">
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground mb-4 leading-relaxed">
                "Музыка — это язык, на котором говорит будущее. ИИ помогает мне услышать его раньше других."
              </p>
              <footer className="text-muted-foreground">— BIG BABY</footer>
            </blockquote>
          </Float>
        </motion.div>
      </div>
    </div>
  )
}
