import { addDocumentToDB, getDocumentFromCaseId, deleteDocumentFromDB, getDocumentMetadataFromDB, updateDocumentInDB } from '@pages/appwrite'
import type { NextApiRequest, NextApiResponse } from 'next'


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },

  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == 'POST')
    {
        const { caseId } = JSON.parse(req.body)
        const payload = {
            caseId: caseId,
            txnId: [],
            message: []
        }
        const success = await addDocumentToDB('6627e15ce6e84a6d9cc6', payload)
        console.log('success is', success)
        res.json({
            status: success ? 200 : 400,
            message: `Received POST request. Case Created`
        })
    }
    else if (req.method == 'PATCH') {
        const { caseId, txnId, message } = JSON.parse(req.body)
        console.log('caseId is', caseId)
        console.log('txnId is', txnId)
        console.log('message is', message)
        const document = await getDocumentFromCaseId('6627e15ce6e84a6d9cc6', caseId)
        const docId = document.$id
        const payload = {
            caseId: caseId,
            txnId: [...document["txnId"], txnId],
            message: [...document["message"], message]
        }
        const success = await updateDocumentInDB('6627e15ce6e84a6d9cc6', docId, payload)
        const new_document = await getDocumentFromCaseId('6627e15ce6e84a6d9cc6', caseId)
        console.log('new_document is', new_document)
        res.json({
            status: success ? 200 : 400,
            message: `Received PATCH request. Case Updated`
        })
    }
    else if (req.method == 'GET') {
        const { caseId } = req.query
        const new_document = await getDocumentFromCaseId('6627e15ce6e84a6d9cc6', caseId as string)
        console.log('new_document is', new_document)
        res.json({
            status: new_document ? 200 : 400,
            new_document,
        })
    }   
    else {
        res.status(403).send("Not a valid request")
    }
}

