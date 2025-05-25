import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

createInertiaApp({
  title: (title) => `${title} - libsim`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: {
    color: 'oklch(0.628 0.2502 12.28 / 70.00%)',
    showSpinner: true,
  },
});

// This will set light / dark mode on load...
initializeTheme();
