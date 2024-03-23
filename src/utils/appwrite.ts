import { Client, Databases, ID } from "appwrite";

const appwriteEndpoint = process.env.APPWRITE_ENDPOINT || ""
const appwriteProjectId = process.env.APPWRITE_PROJECT_ID || ""
const appwriteDatabaseId = process.env.APPWRITE_DATABASE_ID || ""

function getDatabaseInstance() {
  const client = new Client()
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId);
  return new Databases(client);
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

// Appwrite types
// unverifiedJudges document
type UnverifiedJudges = {
  address: string,
  name: string,
  email?: string,
}

export type { UnverifiedJudges }
export { addDocumentToDB, getDocumentsFromDB, deleteDocumentFromDB }
