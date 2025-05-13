import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  disableStats: true,
  encrypted: false,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}` 
    }
  }
});

export default echo;