import { Client, Databases, ID, Storage } from "appwrite";

const appwriteEndpoint = process.env.APPWRITE_ENDPOINT || ""
const appwriteProjectId = process.env.APPWRITE_PROJECT_ID || ""
const appwriteDatabaseId = process.env.APPWRITE_DATABASE_ID || ""
const storageBucketId = process.env.APPWRITE_STORAGE_ID || ""

function getDatabaseInstance() {
  console.log(appwriteDatabaseId, appwriteEndpoint)
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

async function addDocumentToStorage(document: any) {
  const storage = getStorageInstance()
  try {
    await storage.createFile(
      storageBucketId,
      ID.unique(),
      document
    );
    return true
  }
  catch (err) {
    console.error(err)
    return false
  }
}

async function addDocumentToDB(collectionId: string, document: any) {
  const db = getDatabaseInstance()
  try {
    await db.createDocument(appwriteDatabaseId, collectionId, ID.unique(), document)
    return true
  }
  catch (err) {
    console.error(err)
    return false
  }
}

async function getDocumentsFromDB(collectionId: string) {
  const db = getDatabaseInstance()
  return await db.listDocuments(appwriteDatabaseId, collectionId)
}

async function getDocumentsFromStorage(fileId: string) {
  const storage = getStorageInstance()
  return await storage.getFile(storageBucketId, fileId);
}

async function deleteDocumentFromDB(collectionId: string, documentId: string) {
  const db = getDatabaseInstance()
  try {
    await db.deleteDocument(appwriteDatabaseId, collectionId, documentId)
    return true
  }
  catch (err) {
    console.error(err)
    return false
  }
}

async function deleteDocumentFromStorage(fileId: string) {
  const storage = getStorageInstance()
  return await storage.deleteFile(storageBucketId, fileId)
}
// Appwrite types
// unverifiedJudges document
type UnverifiedJudges = {
  address: string,
  name: string,
  email?: string,
}

export type { UnverifiedJudges }
export { addDocumentToDB, getDocumentsFromDB, deleteDocumentFromDB, addDocumentToStorage, getDocumentsFromStorage, deleteDocumentFromStorage }
