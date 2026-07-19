/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        // ==== OCT20FIVE Brand Tokens ====
        brand: {
          orange: '#FF5A1F',
          orangeHover: '#E64E1A',
          orangeSoft: '#FFB08A',
          orangeTint: '#FFF3EC',
          dark: '#1A0907',
          dark2: '#2A140F',
          dark3: '#3A241F',
          cream: '#F6F0E8',
          cream2: '#EDE4D6',
          peach: '#F4E4D5',
        },
        surface: {
          bg: 'var(--surface-bg)',
          fg: 'var(--surface-fg)',
          muted: 'var(--surface-muted)',
          card: 'var(--surface-card)',
          border: 'var(--surface-border)',
        },
        // shadcn passthrough
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Eurostile', 'Oswald', 'Bebas Neue', 'sans-serif'],
        body: ['Satoshi', 'Satoshi Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(3.5rem, 10vw, 11rem)', { lineHeight: '0.9', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-xl':  ['clamp(3rem, 8vw, 8.5rem)',  { lineHeight: '0.92', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg':  ['clamp(2.5rem, 6vw, 6rem)',  { lineHeight: '0.96', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-md':  ['clamp(2rem, 4vw, 3.75rem)', { lineHeight: '1.02', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm':  ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.15', fontWeight: '600' }],
        'body-xl':     ['clamp(1.125rem, 1.4vw, 1.5rem)', { lineHeight: '1.5' }],
        'body-lg':     ['1.125rem', { lineHeight: '1.55' }],
        eyebrow:       ['0.7rem', { lineHeight: '1', letterSpacing: '0.18em', fontWeight: '600' }],
      },
      borderRadius: {
        pill: '999px',
        card: '1.75rem',
        icon: '0.875rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'brand-glow': '0 20px 60px -20px rgba(255,90,31,0.55), 0 8px 30px -10px rgba(255,90,31,0.35)',
        'brand-soft': '0 30px 80px -30px rgba(26,9,7,0.35)',
        'card-lift': '0 30px 80px -30px rgba(0,0,0,0.35), 0 10px 30px -12px rgba(0,0,0,0.2)',
      },
      backgroundImage: {
        'radial-orange': 'radial-gradient(circle at 50% 50%, rgba(255,90,31,0.35) 0%, rgba(255,90,31,0) 60%)',
        'noise': "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/><feColorMatrix values='0 0 0 0 0.98  0 0 0 0 0.95  0 0 0 0 0.92  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'marquee':        { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'ping-slow':      { '0%,100%': { opacity: '0.4', transform: 'scale(1)' }, '50%': { opacity: '0', transform: 'scale(2.2)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.25s ease-out',
        'accordion-up':   'accordion-up 0.25s ease-out',
        'marquee':        'marquee 40s linear infinite',
        'ping-slow':      'ping-slow 2.6s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'apple-in': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
