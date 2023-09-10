import { Product } from 'lib/types';
import Image from 'next/image';
import Link from 'next/link';

const Grid = ({ product }: { product: Product }) => {
  return (
    <Link href={`/product/${product.handle}`} className="cursor-pointer">
      <div className="flex h-full w-fit flex-col p-6">
        <div className="flex h-full flex-col justify-start">
          <Image
            src={product?.featuredImage?.url}
            alt={product.title}
            width={200}
            height={200}
            className="h-fit md:transition md:hover:scale-110"
          />
          <div className="text-sm font-light">{product.title}</div>
        </div>
        <div className="flex h-full flex-col justify-end">
          <div>$ {product.priceRange.maxVariantPrice.amount}</div>
          <div className="m-4 w-fit rounded-lg border-red-600 p-2">Añadir al carrito</div>
        </div>
      </div>
    </Link>
  );
};

export default Grid;
