import { PageItem } from 'components/htmlParser/page';
import { getPage } from 'lib/saleor';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = await getPage(params.slug);
  const content = JSON.parse(page.body);
  return (
    <div className="flex flex-col px-10 py-14 text-justify tracking-wider	md:px-28 lg:px-48">
      <PageItem content={content} />
    </div>
  );
}
