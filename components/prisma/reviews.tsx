'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Carousel } from '@material-tailwind/react';
import { useEffect, useMemo, useState } from 'react';

type ReviewRow = {
  id: string;
  userName: string | null;
  avatarColor: string | null;
  rating: number;
  title: string | null;
  message: string;
  createdAt: Date | string;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const s = Math.max(1, size);
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += s) out.push(arr.slice(i, i + s));
  return out;
}

function getItemsPerView(width: number) {
  // Tailwind breakpoints típicos: sm=640, lg=1024
  if (width >= 1024) return 3; // PC
  if (width >= 640) return 2; // Tablet
  return 1; // Teléfono
}

function Stars({ value }: { value: number }) {
  const full = Math.max(0, Math.min(5, value));
  return (
    <div className="flex items-center gap-0.5 text-sm leading-none" aria-label={`${full} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );
}

function Avatar({ name, color }: { name: string | null; color: string | null }) {
  const initial = (name?.trim()?.[0] ?? 'C').toUpperCase();
  const bg = color ?? '#111827';
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: bg }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

/**
 * Card HTML (Tailwind) inspirada en el patrón de "HTML Card" de Material Tailwind.
 */
function ReviewCard({ r }: { r: ReviewRow }) {
  const date =
    typeof r.createdAt === 'string'
      ? new Date(r.createdAt)
      : r.createdAt instanceof Date
        ? r.createdAt
        : new Date(String(r.createdAt));

  return (
    <article className="relative flex w-full flex-col rounded-xl bg-gray-100 bg-clip-border text-gray-700 shadow-md shadow-gray-400">
      <div className="p-6">
        <div className="flex items-start gap-3">
          <Avatar name={r.userName} color={r.avatarColor} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-blue-gray-900 font-semibold capitalize">
                  {r.userName || 'Anónimo'}
                </div>
                <div className="mt-1">
                  <Stars value={r.rating} />
                </div>
              </div>

              <div className="shrink-0 text-xs text-gray-500">
                {date.toLocaleDateString('en-US')}
              </div>
            </div>

            <div className="mt-3 text-sm font-medium text-gray-900">{r.title || 'Review'}</div>
            <p className="mt-1 whitespace-pre-line text-sm text-gray-800">{r.message}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ReviewsCarouselClient({ reviews }: { reviews: ReviewRow[] }) {
  const [itemsPerView, setItemsPerView] = useState(3);
  const showArrows = reviews.length > itemsPerView;

  useEffect(() => {
    const update = () => setItemsPerView(getItemsPerView(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const slides = useMemo(() => chunk(reviews, itemsPerView), [reviews, itemsPerView]);

  return (
    <div>
      {/* Carousel (3/2/1 por slide) */}
      <Carousel
        className="rounded-xl"
        placeholder={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        prevArrow={
          showArrows
            ? ({ handlePrev }) => (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 transform bg-transparent text-black hover:text-gray-800"
                >
                  <ChevronLeftIcon className="h-8 w-8" />
                </button>
              )
            : undefined
        }
        nextArrow={
          showArrows
            ? ({ handleNext }) => (
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform bg-transparent text-black hover:text-gray-800"
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </button>
              )
            : undefined
        }
      >
        {slides.map((group, idx) => (
          <div key={idx} className="p-2">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-5">
              {group.map((r) => (
                <ReviewCard key={r.id} r={r} />
              ))}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
