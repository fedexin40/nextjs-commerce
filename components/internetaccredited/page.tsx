import Image from 'next/image';
import Link from 'next/link';

export function InternetAccreditedBadge() {
  return (
    <div className="relative aspect-[3/1] w-full">
      <Link
        href="https://www.internetaccredited.com/members/profile.php?site=proyecto705.com.mx"
        className="block h-full w-full"
      >
        <Image
          src="https://www.internetaccredited.com/trust-seals/seal.php?opt=1&site=proyecto705.com.mx"
          alt="Internet Accredited Business"
          fill={true}
          className="object-contain object-left"
        />
      </Link>
    </div>
  );
}
