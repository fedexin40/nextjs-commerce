import { GetOrderById } from 'lib/saleor';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Firework from './firework';

export default async function CartSuccessPage({ params }: { params: { orderId: string } }) {
  if (!params.orderId) {
    redirect('/');
  }

  const orderId = params.orderId;
  const order = await GetOrderById(orderId);
  return (
    <>
      <div className="-z-10">
        <Firework />
      </div>
      <div className="mx-10 mb-16 mt-10 flex flex-col justify-center text-center md:mx-20 md:mb-24 md:mt-16 md:tracking-wider lg:mx-32 lg:mb-40 lg:mt-20">
        <div className="bg-black p-10 text-white">
          <div className="pb-10 text-center text-base font-bold">
            !! Gracias por comprar con nosotros !!
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-center gap-x-2">
              <div>Numero de pedido:</div>
              <div className="font-semibold text-[#c9aa9e]">{order.number}</div>
            </div>
            <div className="flex flex-row justify-center gap-x-2">
              <div>Fecha:</div>
              <div className="font-semibold text-[#c9aa9e]">{order.date.split('T')[0]}</div>
            </div>
            <div className="flex flex-row justify-center gap-x-2">
              <div>Total:</div>
              <div className="font-semibold text-[#c9aa9e]">${order.amount}</div>
            </div>
            <div className="flex flex-row justify-center gap-x-2">
              <div>Tiempo de entrega:</div>
              <div className="font-semibold text-[#c9aa9e]">4 a 7 dias habiles</div>
            </div>
            <Link href={'/'}>
              <div className="pt-2 font-bold text-[#d2b6ab]">Regresa a la pagina Principal</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
