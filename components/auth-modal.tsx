"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User, Eye, EyeOff, Check, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface AuthModalProps {
  isOpen: boolean
  type: "login" | "register"
  onClose: () => void
  onSwitchType: () => void
}

export function AuthModal({ isOpen, type, onClose, onSwitchType }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ 
    email?: string
    password?: string
    username?: string
    confirmPassword?: string
    general?: string 
  }>({})
  const [touched, setTouched] = useState<{ 
    email?: boolean
    password?: boolean
    username?: boolean
    confirmPassword?: boolean 
  }>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const validateEmail = (value: string) => {
    if (!value) return "Email обязателен"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Некорректный email"
    return undefined
  }

  const validatePassword = (value: string) => {
    if (!value) return "Пароль обязателен"
    if (value.length < 6) return "Минимум 6 символов"
    return undefined
  }

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Подтвердите пароль"
    if (value !== password) return "Пароли не совпадают"
    return undefined
  }

  const validateUsername = (value: string) => {
    if (!value) return "Имя пользователя обязательно"
    if (value.length < 2) return "Минимум 2 символа"
    return undefined
  }

  const handleBlur = (field: "email" | "password" | "username" | "confirmPassword") => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    if (field === "email") setErrors((prev) => ({ ...prev, email: validateEmail(email) }))
    if (field === "password") setErrors((prev) => ({ ...prev, password: validatePassword(password) }))
    if (field === "confirmPassword") setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }))
    if (field === "username") setErrors((prev) => ({ ...prev, username: validateUsername(username) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage(null)
    
    const newErrors: typeof errors = {}
    newErrors.email = validateEmail(email)
    newErrors.password = validatePassword(password)
    if (type === "register") {
      newErrors.username = validateUsername(username)
      newErrors.confirmPassword = validateConfirmPassword(confirmPassword)
    }
    
    setErrors(newErrors)
    setTouched({ email: true, password: true, username: true, confirmPassword: true })
    
    if (Object.values(newErrors).filter(Boolean).length > 0) return
    
    setIsLoading(true)
    
    try {
      if (type === "login") {
        const { error } = await signIn(email, password)
        if (error) {
          setErrors({ general: "Неверный email или пароль" })
        } else {
          onClose()
          resetForm()
          router.push("/profile")
        }
      } else {
        const { error } = await signUp(email, password, username)
        if (error) {
          if (error.message.includes("already registered")) {
            setErrors({ general: "Пользователь с таким email уже существует" })
          } else {
            setErrors({ general: error.message })
          }
        } else {
          setSuccessMessage("Регистрация успешна! Проверьте почту для подтверждения.")
          setTimeout(() => {
            onClose()
            resetForm()
          }, 3000)
        }
      }
    } catch {
      setErrors({ general: "Произошла ошибка. Попробуйте позже." })
    }
    
    setIsLoading(false)
  }

  const isValid = (field: "email" | "password" | "username" | "confirmPassword") => {
    if (field === "email") return touched.email && !errors.email && email
    if (field === "password") return touched.password && !errors.password && password
    if (field === "confirmPassword") return touched.confirmPassword && !errors.confirmPassword && confirmPassword
    if (field === "username") return touched.username && !errors.username && username
    return false
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setUsername("")
    setErrors({})
    setTouched({})
    setSuccessMessage(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto"
          >
            <div className="w-full max-w-md pointer-events-auto my-8">
              <div className="backdrop-blur-2xl bg-glass border border-glass-border rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative p-5 sm:p-6 pb-0">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 pr-8">
                      {type === "login" ? "Добро пожаловать" : "Создать аккаунт"}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {type === "login"
                        ? "Войдите, чтобы оставлять комментарии и лайки"
                        : "Присоединяйтесь к сообществу Big Baby"}
                    </p>
                  </motion.div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mx-5 sm:mx-6 mt-5 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>{successMessage}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mx-5 sm:mx-6 mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>{errors.general}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                  <AnimatePresence mode="wait">
                    {type === "register" && (
                      <motion.div
                        key="username"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FloatingInput
                          type="text"
                          label="Имя пользователя"
                          icon={User}
                          value={username}
                          onChange={setUsername}
                          onBlur={() => handleBlur("username")}
                          error={touched.username ? errors.username : undefined}
                          isValid={isValid("username")}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FloatingInput
                    type="email"
                    label="Email"
                    icon={Mail}
                    value={email}
                    onChange={setEmail}
                    onBlur={() => handleBlur("email")}
                    error={touched.email ? errors.email : undefined}
                    isValid={isValid("email")}
                  />

                  <FloatingInput
                    type={showPassword ? "text" : "password"}
                    label="Пароль"
                    icon={Lock}
                    value={password}
                    onChange={setPassword}
                    onBlur={() => handleBlur("password")}
                    error={touched.password ? errors.password : undefined}
                    isValid={isValid("password")}
                    endIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                  />

                  <AnimatePresence mode="wait">
                    {type === "register" && (
                      <motion.div
                        key="confirmPassword"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FloatingInput
                          type={showPassword ? "text" : "password"}
                          label="Подтвердите пароль"
                          icon={Lock}
                          value={confirmPassword}
                          onChange={setConfirmPassword}
                          onBlur={() => handleBlur("confirmPassword")}
                          error={touched.confirmPassword ? errors.confirmPassword : undefined}
                          isValid={isValid("confirmPassword")}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full py-3.5 sm:py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base sm:text-lg shadow-lg disabled:opacity-70 overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          />
                          <span>Загрузка...</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {type === "login" ? "Войти" : "Зарегистрироваться"}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Switch Auth Type */}
                  <div className="text-center pt-2">
                    <span className="text-sm text-muted-foreground">
                      {type === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        resetForm()
                        onSwitchType()
                      }}
                      className="text-sm text-primary font-semibold hover:underline"
                    >
                      {type === "login" ? "Регистрация" : "Войти"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface FloatingInputProps {
  type: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  isValid?: boolean
  endIcon?: React.ReactNode
  placeholder?: string
}

function FloatingInput({
  type,
  label,
  icon: Icon,
  value,
  onChange,
  onBlur,
  error,
  isValid,
  endIcon,
  placeholder,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const isFloating = isFocused || value

  return (
    <div className="space-y-1">
      <div
        className={`relative rounded-xl sm:rounded-2xl bg-secondary/50 border-2 transition-colors ${
          error
            ? "border-red-500"
            : isValid
            ? "border-green-500"
            : isFocused
            ? "border-primary"
            : "border-transparent"
        }`}
      >
        {/* Icon */}
        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        {/* Floating Label */}
        <motion.label
          animate={{
            y: isFloating ? -10 : 0,
            scale: isFloating ? 0.8 : 1,
            color: error ? "rgb(239 68 68)" : isFloating ? "var(--primary)" : "var(--muted-foreground)",
          }}
          className="absolute left-10 sm:left-12 top-1/2 -translate-y-1/2 origin-left pointer-events-none transition-colors text-sm sm:text-base"
        >
          {label}
        </motion.label>

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            onBlur?.()
          }}
          placeholder={isFocused ? placeholder : ""}
          className="w-full py-3 sm:py-4 pt-5 sm:pt-6 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-transparent outline-none text-foreground text-sm sm:text-base"
        />

        {/* End Icon / Validation State */}
        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
          {endIcon || (
            <AnimatePresence>
              {isValid && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-green-500"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-red-500"
                >
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs sm:text-sm text-red-500 pl-3 sm:pl-4"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
