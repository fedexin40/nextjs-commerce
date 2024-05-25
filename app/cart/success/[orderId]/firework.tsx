'use client';

import type { FireworksHandlers } from '@fireworks-js/react';
import { Fireworks } from '@fireworks-js/react';
import { useRef } from 'react';

export default function Firework() {
  const ref = useRef<FireworksHandlers>(null);
  return (
    <>
      <Fireworks
        ref={ref}
        options={{ opacity: 100, traceSpeed: 50 }}
        style={{
          top: 100,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'fixed',
        }}
      />
    </>
  );
}
