'use client';
import { useEffect } from 'react';

export function InternetAccreditedBadge() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'badge_view', {
        badge_type: 'internet_accredited',
        page_location: window.location.pathname,
      });
    }
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'badge_click', {
        badge_type: 'internet_accredited',
      });
    }
  };

  return (
    <a
      href="https://www.internetaccredited.com/members/profile.php?site=proyecto705.com.mx"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full"
    >
      <img
        src="https://www.internetaccredited.com/trust-seals/seal.php?opt=1&site=proyecto705.com.mx"
        alt="Internet Accredited Business"
        className="h-auto w-full"
      />
    </a>
  );
}
