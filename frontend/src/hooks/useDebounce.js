// hooks/useDebounce.js
// Custom Hook — Anti-spam (debounce)
// Attend que l'utilisateur ait fini de taper pendant `delay` ms
// avant de renvoyer la valeur stabilisée.

import { useState, useEffect } from 'react';

/**
 * @param {any} value   — valeur à debouncer (ex: searchTerm)
 * @param {number} delay — délai en ms avant mise à jour (défaut : 500ms)
 * @returns {any} debouncedValue — valeur stabilisée après le délai
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Lance le timer dès que `value` change
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyage : annule le timer si `value` change avant la fin du délai
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
