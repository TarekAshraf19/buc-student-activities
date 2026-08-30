import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "@/lib/firebase";

function createFileName(
  file: File
): string {
  const extension =
    file.name.split(".").pop() || "file";

  return `${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

export async function uploadActivityImage(
  file: File,
  scopeId: string
): Promise<string> {
  const fileName =
    createFileName(file);

  const storageRef = ref(
    storage,
    `activities/${scopeId}/${fileName}`
  );

  await uploadBytes(
    storageRef,
    file
  );

  return getDownloadURL(
    storageRef
  );
}

export async function uploadCollegePlan(
  file: File,
  collegeId: string
): Promise<string> {
  const fileName =
    createFileName(file);

  const storageRef = ref(
    storage,
    `college-plans/${collegeId}/${fileName}`
  );

  await uploadBytes(
    storageRef,
    file
  );

  return getDownloadURL(
    storageRef
  );
}