import { getPage } from 'lib/saleor';
import ReactHtmlParser from 'react-html-parser';

type block = {
  id: string;
  type: string;
  data: {
    text?: string;
    items?: string[];
    style?: string;
    level?: number;
  };
};

type pageType = {
  time: string;
  blocks: block[];
  version: string;
};

function Item({ block }: { block: block }) {
  if (block.type == 'header') {
    if (block.data.level == 1)
      return (
        <div className="py-3 pt-14 text-base font-semibold capitalize">
          <h1>{ReactHtmlParser(block.data.text)}</h1>
        </div>
      );
    else if (block.data.level == 2)
      return (
        <div className="py-3 pt-14 text-base font-semibold capitalize">
          <h2>{ReactHtmlParser(block.data.text)}</h2>
        </div>
      );
    else if (block.data.level == 3)
      return (
        <div className="py-3 pt-14 text-base font-semibold capitalize">
          <h3>{ReactHtmlParser(block.data.text)}</h3>
        </div>
      );
  } else if (block.type == 'paragraph') {
    return <div className="py-2 text-justify">{ReactHtmlParser(block.data.text)}</div>;
  } else if (block.type == 'list') {
    if (block.data.text) {
      return <div className="text-justify">{ReactHtmlParser(block.data.text)}</div>;
    } else if (block.data.items) {
      if (block.data.style == 'ordered') {
        return (
          <ol className="list-inside list-decimal">
            {block.data.items.map((item) => {
              return (
                <li className="pb-4 text-left md:text-justify" key={item}>
                  {ReactHtmlParser(item)}
                </li>
              );
            })}
          </ol>
        );
      }
      return (
        <ul className="list-disc">
          {block.data.items.map((item) => {
            return (
              <li className="pb-4 text-left md:text-justify" key={item}>
                {ReactHtmlParser(item)}
              </li>
            );
          })}
        </ul>
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
