'use client';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { HiOutlineShoppingBag } from 'react-icons/hi';

import LoadingDots from 'components/loading-dots';
import { ProductVariant } from 'lib/types';

export function AddToCart({
  variants,
  availableForSale
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const variant = variants.find((variant: ProductVariant) =>
      variant.selectedOptions.every(
        (option) => option.value === searchParams.get(option.name.toLowerCase())
      )
    );

    if (variant) {
      setSelectedVariantId(variant.id);
    }
  }, [searchParams, variants, setSelectedVariantId]);

  const isMutating = adding || isPending;

  async function handleAdd() {
    if (!availableForSale) return;

    setAdding(true);

    const response = await fetch(`/api/cart`, {
      method: 'POST',
      body: JSON.stringify({
        merchandiseId: selectedVariantId
      })
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setAdding(false);

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      aria-label="Add item to cart"
      disabled={isMutating}
      onClick={handleAdd}
      className={clsx(
        'flex w-full items-center justify-center rounded-2xl bg-black p-4 text-sm uppercase tracking-wide text-white opacity-90 hover:opacity-50 dark:bg-white dark:text-black',
        {
          'cursor-not-allowed opacity-60': !availableForSale,
          'cursor-not-allowed': isMutating
        }
      )}
    >
      <span>
        {availableForSale ? (
          <div className="flex flex-row	items-center text-lg lg:text-sm xl:space-x-5">
            <div className="hidden xl:block">Agregar al carrito</div>
            <HiOutlineShoppingBag />
          </div>
        ) : (
          'No disponible'
        )}
      </span>
      {isMutating ? <LoadingDots className="bg-white dark:bg-black" /> : null}
    </button>
  );
}
