// Replace these values with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyDhNKN8TdNOfill6ao1wJY5h5ZlZLcVPOg",
  authDomain: "paymentlink-803d2.firebaseapp.com",
  projectId: "paymentlink-803d2",
  storageBucket: "paymentlink-803d2.appspot.com",
  messagingSenderId: "72502293551",
  appId: "1:72502293551:web:41557cff00e017485a82da",
  measurementId: "G-77HLHRP89L"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
