# 📝 JournalingApp

A clean and thoughtful journaling app built with React Native and Expo. Users can write, view, and filter daily journal entries, mark memorable ones, and view them on a dedicated screen.

## 📷 Demo Screenshots

<p align="center">
  <img src="./screenshots/home.jpg" width="180" style="margin-right: 20px;" />
  <img src="./screenshots/writeEntry.jpg" width="180" style="margin-right: 20px;" />
  <img src="./screenshots/typeInput.jpg" width="180" style="margin-right: 20px;"/>
  <img src="./screenshots/entries.jpg" width="180" style="margin-right: 20px;" />
  <img src="./screenshots/memorable.jpg" width="180" />
</p>



---

## ⚙️ Technologies Used

- [React Native](https://reactnative.dev/)
- [Expo SDK](https://docs.expo.dev/)
- [expo-router](https://expo.github.io/router/docs)
- [NativeWind (Tailwind CSS for React Native)](https://www.nativewind.dev/)
- [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- [react-native-calendars](https://github.com/wix/react-native-calendars)
- [date-fns](https://date-fns.org/)

---

## 🎨 Brief Design Rationale

The app focuses on simplicity and clarity, using soft colors and a minimalistic layout to encourage reflective writing.
The tab-based navigation ensures a user-friendly experience, while entry sorting, filtering, and tagging features enhance usability.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- **Node.js** installed
- **Expo CLI** installed (`npm install -g expo-cli`)
- **Expo Go** app on your mobile device (for preview)

All dependencies (`expo-router`, `nativewind`, `async-storage`, `react-native-calendars`, etc.) are listed in the `package.json`.

---

### How to Run the App Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/P01Sensai/JournalingApp.git
   cd JournalingApp

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install

3. **Start the Expo development server:**
   ```bash
   npx expo start

4. **Run on your device or simulator:**

   📱 Use the Expo Go app on your Android/iOS device and scan the QR code.

   💻 Or run on an emulator/simulator from the Expo CLI menu.  


---


## ✅ Usability Heuristics Focus

The app incorporates Jakob Nielsen’s 10 Usability Heuristics:

1. **Visibility of System Status:**  
   Feedback is given for saving, loading, and deleting entries.

2. **Match Between System and the Real World:**  
   Uses familiar concepts like a calendar and timestamps to reflect real-world journaling.

3. **User Control and Freedom:**  
   Users can delete entries and navigate back to the home screen freely.

4. **Consistency and Standards:**  
   Icons, layout, and interactions follow common mobile app conventions.

5. **Error Prevention:**  
   The app restricts empty entries and confirms key actions, reducing potential errors.

6. **Recognition Rather Than Recall:**  
   Journal entries are clearly labeled with unique IDs and timestamps.

7. **Flexibility and Efficiency of Use:**  
   Users can mark memorable entries as favorites and access them quickly.

8. **Aesthetic and Minimalist Design:**  
   The interface uses a clean, light design with clear spacing for readability and focus.

9. **Help Users Recognize, Diagnose, and Recover from Errors:**  
   Simple error messages are logged to the console to assist in debugging.

10. **Help and Documentation:**  
   This README provides clear onboarding instructions and guidance.
