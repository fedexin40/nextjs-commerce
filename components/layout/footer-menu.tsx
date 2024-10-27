import { Page } from 'lib/types';
import Link from 'next/link';

function PageLink({ page }: { page: Page }) {
  const slug = page.slug;
  const url = `/page/${slug}`;

  return (
    <div>
      <Link href={url}>
        <div className="black:text-[#c9aa9e] flex gap-4 capitalize lg:flex-col">
          <div className="underline underline-offset-8 ">{page.title}</div>
        </div>
      </Link>
    </div>
  );
}

export default function FooterMenu({ pages }: { pages: Page[] }) {
  if (!pages.length) return null;

  return (
    <>
      {pages.map((page) => (
        <div key={page.title}>
          <PageLink page={page} />
        </div>
      ))}
    </>
  );
}
