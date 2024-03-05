export default function NotFound({ query }: { query: string }) {
  return (
    <div className="mx-10 mb-16 mt-10 flex flex-col justify-center text-center md:mx-20 md:mb-24 md:mt-16 lg:mx-32 lg:mb-40 lg:mt-20">
      <div className="mb-10 text-[#a8a8a8] md:mb-16">Resultados de tu busqueda: {query}</div>
      <div className="bg-black p-10 text-white">
        <div>No se encontraron productos que concuerden con esta seleccion.</div>
        <div className="pt-2 text-[#d2b6ab]">Intenta con otra busqueda</div>
      </div>
    </div>
  );
}
