import Price from './price';

const Label = ({
  amountMax,
  amountMin,
  currencyCode,
}: {
  amountMax: string;
  amountMin: string;
  currencyCode: string;
}) => {
  return (
    <div className={'absolute bottom-0 left-4 z-30 flex w-full'}>
      <div className="flex items-center rounded-tl rounded-tr bg-white text-xs font-semibold text-black">
        <Price
          className="p-2"
          amountMax={amountMax}
          amountMin={amountMin}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
