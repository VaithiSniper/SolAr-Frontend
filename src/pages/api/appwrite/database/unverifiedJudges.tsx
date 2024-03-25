// @ts-ignore
import { addDocumentToDB, deleteDocumentFromDB, getDocumentMetadataFromDB } from '@pages/appwrite'
import type { UnverifiedJudges } from '@pages/appwrite'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Process a POST request
    const payload = {
      ...req.body,
      address: req.body.address.toString()
    }
    const success = await addDocumentToDB('unverified-judges', payload)
    res.json({
      status: success ? 200 : 400,
      message: "Received POST request"
    })
  }
  else if (req.method === 'GET') {
    // Process a GET request
    const documents = await getDocumentMetadataFromDB('unverified-judges')
    res.json({
      status: 200,
      message: "Received GET request",
      data: documents
    })
  }
  else if (req.method === 'DELETE') {
    // Process a DELETE request
    const success = await deleteDocumentFromDB('unverified-judges', req.body.docId)
    res.json({
      status: success ? 200 : 400,
      message: "Received DELETE request",
    })
  }
  else {
    res.status(403).send("Not a valid request")
  }
}
