"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "./theme-toggle"

const NAV_ITEMS = [
  { label: "projects", href: "#projects" },
  { label: "skills", href: "#skills" },
  { label: "experience", href: "#experience" },
  { label: "education", href: "#education" },
  { label: "awards", href: "#achievements" },
]

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState("")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.slice(1))
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-header bg-surface/[0.88] backdrop-blur-md transition-colors ${
        scrolled ? "border-b border-rail" : "border-b border-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-full max-w-content items-center justify-between px-5 sm:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-8">
          <a
            href="#"
            className="font-mono text-nav font-semibold tracking-normal text-ink transition-opacity hover:opacity-70"
          >
            A. Potenza
          </a>
          <div className="hidden items-center gap-5 sm:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative py-4 font-mono text-nav transition-colors ${
                  activeSection === item.href
                    ? "text-ink"
                    : "text-ref hover:text-ink"
                }`}
              >
                {item.label}
                {activeSection === item.href && (
                  <span className="absolute inset-x-0 bottom-3 h-px bg-limit" aria-hidden="true" />
                )}
              </a>
            ))}
          </div>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  )
}
