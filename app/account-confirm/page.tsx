import { confirmAccount } from 'lib/saleor';
import Link from 'next/link';

export default async function accountConfirm({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  if (searchParams) {
    const email = searchParams['email'] || '';
    const token = searchParams['token'] || '';
    try {
      await confirmAccount(email, token);
    } catch (e: any) {
      console.log(e);
      return;
    }
  }

  return (
    <>
      <div className="mx-10 mb-16 mt-10 flex flex-col justify-center text-center md:mx-20 md:mb-24 md:mt-16 md:tracking-wider lg:mx-32 lg:mb-40 lg:mt-20">
        <div className="bg-black p-10 text-white">
          <div className="pt-2 font-bold">¡¡ Cuenta ha sido activada con exito !!</div>
          <div className="pt-2">Ya puedes iniciar sesion con tu usuario.</div>
          <Link href={'/'}>
            <div className="pt-2 text-[#d2b6ab]">Regresa a la pagina Principal</div>
          </Link>
        </div>
      </div>
    </>
  );
}
