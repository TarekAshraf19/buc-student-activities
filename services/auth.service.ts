import {
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  getCurrentEntity,
} from "@/services/entity.service";

export class AccountInactiveError extends Error {
  constructor() {
    super("ACCOUNT_INACTIVE");
    this.name =
      "AccountInactiveError";
  }
}

export async function login(
  email: string,
  password: string
): Promise<UserCredential> {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  try {
    const entity =
      await getCurrentEntity(
        credential.user.uid
      );

    if (entity?.active === false) {
      await signOut(auth);

      throw new AccountInactiveError();
    }

    return credential;
  } catch (error) {
    if (
      error instanceof
      AccountInactiveError
    ) {
      throw error;
    }

    await signOut(auth);

    throw error;
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}