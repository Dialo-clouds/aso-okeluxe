'use client';

import { useEffect, useRef } from 'react';

const HOVER_SELECTOR = 'a, button, input, .strip, .product-card, .occasion-btn';
const DARK_SELECTOR = '.hero-banner, .advisor, footer, .dash';

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer:fine)').matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0, raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) {
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e) => {
      if (!ring) return;
      if (e.target.closest(HOVER_SELECTOR)) ring.classList.add('hover');
      if (e.target.closest(DARK_SELECTOR)) ring.classList.add('on-dark');
    };
    const onOut = (e) => {
      if (!ring) return;
      if (e.target.closest(HOVER_SELECTOR)) ring.classList.remove('hover');
      if (e.target.closest(DARK_SELECTOR)) ring.classList.remove('on-dark');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cRing" ref={ringRef}></div>
      <div id="cDot" ref={dotRef}></div>
    </>
  );
}
