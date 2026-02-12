"use client";

import { useEffect, useState } from "react";

type CounterProps = {
  value: number;
  duration?: number;
};

export default function Counter({ value, duration = 800 }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(value / (duration / 16)));

    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count}</>;
}
