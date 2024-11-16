'use client';

import { loadProducts } from 'actions/loadmore';
import clsx from 'clsx';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { ProductOrderField } from 'lib/saleor/generated/graphql';
import { Product } from 'lib/types';
import { useEffect, useState, useTransition } from 'react';
import { useLoadMore, useLoadMoreActions } from 'stores/loadMore';

function LoadMoreItem({
  numbersOfPages,
  first,
  reverse,
  sortKey,
  collection,
  query,
  pageNumber,
}: {
  first: number;
  numbersOfPages: number;
  pageNumber: number;
  reverse?: boolean;
  sortKey?: ProductOrderField;
  query?: string;
  collection?: string;
}) {
  const [products, setProducts] = useState<Product[] | undefined>([]);
  const [isPending, startTransition] = useTransition();
  const useLoadMoreProducts = useLoadMore();
  const { setEndCursor, setStartCursor } = useLoadMoreActions();
  const { increasePageNumber } = useLoadMoreActions();

  function ProductsLoad() {
    startTransition(async () => {
      const products = await loadProducts({
        first: first,
        numbersOfPages: numbersOfPages,
        pageNumber: pageNumber,
        endCursor: useLoadMoreProducts.endCursor,
        reverse: reverse,
        sortKey: sortKey,
        query: query,
        collection: collection,
      });
      setProducts(products?.products);
      setEndCursor(products?.endCursor || '');
      setStartCursor(products?.startCursor || '');
      increasePageNumber();
    });
  }

  return (
    <>
      {pageNumber <= useLoadMoreProducts.currentPageNumber && (
        <>
          {products && products.length > 0 ? (
            <div className="mx-10 mb-24 lg:mx-32 lg:mb-40">
              <Grid className="grid-cols-1 gap-y-24 md:grid-cols-3 lg:grid-cols-4 xl:gap-y-40">
                <ProductGridItems products={products} />
              </Grid>
            </div>
          ) : null}
          <div>
            <div
              className={clsx(
                'my-20 flex justify-center uppercase underline underline-offset-8 hover:cursor-pointer',
                {
                  hidden:
                    isPending ||
                    pageNumber == numbersOfPages ||
                    useLoadMoreProducts.currentPageNumber > pageNumber,
                },
              )}
              onClick={() => ProductsLoad()}
            >
              Ver mas productos
            </div>
            <div
              className={clsx(
                'my-20 flex w-full items-center justify-center space-x-6 tracking-wider ',
                {
                  hidden: !isPending || (products && products.length > 0),
                },
              )}
            >
              <div className="h-4 w-4 animate-bounce rounded-full bg-black [animation-delay:-0.3s] dark:bg-white"></div>
              <div className="h-4 w-4 animate-bounce rounded-full bg-black [animation-delay:-0.15s] dark:bg-white"></div>
              <div className="h-4 w-4 animate-bounce rounded-full bg-black dark:bg-white"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function LoadMore({
  numbersOfPages,
  endCursor,
  startCursor,
  first,
  reverse,
  sortKey,
  collection,
  query,
}: {
  first: number;
  numbersOfPages: number;
  endCursor: string;
  startCursor: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
  query?: string;
  collection?: string;
}) {
  const { setEndCursor, setStartCursor, setSortKey } = useLoadMoreActions();
  useEffect(() => {
    setEndCursor(endCursor);
    setStartCursor(startCursor);
  }, []);

  const pages = Array.from({ length: numbersOfPages }, (v, i) => i + 1);
  return (
    <div>
      {pages.map((page) => (
        <div key={page}>
          <LoadMoreItem
            numbersOfPages={numbersOfPages}
            first={first}
            reverse={reverse}
            sortKey={sortKey}
            collection={collection}
            query={query}
            pageNumber={page}
          />
        </div>
      ))}
    </div>
  );
}
