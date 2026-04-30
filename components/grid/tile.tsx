import MyImage from 'components/image';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  active,
  label,
  ...props
}: {
  active?: boolean;
  label?: {
    title: string;
    category?: string;
    amountMax: string;
    amountMin: string;
    discount?: string;
    currencyCode: string;
  };
} & React.ComponentProps<typeof Image>) {
  const discount = label?.discount ?? '0';
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-white">
      {label?.discount != '0' && (
        <span className="absolute right-2 top-2 z-50 text-nowrap rounded-sm bg-red-700 px-3 py-1 text-white">
          On sale
        </span>
      )}
      {props.src ? (
        <div className="relative h-full w-full">
          <MyImage src={props.src} />
        </div>
      ) : null}
      {label ? (
        <Label
          amountMax={label.amountMax}
          amountMin={label.amountMin}
          discount={discount}
          currencyCode={label.currencyCode}
        />
      ) : null}
      <div className="absolute bottom-0 left-4 -mb-16 flex flex-col p-2 text-xs font-semibold md:-mb-20">
        <div className="line-clamp-1 text-ellipsis uppercase">{label?.title}</div>
        <div className="pt-2 md:pt-4">{label?.category}</div>
      </div>
    </div>
  );
}
