'use client';

import { Bot } from 'lucide-react';
import { useState } from 'react';
import { SaleorChat } from './chat-bot';

export function SaleorChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón flotante colapsado */}
      {!open && (
        <button
          type="button"
          aria-label="Abrir asistente de la tienda"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-slate-900 bg-slate-900 text-white shadow-lg hover:shadow-xl"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {/* Panel del chatbot */}
      {open && (
        <div className="fixed bottom-4 right-4 z-40 flex h-[520px] w-5/6 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:w-full md:max-w-md">
          <div className="flex items-center justify-between border-b bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Asistente de la tienda</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100"
            >
              Cerrar
            </button>
          </div>

          <div className="min-h-0 flex-1">
            <SaleorChat />
          </div>
        </div>
      )}
    </>
  );
}
