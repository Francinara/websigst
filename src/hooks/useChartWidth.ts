import { useEffect, useState } from "react";

export const useChartWidth = (ref: React.RefObject<HTMLDivElement>) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setWidth(width);
      }
    });

    const chartElement = ref.current;

    if (chartElement) {
      observer.observe(chartElement);
    }

    return () => {
      if (chartElement) {
        observer.unobserve(chartElement);
      }
    };
  }, [ref]);

  return width;
};
