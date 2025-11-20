import { useEffect, useState } from "react";

export function useDebounce(value, delay = 300) {
  const [DebounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return DebounceValue;
}
