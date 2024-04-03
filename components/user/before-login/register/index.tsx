import SocialNetwork from '../network-social';
import RegisterModal from './modal';

export default async function Register() {
  return (
    <>
      <RegisterModal>
        <SocialNetwork />
      </RegisterModal>
    </>
  );
}
