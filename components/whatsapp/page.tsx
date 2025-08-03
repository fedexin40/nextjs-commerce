'use client';

import { FloatingWhatsApp } from 'react-floating-whatsapp';

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP;

export default function Whatsapp() {
  return (
    <FloatingWhatsApp
      phoneNumber={whatsapp || ''}
      accountName="Joyería Proyecto 705"
      chatMessage="Hola, ¿Como podemos ayudarte?"
      statusMessage="Prometemos respoder lo mas pronto posible"
      darkMode={true}
    />
  );
}
