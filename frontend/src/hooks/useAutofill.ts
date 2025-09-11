import { useEffect, useRef, useState } from "react";

export function useAutofill<T extends HTMLInputElement>() {
  const ref = useRef<T>(null);
  const [isAutofilled, setIsAutofilled] = useState(false);

  useEffect(() => {
    const inputElement = ref.current;
    if (!inputElement) return;

    const checkAutofill = () => {
      // O pseudo-seletor :autofill é a forma mais confiável de verificar
      const autofilled = inputElement.matches(":-webkit-autofill");
      setIsAutofilled(autofilled);
    };

    // Verifica o estado inicial e depois a cada segundo
    const intervalId = setInterval(checkAutofill, 1000);
    checkAutofill();

    return () => clearInterval(intervalId);
  }, []);

  return { ref, isAutofilled };
}
