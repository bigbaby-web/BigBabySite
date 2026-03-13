"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, MessageSquare, Instagram, MapPin, Clock } from "lucide-react"
import { BlurIn, StaggerContainer, StaggerItem, SlideIn } from "@/components/page-transition"
import Link from "next/link"

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", message: "" })
    
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "bigbaby.xyz@gmail.com",
      href: "mailto:bigbaby.xyz@gmail.com",
    },
    {
      icon: MessageSquare,
      label: "Telegram",
      value: "@CreatorMusical",
      href: "https://t.me/CreatorMusical",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@bigbaby.one",
      href: "https://www.instagram.com/bigbaby.one?igsh=ejl1c3drbXU3dmRt",
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <BlurIn>
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Связь со мной</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Контакты
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Хотите сотрудничать или просто пообщаться? Напишите мне!
            </p>
          </div>
        </BlurIn>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <StaggerContainer className="space-y-6">
            {contactInfo.map((item, index) => (
              <StaggerItem key={item.label}>
                <Link href={item.href} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl p-5 sm:p-6 shadow-lg cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{item.label}</h3>
                        <p className="text-muted-foreground group-hover:text-primary transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}

            <StaggerItem>
              <div className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-glass-border rounded-2xl p-5 sm:p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Время ответа</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Обычно отвечаю в течение 24 часов. Для срочных вопросов лучше написать в Telegram.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl p-5 sm:p-6 shadow-lg">
                <h3 className="font-semibold text-foreground mb-3">Открыт к предложениям</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Коллаборации и совместные проекты
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Заказные треки и биты
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Mixing и mastering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Консультации по AI-музыке
                  </li>
                </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Contact Form */}
          <SlideIn direction="right" delay={0.3}>
            <form
              onSubmit={handleSubmit}
              className="backdrop-blur-xl bg-glass border border-glass-border rounded-3xl p-6 sm:p-8 shadow-lg space-y-5"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">Напишите мне</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Имя
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Сообщение
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-transparent focus:border-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder="Расскажите о вашей идее..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    <span>Отправка...</span>
                  </>
                ) : isSubmitted ? (
                  <span>Отправлено!</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Отправить</span>
                  </>
                )}
              </motion.button>
            </form>
          </SlideIn>
        </div>
      </div>
    </div>
  )
}
