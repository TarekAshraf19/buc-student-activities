import {
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { getCurrentEntity } from "@/services/entity.service";

export class AccountInactiveError extends Error {
  constructor() {
    super("ACCOUNT_INACTIVE");
    this.name = "AccountInactiveError";
  }
}

export async function login(
  email: string,
  password: string
): Promise<UserCredential> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  try {
    const entity = await getCurrentEntity(
      credential.user.uid
    );

    // الحساب لازم يكون مربوط بـ dashboardUsers
    // ولازم يكون Active
    if (!entity || entity.active !== true) {
      await signOut(auth);
      throw new AccountInactiveError();
    }

    return credential;
  } catch (error) {
    // نتأكد إن مفيش Session مفتوحة لو حصل أي خطأ
    if (auth.currentUser) {
      await signOut(auth);
    }

    throw error;
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}