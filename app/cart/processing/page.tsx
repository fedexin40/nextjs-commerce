import Link from 'next/link';

export default function CartProcessing() {
  return (
    <>
      <div className="mx-10 mb-16 mt-10 flex flex-col justify-center text-center md:mx-20 md:mb-24 md:mt-16 md:tracking-wider lg:mx-32 lg:mb-40 lg:mt-20">
        <div className="bg-black p-10 text-white">
          <div className="pb-10 text-center text-base font-bold">
            !! Gracias por comprar con nosotros !!
          </div>
          <div className="flex flex-col gap-4">
            Tu orden esta siendo procesada. Te enviaremos un correo cuando este lista
            <Link href={'/'}>
              <div className="pt-2 font-bold text-[#d2b6ab]">Regresa a la pagina Principal</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
