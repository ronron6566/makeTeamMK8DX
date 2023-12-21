// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { discordToPlayerMap } from '../../env/env';

const apiKey = process.env.FIREBASE_API_KEY;
const appId = process.env.FIREBASE_APP_ID;
const measurementId = process.env.FIREBASE_MEASUREMENT_ID;

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
