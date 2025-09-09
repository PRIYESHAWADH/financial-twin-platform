/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced FinTwin Colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        profit: "hsl(var(--profit))",
        loss: "hsl(var(--loss))",
        neutral: "hsl(var(--neutral-change))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'glow': '0 0 20px hsl(var(--primary) / 0.3)',
        'glow-lg': '0 0 40px hsl(var(--primary) / 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: 0, transform: "translateX(-20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: 0, transform: "translateX(20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "count-up": {
          from: { transform: "translateY(20px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "chart-grow": {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
        "shimmer": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "count-up": "count-up 0.6s ease-out",
        "chart-grow": "chart-grow 0.8s ease-out",
        "shimmer": "shimmer 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
