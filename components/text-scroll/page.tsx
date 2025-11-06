import React from 'react';
import Marquee from 'react-fast-marquee';
import { ReactNode } from 'react';
import { ReactElement } from 'react';

export default function MarqueeText({
  direction = 'left',
  speed = 50,
  children,
}: {
  children: ReactElement<any, any>;
  direction?: 'left' | 'right' | 'up' | 'down';
  speed?: number;
}) {
  return (
    <div className="relative flex h-[50px] items-center bg-white bg-opacity-90">
      <Marquee direction={direction} speed={speed}>
        {children}
      </Marquee>
    </div>
  );
}
