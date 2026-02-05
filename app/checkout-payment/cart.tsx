'use client';

import { Accordion, AccordionBody, AccordionHeader } from '@material-tailwind/react';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import type { Cart as CartType } from 'lib/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function Cart({ cart }: { cart: CartType | null }) {
  // It is impossible to be here without a car, or at least I think
  // that's why I am only returning
  if (!cart) {
    return <div />;
  }
  let deliveryPrice = Number(cart.cost.totalAmount.amount);
  cart.lines.map((item) => {
    deliveryPrice -= Number(item.cost.totalAmount.amount) * item.quantity;
  });

  return (
    <>
      <div className="flex flex-col justify-between overflow-hidden">
        <ul className="flex-grow py-4">
          {cart.lines.map((item, i) => {
            const merchandiseSearchParams = {} as MerchandiseSearchParams;

            item.merchandise.selectedOptions.forEach(({ name, value }) => {
              if (value !== DEFAULT_OPTION) {
                merchandiseSearchParams[name.toLowerCase()] = value;
              }
            });

            const merchandiseUrl = createUrl(
              `/Colecciones/${item.merchandise.product.featureCollection?.slug}/${item.merchandise.product.handle}`,
              new URLSearchParams(merchandiseSearchParams),
            );

            return (
              <li key={i} className="flex w-full flex-col border-b border-neutral-300">
                <div className="relative flex w-full flex-row justify-between px-1 py-4">
                  <Link
                    href={merchandiseUrl}
                    onClick={() => {}}
                    className="z-30 flex flex-row space-x-4"
                  >
                    <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300">
                      <Image
                        className="h-full w-full object-cover"
                        width={64}
                        height={64}
                        alt={
                          item.merchandise.product.featuredImage.altText ||
                          item.merchandise.product.title
                        }
                        src={item.merchandise.product.featuredImage.url}
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      {item.merchandise.title !== DEFAULT_OPTION ? (
                        <p className="text-[13px] tracking-widest lg:text-[14.3px]">
                          {item.merchandise.title}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                  <div className="flex h-16 flex-col justify-between">
                    <Price
                      className="flex justify-end space-y-2 text-right"
                      amountMax={item.cost.totalAmount.amount}
                      currencyCode={item.cost.totalAmount.currencyCode}
                    />
                    <div className="ml-auto flex h-9 flex-row items-center">
                      <div className="flex flex-row">
                        <span className="pr-2">Piezas:</span>
                        <p className="w-6 text-center">
                          <span className="w-full">{item.quantity}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col pt-10 text-neutral-500">
          <div className="mb-2 flex items-center justify-between border-[#acacac] pb-1 capitalize text-black">
            <p>Subtotal</p>
            <Price
              className="text-black"
              amountMax={cart.cost.subtotalAmountBeforeTaxes.amount}
              currencyCode={cart.cost.subtotalAmountBeforeTaxes.currencyCode}
            />
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 uppercase text-black">
            <p>Iva (16%)</p>
            <Price
              className="text-black"
              amountMax={cart.cost.totalTaxAmount.amount}
              currencyCode={cart.cost.totalTaxAmount.currencyCode}
            />
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 capitalize text-black">
            <p>Envío</p>
            <Price
              className="text-black"
              amountMax={cart.cost.totalShippingAmount.amount}
              currencyCode={cart.cost.totalShippingAmount.currencyCode}
            />
          </div>
          <div className="mb-2 flex items-center justify-between border-t-2 border-[#acacac] pb-1 pt-5 capitalize text-black">
            <p>Total</p>
            <Price
              className="text-black"
              amountMax={cart.cost.totalAmount.amount}
              currencyCode={cart.cost.totalAmount.currencyCode}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function CartMobile({ cart }: { cart: CartType | null }) {
  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Accordion
        className="pb-5"
        open={open === 1}
        placeholder={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <AccordionHeader
          onClick={() => handleOpen(1)}
          className="text-[13.5px] font-normal tracking-[1.4px]"
          placeholder={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex flex-row">
            <div>Resumen de la compra</div>
            {open == 0 ? <KeyboardArrowDownSharpIcon /> : <KeyboardArrowUpSharpIcon />}
          </div>
        </AccordionHeader>
        <AccordionBody>
          <Cart cart={cart} />
        </AccordionBody>
      </Accordion>
    </>
  );
}
