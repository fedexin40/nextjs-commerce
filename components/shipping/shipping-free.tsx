import { shippingMethod } from 'lib/types';
import Image from 'next/image';
import { useEffect } from 'react';
import { useShippingActions } from 'stores/shipping';

export default function ShippingFree({ ShippingMethods }: { ShippingMethods: shippingMethod[] }) {
  const { setSelectedShippingId } = useShippingActions();

  useEffect(() => {
    setSelectedShippingId(
      ShippingMethods[1]?.id || '',
      ShippingMethods[1]?.name || '',
      ShippingMethods[1]?.price || 0,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-ful flex flex-col">
      <div className="relative h-32 w-32 place-self-center lg:h-48 lg:w-48">
        <Image
          className="object-contain"
          alt=""
          src={'/gratisEnvio.png'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="text-center leading-8 tracking-wider">
        !! Muchas gracias por tu compra, en esta ocasión el costo del envío corre por nuestra cuenta
        ¡¡
      </div>
    </div>
  );
}
