SSC DAILY TRACK — iPAD / iPHONE
================================
1. Download the ZIP and extract it in the iPad Files app.
2. Back up your OLD app study records before replacing the app. The new app does not automatically migrate old-format data.
3. Open your existing GitHub repository: https://github.com/logeshkannan078-spec/SSC-Aspirants-
4. Upload ALL the files INSIDE this folder to the repository ROOT (not the ZIP, and not an extra folder). Replace files with the same names. Commit changes.
5. Keep GitHub Settings > Pages > Deploy from branch > main > /(root).
6. Wait a few minutes. Open https://logeshkannan078-spec.github.io/SSC-Aspirants-/ in Safari, refresh, then Share > Add to Home Screen.
7. App works locally without Firebase. To connect Firebase, go to Settings inside the app, paste your Firebase WEB config in valid JSON and tap Connect Firebase, then Sign in with Google.
   Example JSON: {"apiKey":"...","authDomain":"...","projectId":"...","appId":"..."}
   Find real values in Firebase Console > Project Settings > Your apps > Web app > SDK setup and configuration.
   Firebase Authentication > Settings > Authorized domains: add logeshkannan078-spec.github.io.
   Firestore rules must allow signed-in users only under users/{userId}/... .
8. On first sign-in, use Sync now to upload this device's records. After that, edits automatically sync when signed in and online. The app asks before replacing newer cloud data. When switching devices, check save status before entering new data. Simultaneous edits on two devices are NOT merged.
9. Use Settings > Download JSON backup regularly. A cloud service is not guaranteed permanent storage.
10. Sunday tests are MANUAL score entry; app lists topics from the preceding Monday-Saturday. It does not generate a question paper.
11. The syllabus is a useful topic checklist, not a guarantee of exhaustive official SSC coverage; verify against current SSC notification.

NOTE: GitHub Pages publishes your code publicly, not your private local study records. Never upload backups or passwords to your public repository.


NAVY UI UPDATE (2026-11-19)
- Demo-inspired midnight navy sidebar and cards; mobile bottom navigation.
- No sample records are added. Existing localStorage key and Firebase document path are unchanged.
- Offline JSON export/import and existing Firebase Google sign-in remain available under Settings.
- Deploy all files together to GitHub Pages.
- Firebase requires your existing configuration and Google sign-in; cloud sync is not automatic until connected.
