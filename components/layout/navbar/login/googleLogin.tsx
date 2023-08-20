import ButtonSocial from 'components/common/buttonSocial';
import { useRouter } from 'next/navigation';

export default function GoogleLogin() {
  const route = useRouter();

  async function GoogleLoginOnClick() {
    //const serverUrl = process.env.SALEOR_FRONTEND_URL
    const serverUrl = 'https://a93a-189-164-165-240.ngrok-free.app/';
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
      text={'Continuar con Google'}
      image={'/google-avatar.png'}
      clickfunction={GoogleLoginOnClick}
    />
  );
}
