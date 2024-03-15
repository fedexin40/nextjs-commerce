import Image from 'next/image';

export default function Principal() {
  return (
    <>
      <Image src={'/banner.png'} alt="" fill={true} />
    </>
  );
}

export function EnvioGratis() {
  return (
    <>
      <Image src={'/envioGratis.png'} alt="" fill={true} />
    </>
  );
}

export function PrincipalMobil() {
  return (
    <>
      <Image src={'/bannerMovil.png'} alt="" fill={true} />
    </>
  );
}

export function EnvioGratisMobil() {
  return (
    <>
      <Image src={'/envioGratisMovil.png'} alt="" fill={true} />
    </>
  );
}
