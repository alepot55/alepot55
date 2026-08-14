"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center border border-rail bg-surface text-ref transition-opacity duration-200 hover:text-ink ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={16} />
    </button>
  )
}
