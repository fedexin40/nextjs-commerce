'use client';

import { useState } from 'react';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/types';
import { AddToCart } from 'components/product/add-to-cart';
import { VariantSelector } from 'components/product/variant-selector';
import Prose from 'components/prose';
import Rating from '@mui/material/Rating';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Carousel from 'better-react-carousel';

function currencyFormat(num: number) {
  return '$ ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function SimpleBackdrop({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <button className="text-sky-600" onClick={handleOpen}>
        {title}
      </button>
      <Backdrop sx={{ color: '#fff', zIndex: '50' }} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export function Gallery({ product }: { product: Product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [value, setValue] = useState(2);
  let amount = parseFloat(product.priceRange.maxVariantPrice.amount);

  return (
    <div className="grid-cols md:grid md:grid-cols-11">
      {product.images.length > 1 ? (
        <div className="hidden md:col-span-1 md:block">
          {product.images.map((image, index) => {
            return (
              <div
                aria-label="Enlarge product image"
                key={image.url}
                onMouseEnter={() => setCurrentImage(index)}
              >
                <GridTileImage alt={image?.altText} src={image.url} width={600} height={600} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="md:col-span-1" />
      )}

      <div className="hidden md:col-span-7 md:block">
        <div className="hidden pl-20 md:block lg:hidden">
          <div className="text-3xl font-bold">
            {product.title}
            <div className="flex-cols flex gap-1 pt-3 text-base lg:text-xl">
              {currencyFormat(amount)}
            </div>
          </div>
        </div>
        {product.images[currentImage] && (
          <GridTileImage
            src={product.images[currentImage]?.url as string}
            alt={product.images[currentImage]?.altText as string}
            width={600}
            height={600}
            isInteractive={false}
            priority={true}
            zoom={true}
          />
        )}
      </div>

      <div className="md:hidden">
        <div className="text-3xl font-bold">
          {product.title}
          <div className="flex-cols flex gap-1 pt-3 text-base lg:text-xl">
            {currencyFormat(amount)}
          </div>
        </div>
        <Carousel cols={1} rows={1} loop={true}>
          {product?.images.map((image) => (
            <Carousel.Item key={image.url}>
              <GridTileImage alt={'image'} src={image?.url} width={600} height={600} />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className="pr-3 md:col-span-3">
        <div className="z-10 mt-2 flex flex-col justify-between gap-2 pb-3 md:pr-3 ">
          <div className="z-10 flex flex-col justify-between rounded-3xl bg-white p-3 pb-8 pt-8 shadow-2xl shadow-black drop-shadow-xl">
            <div className="hidden text-left text-lg font-medium lg:block lg:text-4xl">
              {product.title}
              <div className="flex-cols flex gap-1 pt-3 text-base lg:text-xl">
                {currencyFormat(amount)}
              </div>
            </div>
            <div className="text-left font-serif text-base font-light lg:text-3xl">
              {product.descriptionHtml ? (
                <Prose className="mb-6 text-sm leading-tight" html={product.descriptionHtml} />
              ) : null}
            </div>
            <div className="flex flex-row">
              <Rating
                size="large"
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </div>
            <div className="pt-3">
              Caracteristicas
              <ul className="pt-2 text-sm">
                <li>Tal cosa</li>
                <li>Siguiente cosa</li>
                <li>Otra cosa mas</li>
                <li>La ultima cosa</li>
              </ul>
            </div>
            <div className="flex flex-col pt-5">
              {/* @ts-expect-error Server Component */}
              <VariantSelector options={product.options} variants={product.variants} />
            </div>
            <div className="">
              <div className="to-text-pink-950 text-left font-serif text-base font-light text-pink-700	lg:text-2xl">
                Devolución gratis
              </div>
              <div className="pt-2 font-serif text-sm font-light">
                Tienes 15 dias desde que lo recibes
              </div>
              <div className="pb-5 pt-2 font-serif text-sm font-light">
                <SimpleBackdrop title="Conocer mas" />
              </div>
              <div className="pb-5 pt-2 font-serif text-sm font-light">
                <AddToCart
                  variants={product.variants}
                  availableForSale={product.availableForSale}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
