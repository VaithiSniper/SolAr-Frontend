import { FormEvent, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { addDocumentToStorage } from "@pages/appwrite";
import { useCase } from './caseHooks'
import { useProgram } from './programHooks';
import { PublicKey } from 'ardrive-core-js';

export type PartyTypeString = "prosecutor" | "defendant" | "unauthorized"

export function useDocument() {

  const [uploadedFile, setUploadedFile] = useState<File>()
  const [party, setParty] = useState<PartyTypeString>()
  const { searchKey, currentViewingCase } = useCase()
  const { publicKey } = useProgram()


  const handleUpload = async (e: FormEvent, caseId: string, party: string) => {
    e.preventDefault()
    if (!uploadedFile) {
      toast.error("Please choose a file first!")
      return
    }
    const success = await addDocumentToStorage(uploadedFile, `${caseId}-${party}`)
    if (success) {
      toast.success('Successfully uploaded!')
    }
    else {
      toast.error('Error occurred while uploading!')
    }
    // Now send tx to change the fields
  }

  return { uploadedFile, setUploadedFile, handleUpload, party, setParty }
}
