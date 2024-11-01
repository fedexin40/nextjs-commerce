import { Page } from 'lib/types';
import Link from 'next/link';

function PageLink({ page }: { page: Page }) {
  const slug = page.slug;
  const url = `/page/${slug}`;

  return (
    <div>
      <div className="flex flex-col gap-4 capitalize">
        <Link href={url}>{page.title}</Link>
      </div>
    </div>
  );
}

export default function FooterMenu({ pages }: { pages: Page[] }) {
  if (!pages.length) return null;

  return (
    <div className="flex flex-col gap-y-6">
      {pages.map((page) => (
        <span key={page.title}>
          <PageLink page={page} />
        </span>
      ))}
    </div>
  );
}
