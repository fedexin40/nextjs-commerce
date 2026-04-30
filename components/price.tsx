import clsx from 'clsx';

export default function Price({
  amountMax,
  amountMin,
  className,
  discount = '0',
  currencyCode = 'MXN',
  currencyCodeClassName,
}: {
  amountMax: string;
  amountMin?: string;
  discount?: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
}) {
  const difference = Number(amountMax) - Number(amountMin);
  const amountTotal = Number(amountMax) + Number(discount);
  if (amountMax && amountMin && difference > 0) {
    return (
      <p suppressHydrationWarning={true} className={className}>
        {`${new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol',
        }).format(parseFloat(amountMax))} - `}
        {`${new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol',
        }).format(parseFloat(amountMin))}`}
        <span className={clsx('ml-1 inline', currencyCodeClassName)}>{`${currencyCode}`}</span>
      </p>
    );
  } else {
    if (discount != '0') {
      console.log(amountMax, amountTotal, amountMin, discount);
      return (
        <p suppressHydrationWarning={true} className={className}>
          <div className="flex flex-row space-x-2">
            <span className="text-gray-400 line-through">
              {`${new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: currencyCode,
                currencyDisplay: 'narrowSymbol',
              }).format(parseFloat(amountTotal.toFixed(2)))}`}
            </span>
            <span>
              {`${new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: currencyCode,
                currencyDisplay: 'narrowSymbol',
              }).format(parseFloat(amountMax))}`}
            </span>
            <span className={clsx('ml-1 inline', currencyCodeClassName)}>{`${currencyCode}`}</span>
          </div>
        </p>
      );
    } else {
      return (
        <p suppressHydrationWarning={true} className={className}>
          {`${new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currencyCode,
            currencyDisplay: 'narrowSymbol',
          }).format(parseFloat(amountMax))}`}
          <span className={clsx('ml-1 inline', currencyCodeClassName)}>{`${currencyCode}`}</span>
        </p>
      );
    }
  }
}
