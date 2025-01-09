import { getPage } from 'lib/saleor';
import ReactHtmlParser from 'react-html-parser';

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
    return (
      <div className="py-3 pt-14 text-base font-semibold capitalize">
        {ReactHtmlParser(block.data.text)}
      </div>
    );
  } else if (block.type == 'paragraph') {
    return <div className="py-2 text-justify">{ReactHtmlParser(block.data.text)}</div>;
  } else if (block.type == 'list') {
    if (block.data.text) {
      return <div className="text-justify">{ReactHtmlParser(block.data.text)}</div>;
    } else if (block.data.items) {
      return (
        <div>
          {block.data.items.map((item) => {
            return (
              <li className="pb-4" key={item}>
                {ReactHtmlParser(item)}
              </li>
            );
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
          <>
            <div
              className="text flex flex-col whitespace-pre-line text-sm tracking-wider"
              key={block.id}
            >
              <Item block={block} />
            </div>
          </>
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
    <div className="flex flex-col px-10 py-14 text-justify tracking-wider	md:px-28 lg:px-48">
      <PageItem content={content} />
    </div>
  );
}
