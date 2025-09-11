import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react"; // No changes needed here
import { Loader2 } from "lucide-react";

export default function HeroSection() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartJourney = () => {
    setIsLoading(true);
    setTimeout(() => navigate("/login"), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center justify-center min-h-screen text-center p-4 overflow-hidden bg-[#1e0a3c]"
    >
      {/* Fundo gradiente animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#2c024c] via-[#5b21b6]/50 to-[#1e0a3c] z-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Nuvens flutuantes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-48 h-24 bg-white/10 rounded-full blur-3xl"
          style={{
            top: `${10 + i * 10}%`,
            left: `${Math.random() * 90}%`,
          }}
          animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i,
          }}
        />
      ))}

      {/* Estrelas flutuantes */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, 5, 0], x: [0, 5, 0], opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Castelo SVG flutuante com janelas piscando */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          duration: 3,
          delay: 0.2,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        className="relative z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="260"
          height="260"
          viewBox="0 0 512 512"
        >
          {/* Torres e corpo */}
          <rect x="120" y="400" width="272" height="80" fill="#a78bfa" />
          <rect x="160" y="240" width="48" height="160" fill="#c084fc" />
          <rect x="304" y="240" width="48" height="160" fill="#c084fc" />
          <rect x="232" y="160" width="48" height="240" fill="#a78bfa" />
          <rect x="96" y="320" width="48" height="80" fill="#a78bfa" />
          <rect x="368" y="320" width="48" height="80" fill="#a78bfa" />
          {/* Telhados */}
          <path d="M200 120l56-56 56 56v40h-112z" fill="#f472b6" />
          {/* Janelas com animação */}
          <motion.circle
            cx="256"
            cy="440"
            r="10"
            fill="#fcd34d"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="180"
            cy="280"
            r="8"
            fill="#fcd34d"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.circle
            cx="332"
            cy="280"
            r="8"
            fill="#fcd34d"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </svg>
      </motion.div>

      {/* Mascote pulando */}
      <motion.div
        className="absolute bottom-10 left-10 w-28 h-28 flex items-center justify-center z-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          width="100"
          height="100"
        >
          {/* Corpo */}
          <ellipse cx="60" cy="80" rx="35" ry="28" fill="#a78bfa" />

          {/* Barriga */}
          <ellipse cx="60" cy="85" rx="20" ry="15" fill="#c4b5fd" />

          {/* Cabeça */}
          <circle cx="60" cy="40" r="22" fill="#a78bfa" />

          {/* Olhos */}
          <circle cx="52" cy="38" r="4" fill="white" />
          <circle cx="68" cy="38" r="4" fill="white" />
          <circle cx="52" cy="38" r="2" fill="black" />
          <circle cx="68" cy="38" r="2" fill="black" />

          {/* Asinhas */}
          <path
            d="M30 60 Q20 40 40 50 Q35 65 30 60"
            fill="#c084fc"
            stroke="#7c3aed"
            strokeWidth="2"
          />
          <path
            d="M90 60 Q100 40 80 50 Q85 65 90 60"
            fill="#c084fc"
            stroke="#7c3aed"
            strokeWidth="2"
          />

          {/* Sorriso */}
          <path
            d="M52 48 Q60 55 68 48"
            stroke="black"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Chifrinhos */}
          <path
            d="M50 20 L46 10"
            stroke="#7c3aed"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M70 20 L74 10"
            stroke="#7c3aed"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Título com gradiente e glow */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 mt-8 font-serif text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-400 to-yellow-300 animate-textGlow"
      >
        Bem-vindo ao Reino dos Hábitos
      </motion.h1>

      {/* Subtítulo */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 mt-4 max-w-xl text-lg text-purple-200"
      >
        A jornada começa agora. Forje seu destino, um hábito de cada vez.
      </motion.p>

      {/* Botão CTA com partículas mágicas */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 1.1,
          type: "spring",
          stiffness: 200,
        }}
        disabled={isLoading}
        onClick={handleStartJourney}
        className="relative z-10 mt-12 flex items-center justify-center w-64 h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-xl rounded-xl shadow-[0_0_20px_rgba(192,132,252,0.6)] hover:shadow-[0_0_40px_rgba(192,132,252,1)] transition-all duration-300 disabled:opacity-70 disabled:cursor-wait"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={28} />
        ) : (
          <>
            <span className="mr-2">⚔️</span>
            Iniciar Jornada
          </>
        )}
        {/* Partículas mágicas em volta do botão */}
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -8, 0], opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1 + Math.random(),
              delay: Math.random(),
            }}
          />
        ))}
      </motion.button>

      {/* Partículas mágicas subindo no fundo */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-70"
          style={{ left: `${Math.random() * 100}%`, bottom: "0%" }}
          animate={{ y: [-50 - Math.random() * 50] }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Glow do texto */}
      <style>
        {`
          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 10px #c084fc; }
            50% { text-shadow: 0 0 20px #f472b6; }
          }
          .animate-textGlow {
            animation: textGlow 2.5s ease-in-out infinite;
          }
        `}
      </style>
    </motion.div>
  );
}
