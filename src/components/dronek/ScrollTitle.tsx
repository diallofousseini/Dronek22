'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'div' | 'span';
}

export function ScrollTitle({ children, className = "", as = 'div' }: ScrollTitleProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 5%"]
  });

  // 1. Scroll Fade / Opacity (Perte de lumière)
  const opacityBase = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.05, 1, 1, 0.05]);
  const opacity = useSpring(opacityBase, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // 2. Scroll Weight (Simulated with Scale & Contrast)
  const scaleBase = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.94, 1.06, 1.06, 0.94]);
  const scale = useSpring(scaleBase, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // 3. Parallax Text Effect (Vent / Inertia)
  const xBase = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [-30, 0, 0, 30]);
  const x = useSpring(xBase, { stiffness: 60, damping: 25, restDelta: 0.001 });
  
  const skewXBase = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [8, 0, 0, -8]);
  const skewX = useSpring(skewXBase, { stiffness: 60, damping: 25, restDelta: 0.001 });
  
  // High-end contrast and brightness for the "light" effect
  const filter = useTransform(
    scrollYProgress, 
    [0, 0.4, 0.6, 1], 
    ["contrast(0.7) brightness(0.7)", "contrast(1.1) brightness(1)", "contrast(1.1) brightness(1)", "contrast(0.7) brightness(0.7)"]
  );

  const Component = motion[as] as any;

  return (
    <Component
      ref={ref}
      style={{ 
        opacity, 
        scale, 
        skewX, 
        x, 
        filter,
        transformOrigin: "center center",
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function ScrollBold({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 5%"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.98, 1.03, 1.03, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
