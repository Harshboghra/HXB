# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Firebase setup

This app uses Firestore through `src/lib/firebase.ts`. Create a `.env.local` file in the project root with these values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

The Firestore collections expected by the app are `users`, `notes`, and `dailyTasks`.

If Firebase is not configured, the app will still load but Firestore actions will show a configuration warning.

To use the app with Firestore, deploy [firestore.rules](firestore.rules) to your Firebase project. Without rules, Firestore denies access and the app will show permission errors.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
     # Task Notes
 
     Task Notes is a mobile-first React + TypeScript app for username/password auth, notes, and dated daily tasks. It uses Firebase Firestore, Firebase Hosting, a PWA service worker, and Capacitor for Android packaging.
 
     ## Local Setup
 
     1. Install dependencies.
     2. Create a `.env.local` file in the project root.
     3. Start the app with `npm run dev`.
 
     ### Environment Variables
 
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```
 
     The app expects these Firestore collections:
 
     - `users`
     - `notes`
     - `dailyTasks`
 
     ## Firebase Configuration
 
     Deploy [firestore.rules](firestore.rules) to your Firebase project before using the app in production.
 
     Hosting and project configuration files:
 
     - [firebase.json](firebase.json)
     - [.firebaserc](.firebaserc)
     - [.github/workflows/firebase-hosting.yml](.github/workflows/firebase-hosting.yml)
 
     ## GitHub Actions Deployment
 
     Automatic deployment runs on every push to `main`.
 
     Add this repository secret in GitHub Settings > Secrets and variables > Actions:
 
     - `FIREBASE_SERVICE_ACCOUNT_TASKNOTES`
 
     That secret must contain the Firebase service account JSON for the target project.
 
     The workflow:
 
     1. Installs Node.js LTS
     2. Caches npm dependencies
     3. Runs `npm install`
     4. Runs `npm run build`
     5. Authenticates with Firebase using the service account secret
     6. Deploys Firebase Hosting
 
     ## Firebase Hosting
 
     The app is configured to deploy the Vite `dist` folder with SPA rewrites.
 
     Manual deploy:
 
     ```bash
     npm run build
     npx firebase-tools deploy --only hosting
     ```
 
     Before deploying, confirm that [.firebaserc](.firebaserc) points to the correct Firebase project id.
 
     ## PWA Support
 
     The web app is installable and uses offline caching for built assets.
 
     Included files and features:
 
     - [public/manifest.json](public/manifest.json)
     - [public/pwa-icon.svg](public/pwa-icon.svg)
     - [public/pwa-splash.svg](public/pwa-splash.svg)
     - service worker registration in [src/main.tsx](src/main.tsx)
     - install prompt UI in [src/components/InstallPrompt.tsx](src/components/InstallPrompt.tsx)
     - theme and background color metadata in [index.html](index.html)
 
     ## Android APK Build
 
     Capacitor is configured in [capacitor.config.ts](capacitor.config.ts) with the Android package id `com.yourcompany.tasknotes`.
 
     Android project files are generated in `android/`.
 
     ### Scripts
 
     - `npm run sync` builds the web app and syncs it into Android
     - `npm run android` opens the Android project in Android Studio
     - `npm run apk` builds a debug APK
 
     ### Debug APK
 
     ```bash
     npm run sync
     cd android
     gradlew.bat assembleDebug
     ```
 
     ### Release APK
 
     ```bash
     npm run sync
     cd android
     gradlew.bat assembleRelease
     ```
 
     ### Android App Bundle
 
     ```bash
     npm run sync
     cd android
     gradlew.bat bundleRelease
     ```
 
     Artifacts are written to `android/app/build/outputs/`.
 
     ### Notes
 
     - The Android shell is configured for edge-to-edge rendering.
     - The splash and icon assets are placeholders and can be replaced with production artwork later.
     - Rebuild the web assets before syncing Android so the native app receives the latest frontend changes.
 
     ## Troubleshooting
 
     - Firestore permission errors usually mean `firestore.rules` has not been deployed.
     - If the app shows a Firebase configuration warning, check the `.env.local` values.
     - If Firebase Hosting deploys fail, verify the service account secret and `.firebaserc` project id.
     - If Android sync or APK builds fail, make sure Android Studio and the Android SDK are installed.
     - If PWA install behavior is inconsistent, run a fresh `npm run build` and redeploy the hosting site.
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
