'use client';

import { loadProducts } from 'actions/loadmore';
import clsx from 'clsx';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { Product } from 'lib/types';
import { useEffect, useState, useTransition } from 'react';
import { useLoadMore, useLoadMoreActions } from 'stores/loadMore';

function LoadMoreItem({
  collection,
  first,
  pageNumber,
  numbersOfPages,
}: {
  collection: string;
  first: number;
  pageNumber: number;
  numbersOfPages: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const useLoadMoreProducts = useLoadMore();
  const { setCursor } = useLoadMoreActions();
  const { increasePageNumber } = useLoadMoreActions();
  const cursor = useLoadMoreProducts.cursor;

  function ProductsLoad() {
    startTransition(async () => {
      const products = await loadProducts({ first: first, collection: collection, cursor: cursor });
      setProducts(products.products);
      setCursor(products.cursor);
      increasePageNumber();
    });
  }

  return (
    <>
      {pageNumber <= useLoadMoreProducts.currentPageNumber && (
        <>
          {products.length > 0 ? (
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
                  hidden: !isPending || products.length > 0,
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
  collection,
  first,
  cursor,
  numbersOfPages,
}: {
  collection: string;
  first: number;
  cursor: string;
  numbersOfPages: number;
}) {
  const { setCursor } = useLoadMoreActions();

  useEffect(() => {
    setCursor(cursor);
  }, []);

  const pages = Array.from({ length: numbersOfPages }, (v, i) => i + 1);
  return (
    <div>
      {pages.map((page) => (
        <div key={page}>
          <LoadMoreItem
            numbersOfPages={numbersOfPages}
            pageNumber={page}
            collection={collection}
            first={first}
          />
        </div>
      ))}
    </div>
  );
}
