import { motion } from "framer-motion";
import { AnimatedBackground } from "./AnimatedBackground";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-[#1e0a3c] ${className}`}
    >
      <AnimatedBackground />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
};
