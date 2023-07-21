import { confirmaccount } from 'lib/saleor';
import { redirect } from 'next/navigation';

export default async function ConfirmAccount({ searchParams }: { searchParams?: any }) {
  try {
    const result = await confirmaccount(searchParams?.email, searchParams?.token);
  } catch (e) {
    console.log(e);
  }
  return redirect('/');
}
