import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = new Pusher(import.meta.env.APP_KEY, {cluster: import.meta.env.REVERB_APP_CLUSTER});

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.REVERB_APP_KEY,
  wsHost: import.meta.env.REVERB_HOST,
  wsPort: import.meta.env.REVERB_PORT ?? 80,
  wssPort: import.meta.env.REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
});
