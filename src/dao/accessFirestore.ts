// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { discordToPlayerMap } from '../../env/env';

// import { getDatabase } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// interface FireBaseConfig {
//     apiKey: string;
//     authDomain: string;
//     projectId: string;
//     storageBucket: string;
//     messagingSenderId: string;
//     appId: string;
//     measurementId: string;
// }

const apiKey = process.env.FIREBASE_API_KEY;
const appId = process.env.FIREBASE_APP_ID;
const measurementId = process.env.FIREBASE_MEASUREMENT_ID;

// if (typeof apiKey !== 'string' || typeof appId !== 'string' || typeof measurementId !== 'string') {
//     throw new Error('Firebase configuration values are invalid or not provided as strings.');
// }

const PlayerDataCollection= {
    apiKey,
    authDomain: "maketeammk8dx.firebaseapp.com",
    projectId: "maketeammk8dx",
    storageBucket: "maketeammk8dx.appspot.com",
    messagingSenderId: "18755062149",
    appId,
    measurementId
};

// Initialize Firebase
const app = initializeApp(PlayerDataCollection);
const db = getFirestore(app);

const collectionPlayerData = collection(db, 'PlayerData')

// データを追加する例
export async function addPlayerData(guildId: string, discordId: string, loungeId: string) {
    const docRef = await addDoc(collectionPlayerData, {
      discordId,
      loungeId,
      guildId,
      createDate: new Date(),
      updateDate: new Date(),
    });
    console.log('Document written with ID: ', docRef.id);
}

export async function addInitialPlayerData(guildId: string) {

    for (const [key, value] of discordToPlayerMap.entries()) {
        await addDoc(collectionPlayerData, { discordId: key, loungeId: value, guildId, createDate: new Date(), updateDate: new Date() });
      }
    
}
  
  
  // データを取得する例
export async function getData() {
   const querySnapshot = await getDocs(collectionPlayerData);
   querySnapshot.forEach((doc) => {
     console.log(doc.id, ' => ', doc.data());
   });
}

export async function deleteAllData() {
    try {
      const querySnapshot = await getDocs(collectionPlayerData);
  
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
  
      console.log('コレクション内の全ドキュメントを削除しました');
    } catch (error) {
      console.error('削除中にエラーが発生しました:', error);
    }
  }
  
  
//   // データを追加
//   addData();
  
//   // データを取得
//   getData();