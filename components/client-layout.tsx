"use client"

import { useState, ReactNode } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { GlassNavigation } from "@/components/glass-navigation"
import { Footer } from "@/components/footer"
import { AuthModal } from "@/components/auth-modal"
import { PageTransition } from "@/components/page-transition"

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean
    type: "login" | "register"
  }>({
    isOpen: false,
    type: "login",
  })

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navigation */}
      <GlassNavigation
        onOpenAuth={(type) => setAuthModal({ isOpen: true, type })}
      />

      {/* Main Content with Page Transitions */}
      <div className="relative z-10">
        <PageTransition>
          {children}
        </PageTransition>
        <Footer />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        type={authModal.type}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onSwitchType={() =>
          setAuthModal({
            ...authModal,
            type: authModal.type === "login" ? "register" : "login",
          })
        }
      />
    </main>
  )
}
