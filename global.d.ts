declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: Function }) => void;
        };
      };
    };
  }
}
