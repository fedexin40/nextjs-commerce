const gaId = process.env.googleAnalytics;

export default function GoogleAnalyticsPartytown() {
  if (!gaId) return null;

  const partytownSnippet = `
    !(function(w,p,f,c){
      if(!window.crossOriginIsolated && !navigator.serviceWorker){
        c = document.createElement('script');
        c.src = p + '/partytown.js';
        c.async = true;
        document.head.appendChild(c);
      }
    })(window, '/~partytown');
  `;

  return (
    <>
      {/* 1) Configuración global de Partytown: debe ir antes del snippet */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            partytown = {
              lib: '/~partytown/',
              forward: ['dataLayer.push', 'gtag']
            };
          `,
        }}
      />

      {/* 2) Snippet de Partytown en main thread */}
      <script dangerouslySetInnerHTML={{ __html: partytownSnippet }} />

      {/* 3) Carga de Google tag dentro del worker */}
      <script type="text/partytown" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />

      {/* 4) Inicialización de GA4 dentro del worker */}
      <script
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){ dataLayer.push(arguments); };

            gtag('js', new Date());
            gtag('config', '${gaId}', {
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
