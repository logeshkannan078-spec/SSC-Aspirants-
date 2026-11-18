SSC DAILY TRACK 2.0 — FULL APPLICATION

Upload the CONTENTS of this ZIP to the ROOT of your existing GitHub Pages repository. Replace index.html, app.js, sw.js, manifest and icons. Do not upload the ZIP itself.

This is an editable app: daily logs, syllabus, revisions, mock scores, Sunday tests, mistakes, history, backups, Google login and Firestore cloud saving. The Smart Plan tab adds recommendations, predictions, readiness and analytics.

IMPORTANT: Export and retain a JSON backup before deployment. Firebase config is read from the existing browser local storage when available, or paste it in Settings and Connect Firebase. Existing project and user document path users/{uid}/app/main are retained. Firebase rules must protect users/{uid}.

Cloud saving is paused when cloud and local timestamps differ, rather than overwriting another version. Keep your JSON backup. Cloud conflicts require manual review and are NOT auto-merged. Google sign-in and Firestore security rules require testing on the deployed site. No production cloud integration has been tested in this environment.

Mock predictions require at least 5 full-length 200-mark mock results. Readiness is withheld when data is insufficient. No AI service or paid API is required.
