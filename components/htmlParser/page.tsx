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
          <div className="pl-4">
            <ol className="list-inside list-decimal">
              {block.data.items.map((item) => {
                return (
                  <li className="pb-4 text-left md:text-justify" key={item}>
                    {ReactHtmlParser(item)}
                  </li>
                );
              })}
            </ol>
          </div>
        );
      }
      return (
        <ul className="list-disc">
          {block.data.items.map((item) => {
            return (
              <div className="pl-4">
                <ol className="list-disc">
                  <li className="pb-4 text-left md:text-justify" key={item}>
                    {ReactHtmlParser(item)}
                  </li>
                </ol>
              </div>
            );
          })}
        </ul>
      );
    }
  }
}

export function PageItem({ content }: { content: pageType }) {
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
