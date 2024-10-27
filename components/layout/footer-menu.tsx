import { Page } from 'lib/types';
import Link from 'next/link';

function PageLink({ page }: { page: Page }) {
  const slug = page.slug;
  const url = `/page/${slug}`;

  return (
    <div>
      <div className="flex flex-col gap-4 capitalize text-[#c9aa9e]">
        <div>{page.title}</div>
        <Link href={url}>
          <div className="underline underline-offset-8">... Ver mas</div>
        </Link>
      </div>
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
