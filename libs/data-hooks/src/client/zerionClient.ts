import ZerionSDK from 'zerion-sdk-ts';

const zerion = new ZerionSDK({
  apiKey: import.meta.env.VITE_ZERION_API_KEY,
  timeout: 30000,
  retries: 0,
});

export default zerion;
