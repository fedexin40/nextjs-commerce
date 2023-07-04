import clsx from 'clsx';
import Image from 'next/image';
import Price from 'components/price';

export function GridTileImage({
  isInteractive = true,
  labels,
  zoom,
  ...props
}: {
  isInteractive?: boolean;
  labels?: {
    title: string;
    amount: string;
    currencyCode: string;
    isSmall?: boolean;
  };
  zoom?: boolean;
} & React.ComponentProps<typeof Image>) {
  let image_container;
  if (zoom && props.src) {
    image_container =
      /*  <div className="relative h-full w-full object-contain">
        <ImageZoom src={props.src} zoom="300"/>
      </div>
    */
      image_container = (
        <Image
          className={clsx('relative h-full w-full object-contain', {
            'transition duration-300 ease-in-out hover:scale-105': isInteractive
          })}
          {...props}
          alt={props.title || ''}
        />
      );
  } else if (!zoom && props.src) {
    image_container = (
      <Image
        className={clsx('relative h-full w-full object-contain', {
          'transition duration-300 ease-in-out hover:scale-105': isInteractive
        })}
        {...props}
        alt={props.title || ''}
      />
    );
  } else {
    image_container = null;
  }

  return (
    <div className="flex items-center justify-center">
      {image_container}
      {labels ? (
        <div className="absolute left-0 top-0 w-3/4 text-black dark:text-white">
          <div className="inline bg-white box-decoration-clone py-3 pl-5 text-[20px] font-semibold leading-loose shadow-[1.25rem_0_0] shadow-white dark:bg-black dark:shadow-black sm:text-[1px] md:text-[20px]">
            {labels.title}
          </div>
          <Price
            className="w-fit truncate bg-white px-5 py-3 text-[12px] font-semibold dark:bg-black dark:text-white md:text-clip md:text-[15px]"
            amount={labels.amount}
            currencyCode={labels.currencyCode}
          />
        </div>
      ) : null}
    </div>
  );
}
