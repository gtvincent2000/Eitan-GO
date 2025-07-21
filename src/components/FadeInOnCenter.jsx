'use client';

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function FadeInOnCenter({ children, className, style }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'], // Trigger at center of screen
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 1, 0.1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  return (
    <motion.section
      ref={ref}
      style={{ ...style, opacity, y }}
      className={className}
    >
      {children}
    </motion.section>
  );
}