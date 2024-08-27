import { Me, countryArea } from 'lib/saleor';
import Address from './address';

export default async function UserAddress() {
  const states = await countryArea();
  const me = await Me();
  return (
    <div className="h-full w-full">
      <Address user={me} countryAreaChoices={states} />
    </div>
  );
}
