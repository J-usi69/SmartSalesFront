// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { AppConfig } from "./config/app-config";
import { toast } from "react-hot-toast"
// import React from "react"
const firebaseConfig = {
    apiKey: "AIzaSyCvlDUJU3M48keb6OIexvyO6UYBDgQWbvo",
    authDomain: "ecommerceinventario-e8bf9.firebaseapp.com",
    projectId: "ecommerceinventario-e8bf9",
    storageBucket: "ecommerceinventario-e8bf9.firebasestorage.app",
    messagingSenderId: "954208079493",
    appId: "1:954208079493:web:e04758e91789103f76e3ec"
  };
  
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

//   VAPID
const vapidKey = "BCJJUUtEnzhV7o090GH92QQ8zxhGxBJYFPlZnwnzoYqj_2dhWjowkDC0fvrFLgOZwNhPPwq1q2ef8PqG4VMgf-8";

//  Pedir permisos y obtener token del navegador
export const requestFirebaseToken = async () => {
  try {
    const token = await getToken(messaging, { vapidKey });
    if (token) {
        console.log("Token obtenido:", token);
      
        //  Enviar al backend
        fetch(`${AppConfig.API_URL}/users/save-fcm-token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"), // ✅ si usás JWT
          },
          body: JSON.stringify({ token }),
        })
          .then((res) => res.json())
          .then((data) => console.log(" Token guardado:", data))
          .catch((err) => console.error(" Error al guardar token:", err));
      }
  } catch (error) {
    console.error(" Error al obtener token FCM:", error);
  }
};
// 🔔 Escuchar mensajes push en primer plano
export const listenToPushNotifications = () => {
    onMessage(messaging, (payload) => {
      console.log("🔔 Notificación recibida:", payload)
      const { title, body } = payload.notification || {}
  
      toast.custom(() => (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 max-w-xs text-left">
          <p className="font-bold text-black">{title}</p>
          <p className="text-sm text-gray-700">{body}</p>
        </div>
      ))
    })
  }
//  Escuchar mensajes entrantes cuando la app está en primer plano
// export const listenToPushNotifications = () => {
//   onMessage(messaging, (payload) => {
//     console.log(" Notificación recibida:", payload);
//     const { title, body } = payload.notification || {};
//     alert(`${title}\n\n${body}`); // Podés usar toast o una modal mejor
//   });
// };
