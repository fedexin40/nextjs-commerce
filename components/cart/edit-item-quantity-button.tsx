import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { removeItem, updateItemQuantity } from 'actions/cart';
import clsx from 'clsx';
import type { CartItem } from 'lib/types';
import LoadingDots from '../loading-dots';

export default function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: 'plus' | 'minus';
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'}
      onClick={() => {
        startTransition(async () => {
          try {
            const error =
              type === 'minus' && item.quantity - 1 === 0
                ? await removeItem(item.id)
                : await updateItemQuantity({
                    lineId: item.id,
                    variantId: item.merchandise.id,
                    quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1,
                  });
          } catch (error) {
            console.log(error);
          }
          router.refresh();
        });
      }}
      disabled={isPending}
      className={clsx(
        'ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80',
        {
          'cursor-not-allowed': isPending,
          'ml-auto': type === 'minus',
        },
      )}
    >
      {isPending ? (
        <LoadingDots className="bg-black" />
      ) : type === 'plus' ? (
        <PlusIcon className="h-4 w-4" />
      ) : (
        <MinusIcon className="h-4 w-4" />
      )}
    </button>
  );
}
