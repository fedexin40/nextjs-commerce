import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="grid grid-cols-7 bg-black px-5 text-[8px] uppercase tracking-wider text-white md:px-10 md:text-xs">
      <div className="relative col-span-2 h-[100px] w-full md:col-span-1 lg:h-[130px] lg:w-[130px]">
        <Link href={'/'}>
          <Image
            className="object-contain"
            src={'/logoBlanco.png'}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      </div>
      <div className="col-span-5 ml-5 grid grid-cols-2 place-content-between gap-3 py-5 md:col-span-6 md:flex md:flex-row md:py-8 lg:py-10">
        <div className="flex flex-row gap-2">
          <div className="relative h-[10px] min-h-[10px] w-[10px] min-w-[10px] md:h-[15px] md:min-h-[15px] md:w-[15px] md:min-w-[15px]">
            <Image
              className="object-contain"
              src={'/devoluciones.png'}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div>10 dias para cambios & devoluciones</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="relative h-[10px] min-h-[10px] w-[10px] min-w-[10px] md:h-[15px] md:min-h-[15px] md:w-[15px] md:min-w-[15px]">
            <Image
              className="object-contain"
              src={'/compraSegura.png'}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div>Compra segura</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="relative h-[10px] min-h-[10px] w-[10px] min-w-[10px] md:h-[15px] md:min-h-[15px] md:w-[15px] md:min-w-[15px]">
            <Image
              className="object-contain"
              src={'/garantia.png'}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div>30 dias de garantia asegurada</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="relative h-[10px] min-h-[10px] w-[10px] min-w-[10px] md:h-[15px] md:min-h-[15px] md:w-[15px] md:min-w-[15px]">
            <Image
              className="object-contain"
              src={'/envio.png'}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div>Envios gratis en compras superiores a $1,500.00</div>
        </div>
      </div>
    </div>
  );
}
