'use client';

import { RadioGroup } from '@headlessui/react';
import { shippingMethod } from 'lib/types';
import { useState } from 'react';
import { useShippingActions } from './store';

export default function ShippingMethods({
  ShippingMethods,
}: {
  ShippingMethods: shippingMethod[];
}) {
  const [selected, setSelected] = useState();
  const { setSelectedShippingId } = useShippingActions();

  function shippingIdSet(shippingId: string) {
    setSelectedShippingId(shippingId);
  }

  return (
    <div className="px-4">
      <RadioGroup
        value={selected}
        onChange={setSelected}
        aria-label="shipping method"
        className="space-y-2"
      >
        <div className="space-y-2">
          {ShippingMethods.map((ShippingMethod) => (
            <RadioGroup.Option
              key={ShippingMethod.id}
              value={ShippingMethod}
              className={({ active, checked }) =>
                `${active ? 'ring-2 ring-white/60 ring-offset-2' : ''}
                ${checked ? 'bg-gray-400/75 text-white' : 'bg-white'}
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
              }
            >
              <div
                className="flex w-full items-center justify-between"
                onClick={() => {
                  shippingIdSet(ShippingMethod.id);
                }}
              >
                <div className="text-sm/6">
                  <p className="font-semibold text-black">{ShippingMethod.name}</p>
                  <div className="flex gap-2 text-black">
                    <div>${ShippingMethod.price}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div>{ShippingMethod.serviceName}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div>Max. tiempo de entrega {ShippingMethod.maximumDeliveryDays} dias</div>
                  </div>
                </div>
              </div>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
