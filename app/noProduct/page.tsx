import Image from 'next/image';
import Link from 'next/link';

export default function Noproduct() {
  return (
    <div className="grid grid-rows-1 grid-rows-1 content-center justify-items-center pb-5 pt-44 md:pb-20 md:pt-32">
      <Image alt={'Producto no encontrado'} src={'/no-product.png'} width={250} height={250} />
      <div className="pt-4">No encontramos productos</div>
      <div>
        <Link className="text-cyan-600 hover:text-cyan-200" href={'/'}>
          ¿Quire que lo llevemos a la pagina principal?
        </Link>
      </div>
    </div>
  );
}
