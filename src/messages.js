// ─────────────────────────────────────────────────────────
// 📨 Messages / Photos / Videos — Firestore & Storage Logic
// Fiesta de Cumpleaños de Alison 🎸🎂
// ─────────────────────────────────────────────────────────

import { db, storage } from './firebase.js';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';

// ─── Collection Names & Upload Limits ───
const MESSAGES_COL = 'fiesta_messages';
const PHOTOS_COL = 'fiesta_photos';
const VIDEOS_COL = 'fiesta_videos';

export const MAX_PHOTO_SIZE_MB = 10; // Límite de 10 MB para fotos
export const MAX_VIDEO_SIZE_MB = 50; // Límite de 50 MB para videos

// ─── Upload File to Firebase Storage ───
// Returns a promise that resolves with the download URL
// Accepts an onProgress callback for the progress bar
export async function uploadFile(folder, docId, file, onProgress) {
  const storageRef = ref(storage, `${folder}/${docId}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ─── Submit Text Message ───
export async function submitMessage(name, message) {
  const docRef = await addDoc(collection(db, MESSAGES_COL), {
    name,
    message,
    verified: false,
    timestamp: serverTimestamp()
  });
  return docRef.id;
}

// ─── Submit Photo ───
export async function submitPhoto(name, file, onProgress) {
  if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
    throw new Error(`La foto supera el tamaño máximo permitido de ${MAX_PHOTO_SIZE_MB}MB.`);
  }

  // 1. Create Firestore document first
  const docRef = await addDoc(collection(db, PHOTOS_COL), {
    name,
    photoUrl: null,
    verified: false,
    timestamp: serverTimestamp()
  });

  // 2. Upload file to Storage
  const url = await uploadFile('photos', docRef.id, file, onProgress);

  // 3. Update document with the URL
  await updateDoc(doc(db, PHOTOS_COL, docRef.id), { photoUrl: url });

  return docRef.id;
}

// ─── Submit Video ───
export async function submitVideo(name, file, onProgress) {
  if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
    throw new Error(`El video supera el tamaño máximo permitido de ${MAX_VIDEO_SIZE_MB}MB.`);
  }

  // 1. Create Firestore document first
  const docRef = await addDoc(collection(db, VIDEOS_COL), {
    name,
    videoUrl: null,
    verified: false,
    timestamp: serverTimestamp()
  });

  // 2. Upload file to Storage
  const url = await uploadFile('videos', docRef.id, file, onProgress);

  // 3. Update document with the URL
  await updateDoc(doc(db, VIDEOS_COL, docRef.id), { videoUrl: url });

  return docRef.id;
}

// ─── Listen to Verified Messages/Photos/Videos (Real-time) ───
export function listenToVerified(collectionName, callback) {
  const q = query(
    collection(db, collectionName),
    where('verified', '==', true)
  );

  return onSnapshot(q, (snapshot) => {
    const docs = [];
    snapshot.forEach((docSnap) => {
      docs.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort by timestamp descending (newest first)
    docs.sort((a, b) => {
      const tA = a.timestamp?.seconds || 0;
      const tB = b.timestamp?.seconds || 0;
      return tB - tA;
    });
    callback(docs);
  });
}

// Export collection names for external use
export { MESSAGES_COL, PHOTOS_COL, VIDEOS_COL };
