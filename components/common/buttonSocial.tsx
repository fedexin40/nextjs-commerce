import Image from 'next/image';

export default function ButtonSocial({
  text,
  image,
  clickfunction
}: {
  text: string;
  image: string;
  clickfunction: () => void;
}) {
  return (
    <button
      className="rounded-md border-2 border-blue-600 p-2 ease-in-out hover:border-blue-400 hover:text-slate-400 hover:opacity-50"
      onClick={clickfunction}
    >
      <div className="grid grid-cols-5 grid-rows-1">
        <Image className="justify-self-center" src={image} alt={text} width={25} height={25} />
        <div className="col-span-4	text-left">{text}</div>
      </div>
    </button>
  );
}
