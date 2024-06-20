import { ReactNode, useState } from 'react';

export default function MobileMenu({
  UserDetails,
  UserShoppings,
}: {
  UserDetails: ReactNode;
  UserShoppings: ReactNode;
}) {
  const [tab, setTab] = useState(false);

  function displayProfile() {
    setTab(false);
  }

  function displayHistory() {
    setTab(true);
  }

  return (
    <div className="flex h-full flex-col text-sm tracking-wider">
      <div className="flex basis-[5%] flex-row text-[#8b725d]">
        <div
          className=" bg-[#dbc7b7] px-5 pr-10 pt-2 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)]"
          onClick={() => displayProfile()}
        >
          Mi Perfil
        </div>
        <div
          className="rounded-tl-md rounded-tr-3xl bg-white px-5 pr-10 pt-2 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)]"
          onClick={() => displayHistory()}
        >
          Historial
        </div>
      </div>
      {tab ? (
        <div className="h-full overflow-y-auto bg-white">{UserShoppings}</div>
      ) : (
        <div className="h-full overflow-y-auto bg-[#dbc7b7] pt-10">{UserDetails}</div>
      )}
    </div>
  );
}
