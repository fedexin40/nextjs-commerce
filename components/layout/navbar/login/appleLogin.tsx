import ButtonSocial from 'components/common/buttonSocial';
import { useRouter } from 'next/navigation';

export default function AppleLogin() {
  const route = useRouter();

  async function AppleLoginOnClick() {
    //const serverUrl = process.env.SALEOR_FRONTEND_URL
    const serverUrl = 'https://8b20-201-162-217-218.ngrok-free.app/';
    const callback = serverUrl + 'api/login/external/callback';
    const response = await fetch('/api/login/external', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        callback: callback
      })
    });
    const data = await response.json();
    const url = data.url;
    route.push(url);
  }

  return (
    <ButtonSocial
      text={'Continuar con Apple'}
      image={'/apple-avatar.png'}
      clickfunction={AppleLoginOnClick}
    />
  );
}
