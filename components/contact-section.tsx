"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, MessageSquare } from "lucide-react"

export function ContactSection() {
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

  return (
    <section id="contacts" className="relative py-16 sm:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-foreground">
            Контакты
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-2">
            Хотите сотрудничать? Напишите мне!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 order-2 md:order-1"
          >
            <div className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Email</h3>
                  <p className="text-muted-foreground text-sm truncate">bigbaby.xyz@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Telegram</h3>
                  <p className="text-muted-foreground text-sm truncate">@CreatorMusical</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-glass-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg"
            >
              <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1.5 sm:mb-2">Открыт к предложениям</h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Сотрудничество, коллаборации, заказные треки — обсудим любые идеи!
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <form
              onSubmit={handleSubmit}
              className="backdrop-blur-xl bg-glass border border-glass-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Имя
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-secondary/50 border border-transparent focus:border-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                  placeholder="Ваше имя"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-secondary/50 border border-transparent focus:border-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm sm:text-base"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                  Сообщение
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-secondary/50 border border-transparent focus:border-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm sm:text-base resize-none"
                  placeholder="Расскажите о вашей идее..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-4 rounded-lg sm:rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    <span>Отправка...</span>
                  </>
                ) : isSubmitted ? (
                  <span>Отправлено!</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Отправить</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
