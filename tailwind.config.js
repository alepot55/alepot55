/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        // six canonical tokens
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        ink: "hsl(var(--ink))",
        ref: "hsl(var(--ref))",
        rail: "hsl(var(--rail))",
        limit: "hsl(var(--limit))",

        // aliases
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        none: "0",
        DEFAULT: "var(--radius)",
        sm: "2px",
        md: "var(--radius)",
        lg: "var(--radius)",
        xl: "var(--radius)",
        "2xl": "var(--radius)",
        "3xl": "var(--radius)",
        full: "var(--radius)",
      },
      spacing: {
        section: "5rem",
        "section-md": "4rem",
        "section-sm": "3rem",
        header: "3.25rem",
        value: "9rem",
      },
      fontSize: {
        micro: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.12em" }],
        meta: ["0.6875rem", { lineHeight: "1.45", letterSpacing: "0.01em" }],
        unit: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.01em" }],
        nav: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0" }],
        body: ["0.9375rem", { lineHeight: "1.6", letterSpacing: "0" }],
        lead: ["1.0625rem", { lineHeight: "1.6", letterSpacing: "0" }],
        index: ["0.9375rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "row-title": ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "value-s": ["1.125rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "value-m": ["1.75rem", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "value-xl": ["2.75rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
      },
      letterSpacing: {
        micro: "0.12em",
        snug: "-0.02em",
        crush: "-0.03em",
      },
      maxWidth: {
        content: "60rem",
        lead: "60ch",
        measure: "62ch",
        prose: "68ch",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "inherit",
            strong: { fontWeight: "600" },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
}
