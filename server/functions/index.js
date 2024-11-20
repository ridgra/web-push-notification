const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const { createSubscriber, deleteSubscriber, getSubscribers } = require('./db');
const { publicKey, privateKey } = require('../../env');

const webpush = require('web-push');

const apiKey = {
  publicKey,
  privateKey,
};

webpush.setVapidDetails(
  'https://web-push-notif.netlify.app',
  apiKey.publicKey,
  apiKey.privateKey
);

const createSubscriberFunction = onRequest(
  { cors: '*' },
  (request, response) => {
    if (request.method === 'POST') {
      createSubscriber(request.body).then((res) => {
        console.log(res);
        response.json({ status: 'Success', message: 'Subscribed!' });
      });
    }
  }
);

const deleteSubscriberFunction = onRequest(
  { cors: '*' },
  (request, response) => {
    if (request.method === 'GET') {
      deleteSubscriber(request.query.id).then((res) => {
        console.log(res);
        response.json({ status: 'Success', message: 'Deleted!' });
      });
    }
  }
);

const sendNotificationFunction = onRequest(
  { cors: '*' },
  (request, response) => {
    if (request.method === 'GET') {
      getSubscribers().then((result) => {
        const data = Object.keys(result).map((item) => {
          return webpush.sendNotification(
            {
              endpoint: result[item].endpoint,
              expirationTime: result[item].expirationTime || null,
              keys: result[item].keys,
            },
            request.query.message
          );
        });

        Promise.all(data).catch((err) => console.log(err));
      });
      response.json({
        statue: 'Success',
        message: 'Message sent to push service',
      });
    }
  }
);

exports.create = {
  subscriber: createSubscriberFunction,
};

exports.delete = {
  subscriber: deleteSubscriberFunction,
};

exports.send = {
  notification: sendNotificationFunction,
};
