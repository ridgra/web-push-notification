const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, onValue, remove } = require('firebase/database');
const { databaseURL } = require('../../env');

const firebaseConfig = {
  databaseURL,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const getSubscribers = () => {
  return new Promise((resolve) => {
    onValue(ref(db, 'subscribers/'), (snapshot) => {
      resolve(snapshot.val());
    });
  });
};

const createSubscriber = async (data) => {
  try {
    const res = await set(ref(db, 'subscribers/' + data.keys.auth), {
      ...data,
      createdDate: new Date().toISOString(),
    });

    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const deleteSubscriber = async (id) => {
  try {
    await remove(ref(db, 'subscribers/' + id));
  } catch (error) {
    console.log(error);
  }
};

module.exports = { db, createSubscriber, deleteSubscriber, getSubscribers };
