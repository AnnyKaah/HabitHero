/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#0D0C1D", // Fundo principal (quase preto)
        "brand-slate": "#161A30", // Cor de card/container
        "brand-light-slate": "#31304D", // Bordas e elementos secundários
        "brand-purple": "#B689C0", // Roxo neon principal
        "brand-cyan": "#78D6C6", // Ciano neon para acentos
        "brand-pink": "#F05999", // Rosa vibrante para acentos
      },
      fontFamily: {
        // Fonte futurista para títulos
        display: ["Orbitron", "sans-serif"],
        // Fonte medieval para a Hero Section
        serif: ['"Cinzel Decorative"', "serif"],
        // Fonte limpa e moderna para corpo de texto
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 15px 0 rgba(182, 137, 192, 0.6)",
        "glow-cyan": "0 0 15px 0 rgba(120, 214, 198, 0.6)",
        "glow-gold": "0 0 20px 5px rgba(252, 211, 77, 0.5)",
      },
      keyframes: {
        "bg-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        // Animações para react-hot-toast
        enter: {
          "0%": { opacity: "0", transform: "translateY(-20px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        leave: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(20px) scale(0.95)" },
        },
      },
      animation: {
        "bg-pan": "bg-pan 15s ease-in-out infinite",
        // Animações para react-hot-toast
        enter: "enter 0.2s ease-out",
        leave: "leave 0.2s ease-in forwards",
      },
    },
  },
  plugins: [],
};
