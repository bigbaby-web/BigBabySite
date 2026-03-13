"use client"

import { HeroSection } from "@/components/hero-section"
import { TracksPreview } from "@/components/tracks-preview"
import { ServicesPreview } from "@/components/services-preview"
import { AboutPreview } from "@/components/about-preview"
import { ContactPreview } from "@/components/contact-preview"

export default function Home() {
  return (
    <>
      <HeroSection />
      <TracksPreview />
      <ServicesPreview />
      <AboutPreview />
      <ContactPreview />
    </>
  )
}
