export {};

declare global {
  interface Window {
    fbq?: (
      command: 'init' | 'track' | 'trackCustom' | 'consent' | 'set',
      eventNameOrId?: string,
      parameters?: Record<string, unknown>,
    ) => void;
    _fbq?: Window['fbq'];
  }
}
