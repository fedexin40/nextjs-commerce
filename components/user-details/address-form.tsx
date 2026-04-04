'use client';

import { emailCheckoutUpdate, shippingAddressUpdate } from 'actions/shipping';
import { accountRegister } from 'actions/user';
import clsx from 'clsx';
import { Cart, CurrentPerson, countryAreaChoices as countryAreaChoicesType } from 'lib/types';
import Form from 'next/form';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import { useUserDetailsActions } from 'stores/user';

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type PlaceResultLite = {
  address_components?: AddressComponent[];
  formatted_address?: string;
};

type UserDetailsState = {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  email: string;
  phone: string;
  postalCode: string;
  countryArea: string;
  password: string;
};

export default function AddressInput({
  cart,
  user,
  countryAreaChoices,
}: {
  cart?: Cart;
  user: CurrentPerson;
  countryAreaChoices: countryAreaChoicesType;
}) {
  const { setUserDetails } = useUserDetailsActions();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  function getInitialData(): UserDetailsState {
    return {
      firstName: cart?.shippingAddress?.firstName || user.firstName || '',
      lastName: cart?.shippingAddress?.lastName || user.lastName || '',
      streetAddress1: cart?.shippingAddress?.streetAddress1 || user.address.streetAddress1 || '',
      streetAddress2: cart?.shippingAddress?.streetAddress2 || user.address.streetAddress2 || '',
      city: cart?.shippingAddress?.city || user.address.city || '',
      email: cart?.userEmail || user.email || '',
      phone: cart?.shippingAddress?.phone || user.address.phone || '',
      postalCode: cart?.shippingAddress?.postalCode || user.address.postalCode || '',
      countryArea: cart?.shippingAddress?.countryArea || user.address.countryArea || '',
      password: '',
    };
  }

  const [formData, setFormData] = useState<UserDetailsState>(getInitialData);

  function syncForm(next: UserDetailsState) {
    setFormData(next);
    setUserDetails(next);
  }

  function resetUserDetails() {
    syncForm(getInitialData());
  }

  useEffect(() => {
    setErrorMessage('');
    resetUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckbox = () => {
    setChecked((prev) => !prev);
  };

  function updateField<K extends keyof UserDetailsState>(name: K, value: UserDetailsState[K]) {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      setUserDetails(next);
      return next;
    });
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    updateField(name as keyof UserDetailsState, value);
  }

  function normalizeState(value: string) {
    if (!value) return '';

    const normalized = value.trim().toLowerCase();

    const match = countryAreaChoices?.find(({ raw, verbose }) => {
      return (
        (raw || '').trim().toLowerCase() === normalized ||
        (verbose || '').trim().toLowerCase() === normalized
      );
    });

    return match?.raw || value;
  }

  function getAddressComponent(
    components: AddressComponent[] | undefined,
    types: string[],
    mode: 'long_name' | 'short_name' = 'long_name',
  ) {
    const component = components?.find((item) => types.some((type) => item.types.includes(type)));
    return component?.[mode] || '';
  }

  function handlePlaceSelected(place: PlaceResultLite) {
    const components = place.address_components || [];

    const streetNumber = getAddressComponent(components, ['street_number']);
    const route = getAddressComponent(components, ['route']);
    const neighborhood =
      getAddressComponent(components, ['sublocality', 'sublocality_level_1']) ||
      getAddressComponent(components, ['neighborhood']);
    const postalCode = getAddressComponent(components, ['postal_code']);
    const city =
      getAddressComponent(components, ['locality']) ||
      getAddressComponent(components, ['administrative_area_level_2']);
    const stateLong = getAddressComponent(components, ['administrative_area_level_1']);
    const countryShort = getAddressComponent(components, ['country'], 'short_name');

    const streetAddress1 = [route, streetNumber].filter(Boolean).join(' ').trim();
    const countryArea = normalizeState(stateLong);

    if (countryShort && countryShort !== 'MX') {
      setErrorMessage('Selecciona una dirección dentro de México.');
      return;
    }

    setErrorMessage('');

    setFormData((prev) => {
      const next = {
        ...prev,
        streetAddress1,
        streetAddress2: neighborhood,
        city,
        postalCode,
        countryArea,
      };
      setUserDetails(next);
      return next;
    });
  }

  const { ref: streetAddressRef } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => handlePlaceSelected(place as PlaceResultLite),
    options: {
      types: ['address'],
      componentRestrictions: { country: 'mx' },
      fields: ['address_components', 'formatted_address'],
    },
    inputAutocompleteValue: 'new-password',
  });

  function setupShippingAddress() {
    startTransition(async () => {
      let error: string;

      if (!cart?.id) return;

      const input = {
        checkoutId: cart.id,
        streetAddress1: formData.streetAddress1,
        streetAddress2: formData.streetAddress2,
        city: formData.city,
        postalCode: formData.postalCode,
        countryArea: formData.countryArea,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      error = await shippingAddressUpdate(input);

      if (error) {
        resetUserDetails();
        setErrorMessage(error);
        return;
      }

      if (!cart.userEmail) {
        error = await emailCheckoutUpdate({
          checkout: cart.id,
          email: formData.email,
        });

        if (error) {
          setErrorMessage(error);
          return;
        }
      }

      if (checked) {
        error = await accountRegister({
          email: formData.email,
          password: formData.password || '',
        });

        if (error) {
          setErrorMessage(error);
          return;
        }
      }

      router.push(cart.checkoutCarrier || '');
    });
  }

  return (
    <div className="text-[15px]">
      <Form action={setupShippingAddress}>
        {!user?.id && (
          <div>
            <input
              className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
              type="email"
              name="email"
              placeholder="Correo electronico..."
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isPending}
            />

            <div className="pb-3">
              <input
                type="checkbox"
                name="createUser"
                checked={checked}
                disabled={isPending}
                onChange={handleCheckbox}
              />
              <label className="pl-3 text-sm italic">¿Quieres crear un usuario?</label>
            </div>

            <input
              className={clsx(
                'mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2',
                { hidden: !checked },
              )}
              type="password"
              name="password"
              placeholder="Contraseña..."
              required={checked}
              value={formData.password}
              onChange={handleChange}
              disabled={isPending}
            />
          </div>
        )}

        <div className="mb-3 flex w-full flex-col gap-3 lg:flex-row">
          <input
            className="w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2 lg:w-1/2"
            type="text"
            name="firstName"
            placeholder="Nombre..."
            required
            value={formData.firstName}
            onChange={handleChange}
            disabled={isPending}
          />

          <input
            className="rounded-lg border-2 border-neutral-300 bg-white px-2 py-2 lg:w-1/2"
            type="text"
            name="lastName"
            placeholder="Apellido..."
            required
            value={formData.lastName}
            onChange={handleChange}
            disabled={isPending}
          />
        </div>

        <input
          ref={streetAddressRef}
          className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
          type="text"
          name="streetAddress1"
          placeholder="Calle y numero de casa..."
          required
          value={formData.streetAddress1}
          onChange={handleChange}
          disabled={isPending}
          autoComplete="off"
        />

        <input
          className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
          type="text"
          name="streetAddress2"
          placeholder="Colonia..."
          required
          value={formData.streetAddress2}
          onChange={handleChange}
          disabled={isPending}
        />

        <input
          className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
          type="text"
          inputMode="numeric"
          name="postalCode"
          placeholder="Codigo postal..."
          required
          value={formData.postalCode}
          onChange={handleChange}
          disabled={isPending}
        />

        <input
          className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
          type="text"
          name="city"
          placeholder="Ciudad..."
          required
          value={formData.city}
          onChange={handleChange}
          disabled={isPending}
        />

        <select
          onChange={handleChange}
          name="countryArea"
          required
          value={formData.countryArea}
          className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
          disabled={isPending}
        >
          <option value="" disabled>
            Estado...
          </option>
          {countryAreaChoices?.map(({ raw, verbose }) => (
            <option key={raw} value={raw || ''}>
              {verbose}
            </option>
          ))}
        </select>

        <div className="mb-3 rounded-lg border-2 border-neutral-300 bg-white p-2 hover:cursor-not-allowed">
          Mexico
        </div>

        <input
          className="mb-3 w-full rounded-lg border-2 border-neutral-300 bg-white px-2 py-2"
          type="tel"
          name="phone"
          placeholder="Telefono..."
          required
          value={formData.phone}
          onChange={handleChange}
          disabled={isPending}
        />

        {user?.id && (
          <div className="rounded-lg border-2 border-neutral-300 bg-white p-2 hover:cursor-not-allowed">
            {user.email ? user.email : 'Correo electronico...'}
          </div>
        )}

        <div className="flex flex-row gap-3 pt-5">
          <input type="checkbox" />
          <div className="text-[10px] md:text-xs">
            Enviarme novedades y ofertas por correo electronico
          </div>
        </div>

        <div className="pt-5 text-[10px] md:text-xs">Tiempo de entrega: 2 a 7 dias habiles</div>
        <div className="pt-5 text-[10px] md:text-xs">Terminos y condiciones</div>

        <div className="w-full pt-10 md:w-1/2">
          <button className="w-full" type="submit" disabled={isPending}>
            <div
              className={clsx(
                'flex h-[60px] w-full cursor-pointer items-center justify-center whitespace-nowrap bg-black p-3 font-semibold uppercase text-white hover:opacity-50',
                { hidden: isPending },
              )}
            >
              Siguiente
            </div>

            <div
              className={clsx(
                'relative flex h-[60px] w-full cursor-not-allowed items-center justify-center space-x-6 whitespace-nowrap bg-black p-3 text-center font-semibold text-white',
                { hidden: !isPending },
              )}
            >
              <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
              <div className="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
              <div className="h-4 w-4 animate-bounce rounded-full bg-white"></div>
            </div>
          </button>
        </div>
      </Form>

      {errorMessage && <div className="payment-message pt-5">{errorMessage}</div>}
    </div>
  );
}
