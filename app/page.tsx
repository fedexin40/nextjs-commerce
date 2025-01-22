import { permanentRedirect } from 'next/navigation';

export default function EmptyPage() {
  permanentRedirect('/home');
}
