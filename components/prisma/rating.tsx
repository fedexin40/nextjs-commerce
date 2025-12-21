'use client';

import { useMemo, useState } from 'react';

export default function StarRatingInput({
  name = 'rating',
  defaultValue = 5,
  size = 'text-xl',
}: {
  name?: string;
  defaultValue?: number;
  size?: string;
}) {
  const safeDefault = useMemo(() => {
    const v = Number(defaultValue);
    return Number.isFinite(v) && v >= 1 && v <= 5 ? v : 5;
  }, [defaultValue]);

  const [value, setValue] = useState<number>(safeDefault);
  const [hover, setHover] = useState<number | null>(null);

  const shown = hover ?? value;

  return (
    <div className="flex items-center gap-3">
      {/* input real que viaja en el POST del formData */}
      <input type="hidden" name={name} value={value} />

      <div className="flex items-center gap-1" aria-label="Rating">
        {Array.from({ length: 5 }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= shown;

          return (
            <button
              key={starValue}
              type="button"
              className={`${size} leading-none ${filled ? 'text-yellow-500' : 'text-gray-300'}`}
              aria-label={`${starValue} star`}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(starValue)}
              onBlur={() => setHover(null)}
              onClick={() => setValue(starValue)}
            >
              ★
            </button>
          );
        })}
      </div>

      <div className="text-sm text-gray-600">{value}/5</div>
    </div>
  );
}
