import { createInertiaApp } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import NProgress from 'nprogress';
import { createRoot } from 'react-dom/client';

import '../css/app.css';
import '../css/nprogress.css';
import { initializeTheme } from './hooks/use-appearance';

let timeout: NodeJS.Timeout;

router.on('start', () => {
  timeout = setTimeout(() => NProgress.start(), 250);
});

router.on('progress', (event) => {
  if (NProgress.isStarted() && event.detail.progress?.percentage) {
    NProgress.set((event.detail.progress.percentage / 100) * 0.9);
  }
});

router.on('finish', (event) => {
  clearTimeout(timeout);
  if (!NProgress.isStarted()) {
    return;
  } else if (event.detail.visit.completed) {
    NProgress.done();
  } else if (event.detail.visit.interrupted) {
    NProgress.set(0);
  } else if (event.detail.visit.cancelled) {
    NProgress.done();
    NProgress.remove();
  }
});

createInertiaApp({
  title: (title) => `${title} - libsim`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: false,
});

// This will set light / dark mode on load...
initializeTheme();
