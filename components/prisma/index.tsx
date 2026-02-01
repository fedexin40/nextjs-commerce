import { prisma } from '#/lib/prisma';
import { revalidatePath } from 'next/cache';
import StarRatingInput from './rating';
import ReviewsCarouselClient from './reviews';

const PAGE_SIZE = 5;

type SortKey = 'recent' | 'highest' | 'lowest';

function sanitizeForPostgres(input: unknown, maxLen = 5000): string {
  const s = String(input ?? '');

  // 1) Quitar null bytes (Postgres no permite \u0000 en text)
  let out = s.replace(/\u0000/g, '');

  // 2) Re-encode para “limpiar” secuencias inválidas
  // Buffer.from(str, 'utf8') reemplaza secuencias inválidas por U+FFFD al decodificar.
  out = Buffer.from(out, 'utf8').toString('utf8');

  // 3) Normalizar unicode (evita combinaciones raras)
  // NFC suele ser más compatible para búsquedas y display.
  out = out.normalize('NFC');

  // 4) Recortar a un máximo (previene payloads enormes)
  if (out.length > maxLen) out = out.slice(0, maxLen);

  // 5) Trim suave (opcional)
  return out.trim();
}

function clampInt(v: unknown, fallback: number) {
  const n = typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function getOrderBy(sort: SortKey) {
  switch (sort) {
    case 'highest':
      return [{ rating: 'desc' as const }, { createdAt: 'desc' as const }];
    case 'lowest':
      return [{ rating: 'asc' as const }, { createdAt: 'desc' as const }];
    case 'recent':
    default:
      return [{ createdAt: 'desc' as const }];
  }
}

function buildUrl(
  basePath: string,
  current: Record<string, string | string[] | undefined>,
  patch: { pageReviews?: number | null },
) {
  const usp = new URLSearchParams();
  // Copiar params existentes
  for (const [k, v] of Object.entries(current)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      for (const item of v) usp.append(k, item);
    } else {
      usp.set(k, v);
    }
  }

  // Aplicar el cambio de paginación
  if (patch.pageReviews === null) {
    usp.delete('pageReviews');
  } else if (typeof patch.pageReviews === 'number') {
    usp.set('pageReviews', String(patch.pageReviews));
  }

  const qs = usp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
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

// -------- SERVER ACTION: crear reseña (pendiente de aprobación) --------
export async function createReview(formData: FormData) {
  'use server';

  const productId = String(formData.get('productId') ?? '');
  const productSlug = String(formData.get('productSlug') ?? '');
  const rating = Number(formData.get('rating'));
  const messageRaw = String(formData.get('message') ?? '').trim();
  const titleRaw = String(formData.get('title') ?? '').trim();
  const userNameRaw = String(formData.get('userName') ?? '').trim();

  if (!productId || !productSlug || !messageRaw || !Number.isFinite(rating)) {
    throw new Error('Missing required fields');
  }
  if (rating < 1 || rating > 5) {
    throw new Error('Invalid rating');
  }

  // Avatar color simple (determinístico por inicial)
  const initial = (userNameRaw[0] ?? 'C').toUpperCase();
  const palette = ['#111827', '#0EA5E9', '#22C55E', '#A855F7', '#F59E0B', '#EC4899'];
  const avatarColor = palette[initial.charCodeAt(0) % palette.length];

  const userName = sanitizeForPostgres(userNameRaw, 80) || null;
  const title = sanitizeForPostgres(titleRaw, 120) || null;
  const message = sanitizeForPostgres(messageRaw, 5000);

  await prisma.review.create({
    data: {
      productId,
      productSlug,
      rating,
      message,
      title: title || null,
      userName: userName || null,
      avatarColor,
      isApproved: false, // moderación: NO se muestra hasta aprobar
    },
  });

  // Revalidar la PDP
  revalidatePath(`/product/${productSlug}`);
}

export async function Rating({ productId }: { productId: string }) {
  // Totales y breakdown por estrellas (para “0% (0) …”)
  const whereApproved = { productId, isApproved: true as const };
  const [totalApproved, g1, g2, g3, g4, g5] = await Promise.all([
    prisma.review.count({ where: whereApproved }),
    prisma.review.count({ where: { ...whereApproved, rating: 1 } }),
    prisma.review.count({ where: { ...whereApproved, rating: 2 } }),
    prisma.review.count({ where: { ...whereApproved, rating: 3 } }),
    prisma.review.count({ where: { ...whereApproved, rating: 4 } }),
    prisma.review.count({ where: { ...whereApproved, rating: 5 } }),
  ]);

  const avg =
    totalApproved === 0
      ? 0
      : Math.round(((1 * g1 + 2 * g2 + 3 * g3 + 4 * g4 + 5 * g5) / totalApproved) * 100) / 100;

  if (totalApproved > 0) {
    return (
      <div>
        <div className="mt-2 flex flex-col gap-1 py-3">
          <div className="flex flex-row gap-3">
            <Stars value={Math.round(avg)} />
            <div className="text-sm text-gray-700">
              <span className="font-medium">{avg.toFixed(2)}</span> de 5
            </div>
          </div>
          <div className="text-sm text-gray-500">Basado en {totalApproved} reseñas</div>
        </div>
      </div>
    );
  }
}

export default async function Reviews({
  productId,
  productSlug,
  pageReviews,
  sortReviews,
  basePath,
  searchParams,
}: {
  productId: string;
  productSlug: string;
  pageReviews?: string;
  sortReviews?: string;
  basePath: string;
  searchParams: any;
}) {
  const page = clampInt(pageReviews, 1);
  const sort: SortKey =
    sortReviews === 'highest' || sortReviews === 'lowest' ? (sortReviews as SortKey) : 'recent';

  const whereApproved = { productId, isApproved: true as const };

  // Totales y breakdown por estrellas (para “0% (0) …”)
  const [totalApproved, g1, g2, g3, g4, g5] = await Promise.all([
    prisma.review.count({ where: whereApproved }),
    prisma.review.count({ where: { ...whereApproved, rating: 1 } }),
    prisma.review.count({ where: { ...whereApproved, rating: 2 } }),
    prisma.review.count({ where: { ...whereApproved, rating: 3 } }),
    prisma.review.count({ where: { ...whereApproved, rating: 4 } }),
    prisma.review.count({ where: { ...whereApproved, rating: 5 } }),
  ]);

  const avg =
    totalApproved === 0
      ? 0
      : Math.round(((1 * g1 + 2 * g2 + 3 * g3 + 4 * g4 + 5 * g5) / totalApproved) * 100) / 100;

  const totalPages = Math.max(1, Math.ceil(totalApproved / PAGE_SIZE));

  const reviews = await prisma.review.findMany({
    where: whereApproved,
    orderBy: getOrderBy(sort),
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const prevUrl = buildUrl(basePath, searchParams, { pageReviews: page - 1 });
  const nextUrl = buildUrl(basePath, searchParams, { pageReviews: page + 1 });

  return (
    <section className="w-full" id="customer-reviews">
      {/* Header: Customer Reviews */}
      <div className="flex flex-col justify-center pt-5">
        <div>
          <h2 className="text-base tracking-[1.4px]">Que piensas nuestros clientes de nosotros</h2>

          {totalApproved > 0 ? (
            <div className="flex flex-col gap-0">
              <div className="flex flex-row gap-3">
                <Stars value={Math.round(avg)} />
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{avg.toFixed(2)}</span> de 5
                </div>
              </div>
              <div className="text-sm text-gray-500">Basado en {totalApproved} reseñas</div>
              {/* Lista de reseñas + Paginación (client) */}
              <div className="py-10">
                <ReviewsCarouselClient reviews={reviews} />
              </div>
            </div>
          ) : (
            <div className="my-5 text-gray-500">
              Auno no hay comentarios. Se el primero en escribir una reseña
            </div>
          )}
        </div>
      </div>

      {/* Write a review (form) */}
      <div id="write-a-review" className="w-full">
        <div className="text-base">Escribe una reseña</div>
        <div className="my-5 text-gray-500">
          Tu reseña sera visible solo despues de que sea aprobada.
        </div>

        <form action={createReview} className="mt-4 grid gap-3">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="productSlug" value={productSlug} />

          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Nombre (opcional)</span>
            <input
              name="userName"
              className="mb-3 w-full rounded-lg border border-black bg-white px-2 py-2"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Titulo (opcional)</span>
            <input
              name="title"
              className="mb-3 w-full rounded-lg border border-black bg-white px-2 py-2"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Calificación</span>
            <StarRatingInput name="rating" defaultValue={5} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-700">Reseña</span>
            <textarea
              name="message"
              required
              className="mb-3 min-h-[110px] w-full rounded-lg border border-black bg-white px-2 py-2"
            />
          </label>

          <button
            type="submit"
            className="relative my-5 flex h-[60px] w-full items-center justify-center bg-[#c9aa9e] p-4 uppercase tracking-wider text-black hover:opacity-90 md:w-1/3"
          >
            Enviar revisión
          </button>
        </form>
      </div>
    </section>
  );
}
