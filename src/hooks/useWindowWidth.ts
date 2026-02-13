import { useState, useEffect } from "react";

const useWindowWidth = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const getWindowWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", getWindowWidth);
    getWindowWidth();
    return () => window.removeEventListener("resize", getWindowWidth);
  }, []);

  return screenWidth;
};

export default useWindowWidth;
