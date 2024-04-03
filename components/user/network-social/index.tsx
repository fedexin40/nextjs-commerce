import Facebook from './facebook';
import Google from './google';

export default function SocialNetwork() {
  const SALEOR_INSTANCE_URL = process.env.SALEOR_INSTANCE_URL;
  const SHOP_PUBLIC_URL = process.env.SHOP_PUBLIC_URL;
  return (
    <div>
      <Facebook
        SALEOR_INSTANCE_URL={SALEOR_INSTANCE_URL || ''}
        SHOP_PUBLIC_URL={SHOP_PUBLIC_URL || ''}
      />
      <Google
        SALEOR_INSTANCE_URL={SALEOR_INSTANCE_URL || ''}
        SHOP_PUBLIC_URL={SHOP_PUBLIC_URL || ''}
      />
    </div>
  );
}
