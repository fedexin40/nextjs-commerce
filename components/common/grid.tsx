import Link from 'next/link';
import Image from 'next/image';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';

const Grid = ({ product }) => {
  return (
    <Link
      href={`/product/${product.handle}`}
      className="flex cursor-pointer    flex-col gap-3 rounded-xl  bg-black/[.06] px-4 py-2 "
    >
      <div className="xs:flex-wrap xs:justify-center flex justify-between gap-3 sm:flex-nowrap sm:justify-between">
        <div>
          <h1 className="xs:text-base text-xl font-bold sm:text-xl">{product.title}</h1>
        </div>
        <div className="flex min-w-fit flex-col items-start">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="xs:text-base text-lg font-bold sm:text-lg">
              $ {product.priceRange.maxVariantPrice.amount}
            </h1>
            <button className="ms-2 rounded-md bg-gradient-to-r from-pink-500 to-yellow-500	p-0.5 hover:from-green-400 hover:to-blue-500">
              {product.inCart ? (
                <AiOutlineCheck className="text-sm font-bold text-white" />
              ) : (
                <AiOutlinePlus className="text-sm font-bold text-white" />
              )}
            </button>
          </div>
          <p className="text-end text-sm text-gray-600">
            {product.category ? product.category : 'testing'}
          </p>
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center">
        <Image
          src={product?.featuredImage?.url}
          alt={product.title}
          width={300}
          height={300}
          className="xs:w-28 xs:h-16 h-20 w-32 object-cover py-2 transition hover:scale-110 sm:h-20 sm:w-32"
        />
      </div>
    </Link>
  );
};

export default Grid;
