import Facebook from './facebook';
import Google from './google';

export default function SocialNetwork() {
  const SALEOR_INSTANCE_URL = process.env.SALEOR_INSTANCE_URL;
  const SHOP_PUBLIC_URL = process.env.SHOP_PUBLIC_URL;
  const redirectURLGoogle = new URL('api/auth/callback/google', SHOP_PUBLIC_URL).toString();
  const redirectURLFacebook = new URL('api/auth/callback/facebook', SHOP_PUBLIC_URL).toString();

  return (
    <div>
      <Facebook
        SALEOR_INSTANCE_URL={SALEOR_INSTANCE_URL || ''}
        redirectURL={redirectURLFacebook || ''}
      />
      <Google
        SALEOR_INSTANCE_URL={SALEOR_INSTANCE_URL || ''}
        redirectURL={redirectURLGoogle || ''}
      />
    </div>
  );
}
