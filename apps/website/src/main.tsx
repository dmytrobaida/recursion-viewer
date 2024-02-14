import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@portfolio.md/components';

import App from './app/app';

import './main.css';
import '@portfolio.md/components/style.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <ThemeProvider
            options={{
                themeChangeCallback(theme) {
                    if (theme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                },
                defaultThemeProvider: () => {
                    if (typeof window === 'undefined') {
                        return 'light';
                    }

                    const usesDark = window.matchMedia(
                        '(prefers-color-scheme: dark)'
                    ).matches;

                    if (usesDark) {
                        return 'dark';
                    }

                    return 'light';
                },
                storage:
                    typeof window !== 'undefined'
                        ? window.localStorage
                        : undefined,
            }}
        >
            <App />
        </ThemeProvider>
    </StrictMode>
);
