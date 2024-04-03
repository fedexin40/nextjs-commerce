import SocialNetwork from '../network-social';
import LoginModal from './modal';

export default async function Login() {
  return (
    <>
      <LoginModal>
        <SocialNetwork />
      </LoginModal>
    </>
  );
}
