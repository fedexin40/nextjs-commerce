'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import FirstShoppingImage from './image';

const STORAGE_KEY = 'firstTime';
const COOKIE_DAYS = 90;
const OPEN_DELAY_MS = 5000;

type FullScreenModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export function FullScreenModal({ open, onClose, children, title }: FullScreenModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 bg-black" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        {/* Contenedor principal */}
        <div className="fixed inset-0 z-50">
          <div className="flex h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-500"
              enterFrom="translate-y-8 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="transform transition ease-in duration-300"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-8 opacity-0"
            >
              <Dialog.Panel className="relative inline-block w-auto max-w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {title ?? ''}
                  </Dialog.Title>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar modal"
                    className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                  >
                    ✕
                  </button>
                </div>

                <div className="">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null;
  }

  return null;
}

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === 'undefined') return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

function hasSeenModal(): boolean {
  if (typeof window === 'undefined') return true;

  const cookieValue = getCookie(STORAGE_KEY);
  const localValue = window.localStorage.getItem(STORAGE_KEY);

  return cookieValue === 'true' || localValue === 'true';
}

function markModalAsSeen() {
  if (typeof window === 'undefined') return;

  setCookie(STORAGE_KEY, 'true', COOKIE_DAYS);
  window.localStorage.setItem(STORAGE_KEY, 'true');
}

export default function AutoOpenModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasSeenModal()) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      markModalAsSeen(); // se guarda justo al abrir
    }, OPEN_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <FullScreenModal open={open} onClose={() => setOpen(false)}>
        <div>
          <FirstShoppingImage />
        </div>
      </FullScreenModal>
    </>
  );
}
