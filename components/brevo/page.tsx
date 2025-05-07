import { Suspense } from 'react';

export default function Brevo() {
  return (
    <div className="h-[630px] lg:h-[450px]">
      <Suspense>
        <iframe src="/brevo.html" width="100%" height="100%"></iframe>
      </Suspense>
    </div>
  );
}
