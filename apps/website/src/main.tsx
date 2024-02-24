import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { PortfolioMdProvider } from '@portfolio.md/components';

import App from './app/app';

import './main.css';
import '@portfolio.md/components/style.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <PortfolioMdProvider>
            <App />
        </PortfolioMdProvider>
    </StrictMode>
);
