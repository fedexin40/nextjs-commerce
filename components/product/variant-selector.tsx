'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ProductOption, ProductVariant } from 'lib/types';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean; // ie. { color: 'Red', size: 'Large', ... }
};

function VariantSelectorDropdown({
  option,
  options,
  combinations,
}: {
  option: ProductOption;
  options: ProductOption[];
  combinations: Combination[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname() || '';
  const [active, setActive] = useState('');
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    option.values.forEach((value: string) => {
      if (searchParams?.get(option.name.toLowerCase()) === value) {
        setActive(value);
      }
    });
  }, [pathname, option, searchParams]);

  return (
    <div className="relative w-fit" ref={ref}>
      <div
        onClick={() => {
          setOpenSelect(!openSelect);
        }}
        className="flex	rounded border border-black/30 px-4  text-sm"
      >
        <div className="min-h-[38px] min-w-[95px] max-w-none p-2">{active}</div>
        <ChevronDownIcon className="h-4 self-center" />
      </div>
      {openSelect && (
        <div
          onClick={() => {
            setOpenSelect(false);
          }}
          className="absolute z-50 rounded bg-white px-4 py-2 text-sm shadow-md dark:bg-black"
        >
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Base option params on current params so we can preserve any other param state in the url.
            const optionSearchParams = new URLSearchParams(searchParams?.toString());

            // Update the option params using the current option to reflect how the url *would* change,
            // if the option was clicked.
            optionSearchParams.set(optionNameLowerCase, value);
            const optionUrl = createUrl(pathname, optionSearchParams);

            // In order to determine if an option is available for sale, we need to:
            //
            // 1. Filter out all other param state
            // 2. Filter out invalid options
            // 3. Check if the option combination is available for sale
            //
            // This is the "magic" that will cross check possible variant combinations and preemptively
            // disable combinations that are not available. For example, if the color gray is only available in size medium,
            // then all other sizes should be disabled.
            const filtered = Array.from(optionSearchParams.entries()).filter(([key, value]) =>
              options.find(
                (option) => option.name.toLowerCase() === key && option.values.includes(value),
              ),
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) => combination[key] === value && combination.availableForSale,
              ),
            );

            // You can't disable a link, so we need to render something that isn't clickable.
            const DynamicTag = isAvailableForSale ? Link : 'p';
            const dynamicProps = {
              ...(isAvailableForSale && { scroll: false }),
            };

            return (
              <DynamicTag
                key={value}
                aria-disabled={!isAvailableForSale}
                href={optionUrl}
                title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                className={clsx(
                  'flex w-fit min-w-[95px] items-center justify-center whitespace-nowrap px-2 py-1 text-sm',
                  {
                    'relative cursor-not-allowed overflow-hidden text-neutral-500':
                      !isAvailableForSale,
                  },
                )}
                {...dynamicProps}
              >
                {value}
              </DynamicTag>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    // Adds key / value pairs for each variant (ie. "color": "Black" and "size": 'M").
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {},
    ),
  }));

  return options.map((option) => (
    <div key={option.id} className="pt-6">
      <div className="grid grid-cols-4 place-content-center gap-x-10">
        <div className="my-2 align-middle capitalize tracking-wider md:text-[14px] lg:text-sm">
          {option.name}
        </div>
        <div className="col-span-2">
          <Suspense>
            <VariantSelectorDropdown
              option={option}
              options={options}
              combinations={combinations}
            />
          </Suspense>
        </div>
      </div>
    </div>
  ));
}
