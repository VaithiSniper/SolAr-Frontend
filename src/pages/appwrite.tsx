import { Client, Databases, ID, Query, Storage } from "appwrite";
import { toast } from "react-hot-toast";

const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "";
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
const appwriteDatabaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const appwriteStorageBucketId =
  process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || "";

export type FileMetadata = {
  /**
   * File ID.
   */
  $id: string;
  /**
   * Bucket ID.
   */
  bucketId: string;
  /**
   * File creation date in ISO 8601 format.
   */
  $createdAt: string;
  /**
   * File update date in ISO 8601 format.
   */
  $updatedAt: string;
  /**
   * File permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
   */
  $permissions: string[];
  /**
   * File name.
   */
  name: string;
  /**
   * Data URL.
   */
  href?: HrefURL;
  /**
   * Data URL.
   */
  source?: "appwrite" | "arweave";
  /**
   * File MD5 signature.
   */
  signature: string;
  /**
   * File mime type.
   */
  mimeType: string;
  /**
   * File original size in bytes.
   */
  sizeOriginal: number;
  /**
   * Total number of chunks available
   */
  chunksTotal: number;
  /**
   * Total number of chunks uploaded
   */
  chunksUploaded: number;
};

export interface HrefURL {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  toString(): string;
  readonly origin: string;
  password: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
  readonly searchParams: URLSearchParams;
  username: string;
  toJSON(): string;
}

function renameFile(originalFile: File, newName: string) {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
}

function getDatabaseInstance() {
  const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId);
  return new Databases(client);
}

function getStorageInstance() {
  const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId);
  return new Storage(client);
}

async function addDocumentToStorage(document: File, caseId: string) {
  const storage = getStorageInstance();
  document = renameFile(document, `${caseId}|${document.name}`);
  try {
    await storage.createFile(appwriteStorageBucketId, ID.unique(), document);
    return true;
  } catch (err: any) {
    toast.error(err.toString());
    return false;
  }
}

async function addDocumentToDB(collectionId: string, document: any) {
  const db = getDatabaseInstance();
  try {
    await db.createDocument(
      appwriteDatabaseId,
      collectionId,
      ID.unique(),
      document
    );
    return true;
  } catch (err: any) {
    console.log(err);
    toast.error(err.toString());
    return false;
  }
}


async function getDocumentFromCaseId(collectionId: string, caseId: string) {
  const db = getDatabaseInstance();
  const documents: any = await db.listDocuments(
    appwriteDatabaseId,
    collectionId,
    [Query.equal("caseId", [caseId])]
  );
  console.log('APPWIRTE DOC', documents);
  return documents.documents[0];
}



async function updateDocumentInDB(
  collectionId: string,
  documentId: string,
  document: any
) {
  const db = getDatabaseInstance();
  try {
    await db.updateDocument(appwriteDatabaseId, collectionId, documentId, document);
    return true;
  } catch (err: any) {
    toast.error(err.toString());
    return false;
  }
}

async function getDocumentMetadataFromDB(collectionId: string) {
  const db = getDatabaseInstance();
  return await db.listDocuments(appwriteDatabaseId, collectionId);
}

async function getFilesListFromStorageForCaseId(caseId: string) {
  const storage = getStorageInstance();
  return await storage.listFiles(appwriteStorageBucketId, [
    Query.startsWith("name", caseId),
  ]);
}


async function getDocumentFromStorage(fileId: string) {
  const storage = getStorageInstance();
  return await storage.getFile(appwriteStorageBucketId, fileId);
}

function getDocumentPreviewFromStorage(fileId: string) {
  const storage = getStorageInstance();
  return storage.getFileView(appwriteStorageBucketId, fileId);
}

async function deleteDocumentFromDB(collectionId: string, documentId: string) {
  const db = getDatabaseInstance();
  try {
    await db.deleteDocument(appwriteDatabaseId, collectionId, documentId);
    return true;
  } catch (err: any) {
    toast.error(err.toString());
    return false;
  }
}

async function deleteDocumentFromStorage(fileId: string) {
  const storage = getStorageInstance();
  return await storage.deleteFile(appwriteStorageBucketId, fileId);
}
// Appwrite types
// unverifiedJudges document
type UnverifiedJudges = {
  address: string;
  name: string;
  email?: string;
};

export type { UnverifiedJudges };
export {
  addDocumentToDB,
  getDocumentMetadataFromDB,
  deleteDocumentFromDB,
  updateDocumentInDB,
  addDocumentToStorage,
  getDocumentFromStorage,
  getDocumentPreviewFromStorage,
  getFilesListFromStorageForCaseId,
  deleteDocumentFromStorage,
  getDocumentFromCaseId
};
