import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return <>{children}</>;
};

export default ScrollToTop; 