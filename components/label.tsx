import Price from './price';

const Label = ({ amount, currencyCode }: { amount: string; currencyCode: string }) => {
  return (
    <div className={'absolute bottom-0 left-4 flex w-full'}>
      <div className="flex items-center rounded-tl rounded-tr bg-white text-xs font-semibold text-black">
        <Price
          className="p-2"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
