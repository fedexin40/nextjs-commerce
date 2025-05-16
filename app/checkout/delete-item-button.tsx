import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LoadingDots from 'components/loading-dots';
import { useRouter } from 'next/navigation';

import { removeItem } from 'actions/cart';
import clsx from 'clsx';
import type { CartItem } from 'lib/types';
import { useTransition } from 'react';

export default function DeleteItemButton({ item }: { item: CartItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label="Remove cart item"
      onClick={() => {
        startTransition(async () => {
          const error = await removeItem(item.id);

          if (error) {
            // Trigger the error boundary in the root error.js
            throw new Error(error.toString());
          }

          router.refresh();
        });
      }}
      disabled={isPending}
      className={clsx('ease flex transition-all duration-200', {
        'cursor-not-allowed px-0': isPending,
      })}
    >
      {isPending ? <LoadingDots className="bg-black" /> : <DeleteOutlineIcon />}
    </button>
  );
}
