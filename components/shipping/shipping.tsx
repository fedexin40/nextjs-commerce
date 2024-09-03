'use client';

import { RadioGroup } from '@headlessui/react';
import { shippingMethod } from 'lib/types';
import { useState } from 'react';
import { useShippingActions } from 'stores/shipping';

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
    <div className="w-full">
      <RadioGroup
        value={selected}
        onChange={setSelected}
        aria-label="shipping method"
        className="space-y-2"
      >
        <div className="w-full space-y-5 lg:space-y-7">
          {ShippingMethods.map((ShippingMethod) => (
            <RadioGroup.Option
              key={ShippingMethod.id}
              value={ShippingMethod}
              className={({ active, checked }) =>
                `${active ? 'ring-2 ring-black ring-offset-2 dark:ring-white ' : ''}
                ${checked ? 'ring-2 ring-black ring-offset-2 dark:ring-white' : ''}
                  relative flex cursor-pointer rounded-lg bg-zinc-100 px-5 py-4 shadow-md shadow-gray-400 focus:outline-none dark:bg-zinc-700 dark:shadow-slate-900`
              }
            >
              <div
                className="flex w-full items-center justify-between"
                onClick={() => {
                  shippingIdSet(ShippingMethod.id);
                }}
              >
                <div className="text-[13px] tracking-widest lg:text-[14.3px]">
                  <p className="pb-2 font-semibold text-black opacity-100 dark:text-white">
                    {ShippingMethod.name}
                  </p>
                  <div className="flex justify-center text-black opacity-100 dark:text-white ">
                    <div className="">${ShippingMethod.price}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div className="whitespace-nowrap capitalize">{ShippingMethod.serviceName}</div>
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
