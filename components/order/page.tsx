'use client';

import Price from 'components/price';
import Image from 'next/image';
import { useOrder } from 'stores/user';

export default function Order() {
  const order = useOrder();
  const date = new Date(order?.date || '').toLocaleString();
  if (!order) {
    return;
  }

  const address = `${order.shippingAddress?.city} CP. ${order.shippingAddress?.postalCode} ${order.shippingAddress?.streetAddress1} ${order.shippingAddress?.streetAddress2}`;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="flex flex-row gap-2 md:gap-5">
          <div>Número de orden:</div>
          <div>{order.number}</div>
        </div>
        <div className="ºmd:gap-5 flex flex-row gap-2">
          <div>Fecha del pedido:</div>
          <div>{date}</div>
        </div>
      </div>
      <div className="flex flex-row">
        <div>
          {order.number == 'N/A' && <div>Orden esperando por pago</div>}
          {order.number != 'N/A' && order.status == 'Unfulfilled' && <div>Preparando envío</div>}
          {order.number != 'N/A' && order.status == 'Fulfilled' && <div>Orden enviada</div>}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div>Resumen de la orden</div>
        <div className="grid grid-cols-[40%_60%] grid-rows-3 gap-3 md:grid-cols-[20%_80%]">
          <div>Subtotal:</div>
          <div>
            <Price
              className="flex space-y-2 text-left"
              amountMax={order.subtotal.toString()}
              currencyCode="MXN"
            />
          </div>
          <div>Envío:</div>
          <div>
            <Price
              className="flex space-y-2 text-left"
              amountMax={order.shippingPrice.toString()}
              currencyCode="MXN"
            />
          </div>
          <div>Impuestos:</div>
          <div>
            <Price
              className="flex space-y-2 text-left"
              amountMax={order.taxes.toString()}
              currencyCode="MXN"
            />
          </div>
          <div>Total:</div>
          <div>
            <Price
              className="flex space-y-2 text-left"
              amountMax={order.total.toString()}
              currencyCode="MXN"
            />
          </div>
        </div>
      </div>
      <div className="space-y-5 lg:space-y-7">
        {order.lines.map((line) => (
          <div
            className="flex w-fit flex-row gap-8 rounded-lg bg-zinc-100 px-5 py-4 shadow-md shadow-gray-400"
            key={line.id}
          >
            <div className="relative h-10 w-10 md:h-16 md:w-16">
              <Image
                className="object-cover"
                fill
                alt=""
                src={line.urlImage}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col justify-around">
              <div className="hidden italic md:block">Nombre del producto</div>
              <div>{line.productName}</div>
            </div>
            <div className="flex flex-col justify-around">
              <div className="italic"># de piezas</div>
              <div className="text-center">{line.quantity}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        <div>Dirección de envío</div>
        {address}
        <div></div>
        {order.shippingAddress?.phone}
        <div></div>
      </div>
      {order.shippingMethodName && (
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="hidden md:block">Paquetería:</div>
          <div className="md:hidden">Paquetería</div>
          <div>{order.shippingMethodName}</div>
        </div>
      )}
      {order.trackingNumber && (
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="hidden md:block">Número de rastreo:</div>
          <div className="md:hidden">Número de rastreo</div>
          <div>{order.trackingNumber}</div>
        </div>
      )}
    </div>
  );
}
