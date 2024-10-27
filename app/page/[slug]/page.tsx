import { getPage } from 'lib/saleor';

type block = {
  id: string;
  type: string;
  data: {
    text?: string;
    items?: string[];
  };
};

type pageType = {
  time: string;
  blocks: block[];
  version: string;
};

function Item({ block }: { block: block }) {
  if (block.type == 'header') {
    return <div className="py-9 pl-4 font-semibold">{block.data.text}</div>;
  } else if (block.type == 'paragraph') {
    return <div className="py-2">{block.data.text}</div>;
  } else if (block.type == 'list') {
    if (block.data.text) {
      return <div className="">{block.data.text}</div>;
    } else if (block.data.items) {
      return (
        <div>
          {block.data.items.map((item) => {
            return <li>{item.replace(/\<br\>/g, ' ')}</li>;
          })}
        </div>
      );
    }
  }
}

function PageItem({ content }: { content: pageType }) {
  return (
    <>
      {content.blocks.map((block) => {
        return (
          <div className="flex flex-col gap-7 text-sm" key={block.id}>
            <Item block={block} />
          </div>
        );
      })}
    </>
  );
}

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
    <div className="flex flex-col gap-6 px-48 py-20 tracking-wider">
      <div className="text-xs uppercase">{page.title}</div>
      <div>
        <PageItem content={content} />
      </div>
    </div>
  );
}
