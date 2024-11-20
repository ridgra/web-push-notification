// const API_URL = 'http://localhost:5001/web-push-demo-10a8f/us-central1';
const API_URL = 'https://us-central1-web-push-demo-10a8f.cloudfunctions.net';
const PUSH_PUBLIC_KEY = 'BGqPBzC1N2t_6J4TNPdHkHVWzF9a8JAvkdiBdU6pKjwtSbcfQYQlEHSgbLh95eeDU1x2ggVBC0xmA_e4kTqa-uk'

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const saveSubscription = async (subscription) => {
  const response = await fetch(API_URL + '/create-subscriber', {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(subscription, null, 2),
  });

  return response.json();
};

self.addEventListener('activate', async (e) => {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUSH_PUBLIC_KEY),
  });

  const response = await saveSubscription(subscription);
  console.log(response);
});

self.addEventListener('push', (e) => {
  self.registration.showNotification('Notification', { body: e.data.text() });
});
