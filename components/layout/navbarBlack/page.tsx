import MarqueeText from 'components/text-scroll/page';
import Image from 'next/image';

function Header() {
  return (
    <div className="flex flex-row justify-around gap-x-10 bg-black px-5 py-4 text-[13.5px] tracking-widest text-white md:text-[13px] lg:py-6 lg:text-[14.3px]">
      <div className="flex flex-row gap-2">
        <div className="relative top-[5px] h-[10px] min-h-[10px] w-[10px] min-w-[10px] md:top-0 md:h-[15px] md:min-h-[15px] md:w-[15px] md:min-w-[15px]">
          <Image
            className="object-contain"
            src={'/devoluciones.png'}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="relative md:-top-[2px]">30 días para cambios & devoluciones</div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="relative top-[5px] h-[10px] min-h-[10px] w-[10px] min-w-[10px] md:top-0 md:h-[15px] md:min-h-[15px] md:w-[15px] md:min-w-[15px]">
          <Image
            className="object-contain"
            src={'/compraSegura.png'}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="relative md:-top-[2px]">Compra segura</div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="relative top-[5px] h-[10px] min-h-[10px] w-[10px] min-w-[10px] md:top-0 md:h-[15px] md:min-h-[15px] md:w-[15px] md:min-w-[15px]">
          <Image
            className="object-contain"
            src={'/garantia.png'}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="relative md:-top-[2px]">30 días de garantía asegurada</div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="relative top-[5px] h-[10px] min-h-[10px] w-[10px] min-w-[10px] md:top-0 md:h-[15px] md:min-h-[15px] md:w-[15px] md:min-w-[15px]">
          <Image
            className="object-contain"
            src={'/envio.png'}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="relative md:-top-[2px]">
          Envíos gratis en compras superiores a $1,000.00
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="content-center md:hidden">
        <MarqueeText>
          <Header />
        </MarqueeText>
        /
      </div>
    </>
  );
}
