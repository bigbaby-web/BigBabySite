"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
}

const pageTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Staggered container for page content
export function StaggerContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger item for children
export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide in animation
export function SlideIn({ 
  children, 
  direction = "left",
  delay = 0,
  className = "" 
}: { 
  children: ReactNode
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  className?: string 
}) {
  const directionVariants = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: -100, opacity: 0 },
    down: { y: 100, opacity: 0 },
  }

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale in animation
export function ScaleIn({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: ReactNode
  delay?: number
  className?: string 
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Rotate in animation
export function RotateIn({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: ReactNode
  delay?: number
  className?: string 
}) {
  return (
    <motion.div
      initial={{ rotate: -180, scale: 0, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Blur in animation
export function BlurIn({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: ReactNode
  delay?: number
  className?: string 
}) {
  return (
    <motion.div
      initial={{ filter: "blur(20px)", opacity: 0, scale: 1.1 }}
      animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Floating animation
export function Float({ 
  children, 
  duration = 3,
  className = "" 
}: { 
  children: ReactNode
  duration?: number
  className?: string 
}) {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation
export function Pulse({ 
  children, 
  duration = 2,
  className = "" 
}: { 
  children: ReactNode
  duration?: number
  className?: string 
}) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
