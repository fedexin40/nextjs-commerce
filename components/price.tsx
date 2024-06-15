import clsx from 'clsx';

export default function Price({
  amountMax,
  amountMin,
  className,
  currencyCode = 'USD',
  currencyCodeClassName,
}: {
  amountMax: string;
  amountMin?: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
}) {
  const difference = Number(amountMax) - Number(amountMin);
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
