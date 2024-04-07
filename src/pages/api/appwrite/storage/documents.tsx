import { getFilesListFromStorageForCaseId } from '@pages/appwrite'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Process a GET request
    const caseId = req.query.caseId as string;
    const party = req.query.party as string;
    const documentsList = await getFilesListFromStorageForCaseId(caseId)
    const truncatedDocumentList = documentsList.files.filter(file => file.name.includes(caseId) && file.name.includes(party)).map((file) => ({
      ...file,
      name: file.name.split("|")[1]
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
