import { Client, Databases, ID, Query, Storage } from "appwrite";
import { toast } from "react-hot-toast";

const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ""
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ""
const appwriteDatabaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ""
const appwriteStorageBucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || ""

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
  const storage = getStorageInstance()
  document = renameFile(document, `${caseId}|${document.name}`)
  try {
    await storage.createFile(
      appwriteStorageBucketId,
      ID.unique(),
      document
    );
    return true
  }
  catch (err: any) {
    toast.error(err.toString())
    return false
  }
}

async function addDocumentToDB(collectionId: string, document: any) {
  const db = getDatabaseInstance()
  try {
    await db.createDocument(appwriteDatabaseId, collectionId, ID.unique(), document)
    return true
  }
  catch (err: any) {
    toast.error(err.toString())
    return false
  }
}

async function getDocumentMetadataFromDB(collectionId: string) {
  const db = getDatabaseInstance()
  return await db.listDocuments(appwriteDatabaseId, collectionId)
}

async function getFilesListFromStorageForCaseId(caseId: string) {
  const storage = getStorageInstance()
  return await storage.listFiles(appwriteStorageBucketId, [Query.startsWith("name", caseId)])
}

async function getDocumentsFromStorage(fileId: string) {
  const storage = getStorageInstance()
  return await storage.getFile(appwriteStorageBucketId, fileId);
}

function getDocumentPreviewFromStorage(fileId: string) {
  const storage = getStorageInstance()
  return storage.getFileView(appwriteStorageBucketId, fileId)
}

async function deleteDocumentFromDB(collectionId: string, documentId: string) {
  const db = getDatabaseInstance()
  try {
    await db.deleteDocument(appwriteDatabaseId, collectionId, documentId)
    return true
  }
  catch (err: any) {
    toast.error(err.toString())
    return false
  }
}

async function deleteDocumentFromStorage(fileId: string) {
  const storage = getStorageInstance()
  return await storage.deleteFile(appwriteStorageBucketId, fileId)
}
// Appwrite types
// unverifiedJudges document
type UnverifiedJudges = {
  address: string,
  name: string,
  email?: string,
}

export type { UnverifiedJudges }
export { addDocumentToDB, getDocumentMetadataFromDB, deleteDocumentFromDB, addDocumentToStorage, getDocumentsFromStorage, getDocumentPreviewFromStorage, getFilesListFromStorageForCaseId, deleteDocumentFromStorage }
