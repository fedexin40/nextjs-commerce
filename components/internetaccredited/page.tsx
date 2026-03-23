import Image from 'next/image';
import Link from 'next/link';

export function InternetAccreditedBadge() {
  return (
    <>
      <Link
        href="https://www.internetaccredited.com/members/profile.php?site=proyecto705.com.mx"
        className="block w-full"
      >
        <Image
          src="https://www.internetaccredited.com/trust-seals/seal.php?opt=1&site=proyecto705.com.mx"
          alt="Internet Accredited Business"
          className="h-auto w-full"
        />
      </Link>
    </>
  );
}
