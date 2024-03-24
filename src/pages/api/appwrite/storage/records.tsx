import { deleteDocumentFromStorage, getDocumentMetadataFromDB } from '@pages/appwrite'
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
    const documents = await getDocumentMetadataFromDB(req.body.fileId)
    res.json({
      status: 200,
      message: "Received GET request",
      data: documents
    })
  }
  else if (req.method === 'DELETE') {
    // Process a DELETE request
    const success = await deleteDocumentFromStorage(req.body.fileId)
    res.json({
      status: success ? 200 : 400,
      message: "Received DELETE request",
    })
  }
  else {
    res.status(403).send("Not a valid request")
  }
}
