# MyNotes

Expo + Firebase (Auth + Firestore) notes app. Har user ke notes alag hote hain.

## Chalane ka tareeqa
```bash
npm install
npx expo start
```

## Firestore data
`users/{userId}/notes/{noteId}` → title, content, createdAt, updatedAt

## Firestore Rules (Firebase Console → Firestore → Rules)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
