import { ReactElement } from 'react';
import Marquee from 'react-fast-marquee';

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
    <div className="relative flex h-[50px] items-center">
      <Marquee direction={direction} speed={speed}>
        {children}
      </Marquee>
    </div>
  );
}
