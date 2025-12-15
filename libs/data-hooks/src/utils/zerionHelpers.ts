export function createZerionHeaders(apiKey: string) {
  if (!apiKey) {
    throw new Error('Zerion API key not configured');
  }

  // Zerion uses Basic Auth with API key as username and empty password
  // Format: Basic base64(apiKey + ':')
  const credentials = btoa(`${apiKey}:`);

  return {
    accept: 'application/json',
    authorization: `Basic ${credentials}`,
    // Zerion API requires specific user agent for some endpoints
    'user-agent': 'Web3-AI-Copilot/1.0.0',
  };
}
