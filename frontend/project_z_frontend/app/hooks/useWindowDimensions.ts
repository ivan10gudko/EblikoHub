import { useState, useEffect } from "react";

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'larger';

function useWindowDimensions(): Breakpoint | null {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width === null) {
    return null;
  }

  if (width < 640) {
    return 'xs';
  } else if (width < 728) {
    return 'sm';
  } else if (width < 1024) {
    return 'md';
  } else if (width < 1280) {
    return 'lg';
  } else if (width < 1536) {
    return 'xl';
  } else {
    return 'larger';
  }
}

export default useWindowDimensions;