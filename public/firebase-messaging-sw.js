// public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCvlDUJU3M48keb6OIexvyO6UYBDgQWbvo",
  authDomain: "ecommerceinventario-e8bf9.firebaseapp.com",
  projectId: "ecommerceinventario-e8bf9",
  storageBucket: "ecommerceinventario-e8bf9.appspot.com",
  messagingSenderId: "954208079493",
  appId: "1:954208079493:web:e04758e91789103f76e3ec"
});

const messaging = firebase.messaging();

// Opcional: manejar la notificación cuando se recibe en segundo plano
messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Mensaje recibido en segundo plano:", payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/logo192.png", // o tu ícono
  });
});
