// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase-admin/firestore";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOSWfZCoEJG1AXV0VdKF4DGCW9ruj9W98",
  authDomain: "captone1-3fba1.firebaseapp.com",
  projectId: "captone1-3fba1",
  storageBucket: "captone1-3fba1.appspot.com",
  messagingSenderId: "755114812620",
  appId: "1:755114812620:web:3fef2bfcf5ae7c6ae8ce69",
  measurementId: "G-YJZHT03DX5",
  credential : applicationDefault()
};


// const firebaseConfig = {
//   "type": "service_account",
//   "project_id": "captone1-3fba1",
//   "private_key_id": "aa5c573385fa2bdf494904246611f2c7b5b46b1f",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0V7/gdElXK3L3\n/UluS86bNsBkYXZKM3mdLE72WLcF9OiAq1eQatbLwB8LzQJH+7qDC36zk0hXMZEe\nrxtnMGglyRUwxc2QEYghuc9mt8Hw4tsuJoSsJ4WbNJd7qpCJ2ywCzIM+af4sLcuA\ngEL9l4vzC04AaXCGjiSMEH5bkBObBwtsWaa5KeNY+JKXpGvRLydqfS8JYlfGalxG\n+ztlSViTQq5liuRp4ljG9HhUfDxndc/ms2zcLXV13KwJRg2D6KSUvpHnJ6FNw0Jm\nGEHT0ygrrD/ZRFAhiXEGoglLLkeZw1aryNCFfbgm8qcIyqalPtkMNLr9PXldOaJq\ntcLKBGhhAgMBAAECggEACopoch+J29jzxs/cl2BB6quIEjXqGosorAmXcemchPIc\nFs0s+IluFYmcpu1sGTX64EbvOGK+4y3H/CGi+eSH6dF3dhrRmX6U1NfN6gSKhuBT\njD5/GarTsc8gnX9KJGyVhXJbp229h+qDTvbwM29EpEeAXyDKjWrIcxFRuVtR8gkd\nbxXnsY0ymZ+DzBfWMWozyCBEn+uqFsiJGfhMs9CuwN6sU9R9J0/B9ZTEeFSHWYiT\n/foZkyym9NV+ibZ6D5NOtOXE1YTBpIhaSuZ3FhTmQL9NMYz75U1jV4GXtCNzojM2\nYx92ZnzP+aIDr593pGQfLlsKf60JTs2gzBx4cCc6eQKBgQD8EmpUnj8SS0DatblA\nLlPrYqL9nZPddNI7rs2C5JO0Mz064+UejlyB6aBFhSz2Ife9odqOw7BXu6fBrltC\n+Kkbh5q/411gvB40DKgnhitFValv+3RaD4cksXnS1AEZ8xfcbZP7gXnrWvrLr4tp\noizAySvinpYkcoOhja5qDKaZLQKBgQC3Jy/LgiWEtcJRBVSlSXm/MzCF83TJ4r67\nAmooo6MO5twaN/o/5/Whk6o1NZAOXME8XpJBjohEsPy34hV6glW891InI7rNocj0\n3pVczE2shnGflxeb0/hMEoerEmq2YRMYPq8qoX2A6aRt3l26u4JmsNMfOwejQTIj\nGUsT3G6khQKBgDV0ikwLiwCMKOK4quJrcKx4LGxwIE1UWskBVt+tLY2HWDLG5W3H\nbuK18qELju9bYLg8PKcN5LWWPAscuInJRcNqzGxpAQJkolsTXA2VrFN1yQrQXmpC\n5LvpTxZgkyM3pBXAvyMU4BADKTBMt9nc5HS1tLLIQrrT9goqi5Q9vo65AoGBAJYU\nx2aFDEd2RXfs3VLgJaKWyNFLEU2Jv28w6FrK1IgWhw/5BNivNCml/hjB/ny2ZyYX\n/NM5f9KCEWSBH8aW3LkPFUO7VIzCYRC/ADfdtlyEgsEap57qkJGNsZxuaAFxBJue\nah2N3XDwg+wABmBI3O9XQHlb/sM5XmNCi7IHtKadAoGBAKB3kbcGYcM7XsTcCu3N\nO8G/vptwyYlllaG015rP/1TPNYvanQeuiMNrhAfrhe/EhA95fFZ9p/79io49oFe6\nTLH/uSyxVfxHdCHNCkRvyx3T9C7lxth1Jc1FBc6ZgHCaQLJSxSPMnkRwA8xbOQBV\nLAV8BjFbShStM2DXWf1exNOw\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-ho2rf@captone1-3fba1.iam.gserviceaccount.com",
//   "client_id": "110291347084313834934",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ho2rf%40captone1-3fba1.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }

// Initialize Firebase
const adminApp = initializeApp(firebaseConfig);

const db = getFirestore(adminApp);

export {adminApp,db};