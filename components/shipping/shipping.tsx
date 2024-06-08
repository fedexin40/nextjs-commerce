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
    <div className="w-full px-4">
      <RadioGroup
        value={selected}
        onChange={setSelected}
        aria-label="shipping method"
        className="space-y-2"
      >
        <div className="w-full space-y-5">
          {ShippingMethods.map((ShippingMethod) => (
            <RadioGroup.Option
              key={ShippingMethod.id}
              value={ShippingMethod}
              className={({ active, checked }) =>
                `${active ? 'ring-2 ring-white/60 ring-offset-2' : ''}
                ${checked ? 'bg-gray-250/75 text-white' : 'bg-white'}
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
              }
            >
              <div
                className="flex w-full items-center justify-between"
                onClick={() => {
                  shippingIdSet(ShippingMethod.id);
                }}
              >
                <div className="text-xs lg:text-sm">
                  <p className="pb-2 font-semibold text-black">{ShippingMethod.name}</p>
                  <div className="flex justify-center text-black">
                    <div className="">${ShippingMethod.price}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div className="whitespace-nowrap">{ShippingMethod.serviceName}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div className="whitespace-nowrap">
                      Max.{ShippingMethod.maximumDeliveryDays} dias
                    </div>
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
