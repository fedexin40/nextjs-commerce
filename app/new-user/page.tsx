import Link from 'next/link';

export default function newUser() {
  return (
    <>
      <div className="mx-10 mb-16 mt-10 flex flex-col justify-center text-center md:mx-20 md:mb-24 md:mt-16 md:tracking-wider lg:mx-32 lg:mb-40 lg:mt-20">
        <div className="bg-black p-10 text-white">
          <div className="pt-2 font-bold">¡¡ Usuario creado con exito !!</div>
          <div className="pt-2">
            Te hemos mandado un correo a tu bandeja, por favor revisalo y sigue las indicaciones
            para activar tu cuenta.
          </div>
          <Link href={'/'}>
            <div className="pt-2 text-[#d2b6ab]">Regresa a la pagina Principal</div>
          </Link>
        </div>
      </div>
    </>
  );
}
