'use client';
import Image from 'next/image';
import { externalAuthenticationFacebook, externalAuthenticationGoogle } from './actions';

export default function SocialNetwork() {
  return (
    <div>
      <div className="mb-3 flex h-10 flex-row gap-5 border-2 border-[#1877F2] bg-[#1877F2] px-5 py-2 text-sm hover:cursor-pointer hover:opacity-60 hover:ease-in">
        <div className="relative h-5 w-5">
          <Image className="object-cover" src={'/facebookLogin.png'} alt="" fill />
        </div>
        <div
          className="content-center whitespace-nowrap text-white"
          onClick={async () => {
            await externalAuthenticationFacebook();
          }}
        >
          Inciar sesion con Facebook
        </div>
      </div>
      <div className="flex h-10 flex-row gap-5 border-2 border-[#a8a8a8] px-5 py-2 text-sm hover:cursor-pointer hover:opacity-60 hover:ease-in">
        <div className="relative h-5 w-5">
          <Image className="object-cover" src={'/googleLogin.png'} alt="" fill />
        </div>
        <div
          className="content-center whitespace-nowrap text-[#a8a8a8]"
          onClick={async () => {
            await externalAuthenticationGoogle();
          }}
        >
          Inciar sesion con Google
        </div>
      </div>
    </div>
  );
}
