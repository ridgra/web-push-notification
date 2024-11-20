// API_URL = 'http://127.0.0.1:5001/web-push-demo-10a8f/us-central1';

import { API_URL } from '../env';

const showHTML = (innerHtml) => {
  const authElement = document.getElementById('html-text');
  authElement.innerHTML = innerHtml;
};

const checkPermission = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('service workers are not supported!');
  }

  if (!('Notification' in window)) {
    throw new Error('notification API is not supported!');
  }

  if (!('PushManager' in window)) {
    throw new Error('Push API is not supported!');
  }
};

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission not granted');
  }
};

const getPushSubscription = () => {
  return new Promise((resolve, reject) => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager
        .getSubscription()
        .then((pushSubscription) => {
          resolve(pushSubscription);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

const subscribe = async () => {
  try {
    checkPermission();
    await requestNotificationPermission();
    await navigator.serviceWorker.register('sw.js');
  } catch (error) {
    console.log(error);
  }
};

const unsubscribe = async () => {
  await navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration) {
      registration.pushManager.getSubscription().then((pushSubscription) => {
        if (pushSubscription) {
          const auth = pushSubscription.toJSON()?.keys?.auth;
          fetch(API_URL + '/delete-subscriber?id=' + auth)
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              pushSubscription.unsubscribe().then(() => {
                registration.unregister().then(() => {
                  location.reload();
                });
              });
            });
        }
      });
    }
  });
};

(function main() {
  setInterval(() => {
    getPushSubscription().then((pushSubscription) => {
      if (pushSubscription) {
        showHTML(`USER: ${JSON.stringify(pushSubscription, null, 2)}`);
      }
    });
  }, 1000);
})();
