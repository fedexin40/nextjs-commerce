import { CurrentPerson, countryAreaChoices as countryAreaChoicesType } from 'lib/types';

export default function AddressInput({
  user,
  countryAreaChoices,
}: {
  user: CurrentPerson;
  countryAreaChoices: countryAreaChoicesType;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col gap-y-2 lg:flex-row lg:gap-x-2">
        <input
          className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700 lg:w-1/2"
          type="text"
          name="firstName"
          placeholder="Nombre..."
          required={true}
          defaultValue={user.firstName}
        />
        <input
          className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700 lg:block lg:w-1/2"
          type="text"
          name="lastname"
          placeholder="Apellido..."
          required={true}
          defaultValue={user.lastName}
        />
      </div>
      <input
        className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700"
        type="text"
        name="streetAddress1"
        placeholder="Calle y numero de casa..."
        required={true}
        defaultValue={user.address.streetAddress1}
      />
      <div className="flex w-full flex-col gap-y-2 lg:flex-row lg:gap-x-2">
        <input
          className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700 lg:w-1/2"
          type="text"
          name="streetAddress2"
          placeholder="Colonia..."
          required={true}
          defaultValue={user.address.streetAddress2}
        />
        <input
          className="w-full border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700 lg:block lg:w-1/2"
          type="text"
          name="postalcode"
          placeholder="Codigo postal..."
          required={true}
          defaultValue={user.address.postalCode}
        />
      </div>
      <input
        className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700"
        type="text"
        name="city"
        placeholder="Ciudad..."
        required={true}
        defaultValue={user.address.city}
      />
      <select
        name="countryAreaChoice"
        required={true}
        defaultValue={user.address.countryArea}
        className="border-2 border-neutral-300 bg-white px-2 py-1 tracking-wider dark:border dark:border-[#c9aa9e] dark:bg-zinc-700"
      >
        {countryAreaChoices?.map(({ raw, verbose }) => (
          <option className="tracking-wider" key={raw} value={raw || ''}>
            {verbose}
          </option>
        ))}
      </select>
      <div className="border-2	border-neutral-300 bg-white px-2 py-1 tracking-wider text-neutral-500 hover:cursor-not-allowed dark:border dark:border-[#c9aa9e] dark:bg-zinc-700">
        Mexico
      </div>
      <div className="border-2	border-neutral-300 bg-white px-2 py-1 tracking-wider text-neutral-500 hover:cursor-not-allowed dark:border dark:border-[#c9aa9e] dark:bg-zinc-700">
        {user.email}
      </div>
    </div>
  );
}
