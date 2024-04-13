import { FormEvent, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { addDocumentToStorage, FileMetadata } from "@pages/appwrite";
import { useCase } from './caseHooks'
import { useProgram } from './programHooks';
import { PublicKey } from 'ardrive-core-js';
import { useArweave } from './arweaveHooks';

export type PartyTypeString = "prosecutor" | "defendant" | "unauthorized"
export type DocumentId = string;
export type base64String = string;
export type ArweaveFile = {
  name: string;
  href: base64String;
  mimeType: string;
  source: "appwrite" | "arweave"
}
export type TxnIDAccount = {
  txnId: string;
  mimeType: string;
  name: string;
}


export function useDocument() {

  const [uploadedFile, setUploadedFile] = useState<File>()
  const [arweaveFileList, setArweaveFileList] = useState<ArweaveFile[]>()
  const [party, setParty] = useState<PartyTypeString>()
  const [currentViewingDocumentId, setCurrentViewingDocumentId] = useState<DocumentId>()
  const [currentViewingDocument, setCurrentViewingDocument] = useState<FileMetadata>()
  const [hasUploadedDocument, setHasUploadedDocument] = useState<boolean>(false)

  const handleUploadToAppwrite = async (caseId: string, party: string) => {
    if (!uploadedFile) {
      toast.error("Please choose a file first!")
      return
    }
    let success: boolean = false;
    success = await addDocumentToStorage(uploadedFile, `${caseId}|${party}`)
    if (success) {
      toast.success('Successfully uploaded!')
    }
    else {
      toast.error('Error occurred while uploading!')
    }
    // Now send tx to change the fields
  }

  return { uploadedFile, setUploadedFile, handleUploadToAppwrite, party, setParty, currentViewingDocumentId, setCurrentViewingDocumentId, setHasUploadedDocument, hasUploadedDocument, currentViewingDocument, setCurrentViewingDocument, arweaveFileList, setArweaveFileList }
}
