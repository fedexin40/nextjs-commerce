import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    category?: string;
    amount: string;
    currencyCode: string;
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx('flex h-full w-full items-center justify-center rounded-lg bg-white', {
        relative: label,
      })}
    >
      {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
        <Image
          className={clsx('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out hover:scale-105': isInteractive,
          })}
          {...props}
        />
      ) : null}
      {label ? <Label amount={label.amount} currencyCode={label.currencyCode} /> : null}
      <div className="absolute bottom-0 left-4 -mb-16 flex flex-col p-2 text-xs font-semibold md:-mb-20">
        <div className="uppercase">{label?.title}</div>
        <div className="pt-2 md:pt-4">{label?.category}</div>
      </div>
    </div>
  );
}
