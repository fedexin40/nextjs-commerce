import { PageItem } from 'components/htmlParser/page';
import { getPage } from 'lib/saleor';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  // fetch data
  let page;
  try {
    page = await getPage(params.slug);
  } catch (error) {
    notFound();
  }

  return {
    title: page.seo?.title,
    description: page.seo?.description,
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  let page;
  try {
    page = await getPage(params.slug);
  } catch (error) {
    notFound();
  }

  const content = JSON.parse(page.body);
  return (
    <div className="flex flex-col px-10 py-14 text-justify tracking-wider	md:px-28 lg:px-48">
      <PageItem content={content} />
    </div>
  );
}
