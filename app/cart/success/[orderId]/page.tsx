import { redirect } from 'next/navigation';

export default async function CartSuccessPage({ params }: { params: { orderId: string } }) {
  if (!params.orderId) {
    redirect('/');
  }

  return <></>;
}
