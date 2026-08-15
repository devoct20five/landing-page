/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],

  content: [
    "./index.html",
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
      },
      screens: {
        "2xl": "1440px",
      },
    },

    extend: {
      /* ========================================
         COLORS
      ======================================== */

      colors: {
        brand: {
          black: "#0A0A0A",
          blackSoft: "#151515",
          blackElevated: "#1E1E1E",

          white: "#FFFFFF",

          cream: "#F6F4EF",
          creamSoft: "#EFE9DF",

          text: "#111111",
          textSoft: "#585858",

          border: "#E8E2D9",
          borderDark: "rgba(255,255,255,.08)",

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
        display: [
          "var(--font-display)",
          "General Sans",
          "Satoshi",
          "Inter",
          "sans-serif",
        ],

        body: ["Satoshi", "Inter", "ui-sans-serif", "system-ui"],

        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },

      fontSize: {
        hero: [
          "clamp(4rem,10vw,9rem)",
          {
            lineHeight: ".88",
            letterSpacing: "-.045em",
            fontWeight: "700",
          },
        ],

        "display-xl": [
          "clamp(3rem,7vw,6.5rem)",
          {
            lineHeight: ".92",
            letterSpacing: "-.04em",
            fontWeight: "700",
          },
        ],

        "display-lg": [
          "clamp(2.5rem,5vw,4.75rem)",
          {
            lineHeight: ".95",
            letterSpacing: "-.03em",
            fontWeight: "700",
          },
        ],

        "display-md": [
          "clamp(2rem,4vw,3.25rem)",
          {
            lineHeight: "1",
            letterSpacing: "-.025em",
            fontWeight: "700",
          },
        ],

        "display-sm": [
          "clamp(1.5rem,2vw,2.25rem)",
          {
            lineHeight: "1.1",
            fontWeight: "600",
          },
        ],

        lead: [
          "clamp(1.125rem,1.5vw,1.5rem)",
          {
            lineHeight: "1.7",
          },
        ],

        eyebrow: [
          ".72rem",
          {
            letterSpacing: ".22em",
            lineHeight: "1",
            fontWeight: "600",
          },
        ],
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

        DEFAULT: "var(--radius)",
      },

      /* ========================================
         SHADOWS
      ======================================== */

      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,.08)",

        medium: "0 30px 90px rgba(0,0,0,.12)",

        floating: "0 50px 120px rgba(0,0,0,.18)",

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
