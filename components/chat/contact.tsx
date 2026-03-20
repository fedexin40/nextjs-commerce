'use client';

import { Bot, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { SiMessenger, SiWhatsapp } from 'react-icons/si';
import { SaleorChat } from './chat-bot';

export default function ContactFloating() {
  const [open, setOpen] = useState(false);
  const [openChatBot, setOpenChatBot] = useState(false);

  function startChatBot() {
    setOpenChatBot(true);
    setOpen(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Botones secundarios */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        {/* WhatsApp */}
        <a
          href="https://api.whatsapp.com/send?phone=522224224586"
          target="_blank"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110"
        >
          <SiWhatsapp size={22} />
        </a>

        {/* Messenger */}
        <a
          href="https://m.me/61571068417335"
          target="_blank"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition hover:scale-110"
        >
          <SiMessenger size={22} />
        </a>

        {/* Chatbot */}
        <button
          type="button"
          aria-label="Abrir asistente de la tienda"
          onClick={() => startChatBot()}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg transition hover:scale-110"
        >
          <Bot />
        </button>
      </div>

      {/* Botón principal */}
      <button
        aria-label="Open Chat"
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition hover:scale-110"
      >
        <MessageCircle />
      </button>
      {openChatBot && (
        <div className="fixed bottom-1 right-4 z-40 flex h-[520px] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6 sm:w-[420px]">
          <div className="flex items-center justify-between border-b bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                <Bot className="h w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Asistente de la tienda</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpenChatBot(false)}
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
    </div>
  );
}
