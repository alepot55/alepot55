"use client"

import { useState, useEffect } from "react"
import { Mail, Github, Linkedin } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

const NAV_ITEMS = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
]

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState("")

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

  return (
    <header className="fixed top-0 right-0 left-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-900">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-tight hover:opacity-80 transition-opacity"
          >
            AP
          </a>
          <div className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                  activeSection === item.href
                    ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          <a
            href="https://github.com/alepot55"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="GitHub profile"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/alepot55"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:ap.alessandro.potenza@gmail.com"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Send email"
          >
            <Mail size={18} />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
