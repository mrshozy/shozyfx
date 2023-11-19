import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function useScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function useScrollDetection(div: HTMLDivElement | null) {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    if (div) {
      const handleScroll = () => {
        const divScrolled = div.scrollTop > 0;
        setIsScrolled(divScrolled);
      };
      div.addEventListener('scroll', handleScroll);
      return () => {
        div.removeEventListener('scroll', handleScroll);
      };
    } else {
      const handleScroll = () => {
        const scrolled = window.scrollY > 0;
        setIsScrolled(scrolled);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  return isScrolled;
}