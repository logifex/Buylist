import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebase = initializeApp();
const auth = getAuth(firebase);

export { firebase, auth };
