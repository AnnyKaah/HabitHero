import { motion } from "framer-motion";

export const AnimatedBackground = () => (
  <>
    {/* Fundo gradiente animado */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-b from-[#2c024c] via-[#5b21b6]/50 to-[#1e0a3c] z-0"
      style={{ backgroundSize: "200% 200%" }}
      animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    />

    {/* Nuvens flutuantes */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={`cloud-${i}`}
        className="absolute w-48 h-24 bg-white/10 rounded-full blur-3xl"
        style={{
          top: `${10 + i * 15}%`,
          left: `${Math.random() * 90}%`,
        }}
        animate={{ x: [0, 20, -20, 0], y: [0, 10, -10, 0] }}
        transition={{
          duration: 20 + i * 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 2,
        }}
      />
    ))}

    {/* Estrelas flutuantes */}
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={`star-${i}`}
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
  </>
);
