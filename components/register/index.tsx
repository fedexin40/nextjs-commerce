import SocialNetwork from 'components/network-social';
import RegisterModal from './modal';

export default async function Register() {
  return (
    <div>
      <RegisterModal>
        <SocialNetwork />
      </RegisterModal>
    </div>
  );
}
