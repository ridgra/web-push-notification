# Web Push Notification Implementation

## Description

This repository demonstrates how to implement **web push notifications** in a web application. The frontend is built using **HTML** and **JavaScript**, while the backend utilizes **Node.js** and **Firebase**. The project includes step-by-step guidance on enabling users to subscribe or unsubscribe to web push notifications and handling these operations efficiently.

### Key Features
- Frontend integration using **Service Workers (SW)**.
- Backend support using **Node.js** for sending notifications.
- Firebase setup for notification management and real-time database.
- Clear explanation of **subscription** and **unsubscription** processes.

---

## How Web Push Notifications Work

### 1. **Subscribe (Opt-In)**

#### Workflow:
1. **Permission Request**:
   - The browser asks the user for permission to send notifications when the app is loaded.
   - If the user agrees, the browser generates a **PushSubscription** object.

2. **Saving the Subscription**:
   - The subscription contains a unique endpoint and cryptographic keys.
   - This subscription is sent to the server and saved for sending notifications later.

3. **Service Worker (SW)**:
   - A Service Worker is installed in the browser to handle and display notifications on the client side.

### 2. **Unsubscribe (Opt-Out)**

To allow users to stop receiving notifications, follow these steps:

1. **Retrieve the Current Subscription**:
   - Check if the browser has an active subscription for push notifications.

2. **Remove Subscription from the Server**:
   - Send the subscription object to the backend to delete it from the database.

3. **Unsubscribe in the Browser**:
   - Use the `unsubscribe()` method to remove the subscription from the browser.
