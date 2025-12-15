import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ReactQueryProvider,
  defaultQueryClient,
} from '@web3-ai-copilot/data-hooks';
import App from './App';

// Styles
import './assets/styles/index.css';
import '@e-burgos/tucutable/styles';
import '@e-burgos/tucu-ui/styles';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <ReactQueryProvider queryClient={defaultQueryClient}>
      <App />
    </ReactQueryProvider>
  </StrictMode>
);
