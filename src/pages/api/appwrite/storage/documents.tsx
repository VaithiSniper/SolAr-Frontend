import { FileMetadata, getDocumentFromStorage, getDocumentPreviewFromStorage, getFilesListFromStorageForCaseId } from '@pages/appwrite'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' && req.query.docId) {
    const docId = req.query.docId as string
    let fileData: FileMetadata = await getDocumentFromStorage(docId)
    fileData = {
      ...fileData,
      source: "appwrite",
      name: fileData.name.split("|")[2],
      href: getDocumentPreviewFromStorage(fileData.$id as string)
    }
    res.json({
      status: 200,
      message: "Received GET request",
      data: fileData
    })
  }

  if (req.method === 'GET') {
    // Process a GET request
    const caseId = req.query.caseId as string;
    const party = req.query.party as string;
    const documentsList = await getFilesListFromStorageForCaseId(caseId)
    const truncatedDocumentList = documentsList.files.filter(file => file.name.includes(caseId) && file.name.includes(party)).map((file) => ({
      ...file,
      source: "appwrite",
      name: file.name.split("|")[2],
      href: getDocumentPreviewFromStorage(file.$id)
    }))
    res.json({
      status: 200,
      message: "Received GET request",
      data: truncatedDocumentList
    })
  }
  else {
    res.status(403).send("Not a valid request")
  }
}
