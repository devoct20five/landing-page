/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],

  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        "2xl": "90rem", /* 1440px at 16px root; grows with the root on big screens */
      },
    },

    extend: {
      /* ========================================
         COLORS
      ======================================== */

      colors: {
        /* OCT20FIVE brand book — Color System (slide 11)
           Dark  #1A0907 · Cream #F6F0E8 · Orange #FF5A1F
           Everything else is a tint/shade derived from those three. */
        brand: {
          black: "#1A0907",
          dark: "#1A0907", // alias: components historically used bg-brand-dark (undefined → transparent)
          blackSoft: "#241210",
          blackElevated: "#2E1A16",

          white: "#FFFFFF",

          cream: "#F6F0E8",
          creamSoft: "#EDE4D8",
          card: "#FBF8F3",
          peach: "#F4E4D5",

          text: "#1A0907",
          /* Secondary-typeface brown-gray sampled from brand book slide 14 */
          textSoft: "#6F625A",

          border: "#E3D9CC",
          borderDark: "rgba(246,240,232,.10)",

          orange: "#FF5A1F",
          orangeHover: "#E94D15",
          orangeSoft: "#FFB089",
        },

        surface: {
          bg: "var(--surface-bg)",
          fg: "var(--surface-fg)",
          card: "var(--surface-card)",
          muted: "var(--surface-muted)",
          border: "var(--surface-border)",
        },

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

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

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      /* ========================================
         TYPOGRAPHY
      ======================================== */

      fontFamily: {
        /* Primary typeface — Saira (Regular / Bold / Heavy) */
        display: [
          "var(--font-display)",
          "Saira Variable",
          "Saira",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],

        /* Secondary typeface — Satoshi Variable (Light / Regular / Bold) */
        body: [
          "var(--font-body)",
          "Satoshi",
          "Satoshi Variable",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],

        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },

      /* Fluid type scale — one source of truth.
         Each token = clamp(phone minimum, rem + vw slope, desktop maximum).
         Phone minimums are chosen so the longest uppercase Saira words
         ("COMPLICATED.", "EVERYTHING") still fit a 360px-wide screen.
         Everything is rem-based, so the html font-size steps on large
         displays (see globals.css) scale the whole scale up together. */
      fontSize: {
        hero: [
          "clamp(2.5rem, 1.35rem + 5.8vw, 8rem)",
          { lineHeight: ".9", letterSpacing: "-.025em", fontWeight: "900" },
        ],
        "display-2xl": [
          "clamp(2.5rem, 1.3rem + 5.2vw, 7rem)",
          { lineHeight: ".92", letterSpacing: "-.025em" },
        ],
        "display-xl": [
          "clamp(2.25rem, 1.25rem + 4.4vw, 6rem)",
          { lineHeight: ".94", letterSpacing: "-.022em" },
        ],
        "display-lg": [
          "clamp(2rem, 1.2rem + 3.2vw, 4.5rem)",
          { lineHeight: ".96", letterSpacing: "-.02em" },
        ],
        "display-md": [
          "clamp(1.75rem, 1.15rem + 2.2vw, 3.25rem)",
          { lineHeight: "1", letterSpacing: "-.018em" },
        ],
        "display-sm": [
          "clamp(1.375rem, 1rem + 1.2vw, 2.25rem)",
          { lineHeight: "1.1", letterSpacing: "-.012em" },
        ],
        lead: [
          "clamp(1.0625rem, .95rem + .5vw, 1.375rem)",
          { lineHeight: "1.65" },
        ],
        "body-lg": [
          "clamp(1rem, .94rem + .3vw, 1.1875rem)",
          { lineHeight: "1.7" },
        ],
        body: ["1rem", { lineHeight: "1.7" }],
        /* smallest allowed text anywhere: 12px at the default root size */
        label: [".75rem", { lineHeight: "1.2", letterSpacing: ".18em" }],
      },

      /* ========================================
         RADIUS
      ======================================== */

      borderRadius: {
        xs: ".5rem",
        sm: ".75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        card: "2rem",
        section: "2.5rem",
        pill: "999px",
        tile: "1.25rem",

        DEFAULT: "var(--radius)",
      },

      /* ========================================
         SHADOWS
      ======================================== */

      boxShadow: {
        soft: "0 20px 60px rgba(26,9,7,.08)",

        medium: "0 30px 90px rgba(26,9,7,.12)",

        floating: "0 50px 120px rgba(26,9,7,.18)",

        glow: "0 20px 50px rgba(255,90,31,.18)",
      },

      /* ========================================
         BACKGROUNDS
      ======================================== */

      backgroundImage: {
        noise:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E\")",

        glow: "radial-gradient(circle at center, rgba(255,90,31,.18), transparent 70%)",
      },

      /* ========================================
         ANIMATION
      ======================================== */

      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(32px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        fade: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },

        marquee: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },

        accordionDown: {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },

        accordionUp: {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },

      animation: {
        fade: "fade .8s cubic-bezier(.22,1,.36,1)",

        "fade-up": "fadeUp .8s cubic-bezier(.22,1,.36,1)",

        marquee: "marquee 35s linear infinite",

        "accordion-down": "accordionDown .3s ease",

        "accordion-up": "accordionUp .3s ease",
      },

      /* ========================================
         TRANSITIONS
      ======================================== */

      transitionTimingFunction: {
        smooth: "cubic-bezier(.22,1,.36,1)",
        standard: "cubic-bezier(.4,0,.2,1)",
      },

      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1200: "1200ms",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
