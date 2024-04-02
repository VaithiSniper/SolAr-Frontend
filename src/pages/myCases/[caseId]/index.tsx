import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router"
import BreadcrumbsNavComponent from "@components/layout/breadcrumbs-nav"
import { Crumb } from "@components/layout/breadcrumbs-nav"
import FileCardComponent from "@components/case/FileCard"
import { Button } from "@components/general/button"
import Modal from "@components/general/modal"
import { useUser } from "src/hooks/userHooks";
import { addDocumentToStorage } from "@pages/appwrite";
import toast from 'react-hot-toast'
import { useWallet } from "@solana/wallet-adapter-react";

export default function CaseViewPage() {
  const router = useRouter()
  const fileCollection = [{ name: "Venture" }, { name: "Land dispute" }, { name: "Agreement 1" }, { name: "Agreement 2" }]

  const { publicKey } = useWallet()

  const caseId = router.query.caseId as string

  const navData: Crumb[] = [
    {
      name: "My Cases",
      link: "/myCases"
    },
    {
      name: caseId,
      link: `/myCases/${caseId}`
    }
  ]

  const [hasUploadedImage, setHasUploadedImage] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<File>()

  const { setLoading } = useUser()

  const [documents, setDocuments] = useState<any>()

  useEffect(() => {
    const fetchCases = async () => {
      const res = await fetch(`/api/appwrite/storage/documents?caseId=${"6gHNdTY6JhB5x5SnArg6XkoTNH7one7aUByWyYWM2AJj"}`, // TODO: Replace with caseId when available
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      const data = await res.json();
      setDocuments(data.data);
    };

    fetchCases();
  }, [hasUploadedImage, documents]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0] as File
      setUploadedFile(file);
    }
    return
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!uploadedFile) {
      return
    }
    setLoading(true)
    setHasUploadedImage(true)
    const success = await addDocumentToStorage(uploadedFile, "6gHNdTY6JhB5x5SnArg6XkoTNH7one7aUByWyYWM2AJj")  // TODO: Replace with caseId when available
    if (success) {
      toast.success('Successfully uploaded!')
    }
    else {
      toast.error('Error occurred while uploading!')
    }
    setLoading(false)
    // Now send tx to change the fields
  }

  return (
    <>
      <BreadcrumbsNavComponent data={navData} />
      <div className="flex flex-col">
        <div className="flex flex-row w-full">
          <Modal id="FileUploadModal">
            <form className="mx-auto space-y-8 flex flex-col justify-center" onSubmit={(e) => { e.preventDefault() }}>
              <h1 className="text-center text-xl">
                Upload your document
              </h1>
              <input onChange={handleChange} type="file" className="file-input file-input-bordered file-input-secondary w-full" />
              <Button state={hasUploadedImage ? "loading" : "initial"} onClick={handleUpload} className="self-center hover:underline bg-green-700 hover:bg-green-8000 text-white w-1/3" >Upload</Button>
            </form>
          </Modal>
          <div className="flex mx-4 mt-2 flex-row text-white  justify-between w-full">
            <div className=" text-4xl ">{router.query.caseId}</div>
            <Button state="initial" onClick={() => { setHasUploadedImage(false); document.getElementById("FileUploadModal").showModal(); }} className="hover:underline bg-fuchsia-400 hover:bg-fuchsia-600 text-white" >Upload documents +</Button>
          </div>
          <Button state="initial" onClick={handleUpload} className="mx-4 mt-2 flex flex-col justify-center align-middle bg-fuchsia-400 hover:bg-fuchsia-600 text-white"><svg style={{ color: "white" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16"> <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" fill="white"></path> </svg></Button>
        </div>
        <div className="flex flex-row">
          <div className="grid grid-cols-4 col-span-4 h-2/5 gap-12 mt-4 p-2 w-3/4">
            {
              documents && documents.length > 0 ?
                documents.map((file) => <FileCardComponent caseId={router.query.caseId as string} fileName={file.name} fileId={file.name} />)
                :
                <h1 className="text-banner font-heading text-white">No files present</h1>
            }
          </div>
          <div className="divider-horizontal mt-4 w-[4px] bg-white"></div>
          <div className="flex mt-4 h-screen flex-col ">
            <div className="text-2xl text-white">Case change history</div>
            <ul className="steps text-white steps-vertical">
              <li className="step step-primary">s1</li>
              <li className="step step-primary">upload 2</li>
              <li className="step step-primary">change in document 1</li>
              <li className="step">Removal of agreement 3</li>
            </ul>
            <button className="bg-purple-400 p-2 rounded-lg"> Members</button>
          </div>
        </div>
      </div>
    </>
  )
}
