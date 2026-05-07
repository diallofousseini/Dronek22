'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type AnimatedSectionProps = React.ComponentPropsWithoutRef<'section'>;

export default function AnimatedSection({ className, children, ...props }: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.4 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}
