import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router"
import BreadcrumbsNavComponent from "@components/layout/breadcrumbs-nav"
import { Crumb } from "@components/layout/breadcrumbs-nav"
import FileCardComponent from "@components/case/FileCard"
import { Button } from "@components/general/button"
import Modal from "@components/general/modal"
import { useUser } from "src/hooks/userHooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { PartyType, useCase } from "src/hooks/caseHooks";
import { ArweaveFile, useDocument } from "src/hooks/documentHooks";
import { QrReader } from 'react-qr-reader';
import { toast } from "react-hot-toast";
import { PublicKey } from "@solana/web3.js";
import { MemberView } from "@components/case/MemberView";
import { useArweave } from "src/hooks/arweaveHooks";
import { FileMetadata } from '@pages/appwrite'

export default function CaseViewPage() {
  const router = useRouter()

  const { handleUploadToArweave, setFileBufferVal, getAllRecordsFromArweave } = useArweave()
  const { searchKey, setSearchKey, currentViewingCase, addMemberToParty, prosecutorsAddressList, defendantsAddressList, loading: caseLoading } = useCase()
  const { user, setLoading } = useUser()
  const { uploadedFile, party, setParty, setUploadedFile, handleUploadToAppwrite, hasUploadedDocument, setHasUploadedDocument, arweaveFileList } = useDocument()
  const [data, setData] = useState<string>('');
  const [navData, setNavData] = useState<Crumb[]>([])
  const { publicKey } = useWallet()

  const [documents, setDocuments] = useState<any>()
  const [hasNoDocuments, setHasNoDocuments] = useState<boolean>(true)

  const [selectedProsecutorTab, setSelectedProsecutorTab] = useState<boolean>(true);
  const inactiveTabStyles = "tab text-white text-md"
  const activeTabStyles = "tab text-white text-md tab-active"

  useEffect(() => {
    if (currentViewingCase) {
      if (prosecutorsAddressList.length > 0 && prosecutorsAddressList.includes(publicKey?.toBase58() as string)) {
        setParty("prosecutor")
        return
      }
      if (defendantsAddressList.length > 0 && defendantsAddressList.includes(publicKey?.toBase58() as string)) {
        setParty("defendant")
        return
      }
      if (currentViewingCase.account.judge.toBase58() === publicKey?.toBase58()) {
        if (!party)
          setParty("prosecutor")
        return
      }
      if (defendantsAddressList.length > 0 && prosecutorsAddressList.length > 0 && currentViewingCase.account.judge.toBase58() === publicKey?.toBase58()) {
        setParty("unauthorized")
        router.push("/")
      }
    }
  }, [currentViewingCase, party])

  useEffect(() => {
    if (currentViewingCase && party) {
      const fetchRecords = async () => {
        const res = await fetch(`/api/appwrite/storage/documents?caseId=${currentViewingCase.publicKey.toBase58()}&party=${party}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        const { data } = await res.json();
        let arweaveFiles = await getAllRecordsFromArweave()
        arweaveFiles = arweaveFiles?.concat(data)
        console.log("All documents for this case -> ", arweaveFiles)
        if ( arweaveFiles.length > 0) {
          setHasNoDocuments(false)
          setDocuments(arweaveFiles);
        }
      };
      fetchRecords();
      setHasUploadedDocument(false)
    }
  }, [party, hasUploadedDocument, currentViewingCase]);

  const emptyDocumentListStyles = "h-2/5 gap-12 mt-4 p-2 w-3/4"
  const nonEmptyDocumentListStyles = "h-2/5 gap-12 mt-4 p-2 w-3/4 grid grid-cols-4 col-span-4"

  useEffect(() => {
    if (router.query.caseId as string) {
      setSearchKey(router.query.caseId as string)
    }
    if (currentViewingCase) {
      setNavData([
        {
          name: "My Cases",
          link: "/myCases"
        },
        {
          name: currentViewingCase.account.name,
          link: `/myCases/${router.query.caseId as string}`
        }
      ])
    }
  }, [router.query.caseId, searchKey, currentViewingCase])

  useEffect(() => {
    if (data && data.length === 44) {
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [data])


  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setFileBufferVal(reader.result as ArrayBuffer);
    };
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0] as File
      setUploadedFile(file);
      processFile(file)
    }
    return
  };

  const handleFileUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (user.typeOfUser.client) {
      await handleUploadToAppwrite(router.query.caseId as string, party as "prosecutor" | "defendant")
      setHasUploadedDocument(true)
    }
    else {
      await handleUploadToArweave()
      setHasUploadedDocument(true)
    }
  }

  const handleAddMemberToParty = async () => {
    if (!data || data.length !== 44) {
      toast.error("Address is invalid!")
      return
    }
    else {
      await addMemberToParty(currentViewingCase?.publicKey as PublicKey, new PublicKey(data), party as PartyType)
    }
  }

  const hasInputWalletAddress = useMemo((): boolean => (
    data && data.length === 44 ? true : false
  ), [data])

  return (
    <>
      {
        navData && navData.length > 0 ?
          <BreadcrumbsNavComponent data={navData} />
          :
          <div className="skeleton h-10 rounded-none" />
      }
      <div className="flex flex-col">
        <div className="flex flex-row w-full">
          <Modal id="AddMembersToCase">
            <form className="mx-auto space-y-8 flex flex-col justify-center text-white" onSubmit={(e) => { e.preventDefault() }}>
              <h1 className="text-center text-xl">
                Add members to case
              </h1>

              <div className="flex flex-row gap-x-4">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="name"
                    id="casename"
                    value={data}
                    onChange={(e) => { setData(e.target.value) }}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                    disabled={hasInputWalletAddress}
                  />
                  <label
                    htmlFor="casename"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >-KBLmU8hBZ-KqkhAD8ErjVseSxB1ROoxZMLkpkqveaI
                    Wallet Address
                  </label>
                </div>
              </div>
              <h1 className="font-bold text-center text-xl">
                OR
              </h1>
              <Button state={hasInputWalletAddress ? "disabled" : "initial"} onClick={() => { setData('No result') }} className="self-center hover:underline bg-green-700 hover:bg-green-8000 text-white w-1/3" >Scan QR</Button>
              {
                data === "No result" &&
                <QrReader
                  constraints={{ facingMode: 'environment' }}
                  scanDelay={3000}
                  onResult={(result, error) => {
                    if (result) {
                      toast.success("Found result -> " + result.toString())
                      setData(result.toString());
                    }
                    if (error) {
                      toast.error(error.toString());
                    }
                  }}
                />
              }
              <Button state={!hasInputWalletAddress ? "disabled" : "initial"} onClick={handleAddMemberToParty} className="self-center hover:underline bg-green-700 hover:bg-green-8000 text-white w-1/3" >Confirm</Button>
            </form>
          </Modal>
          <Modal id="FileUploadModal">
            <form className="mx-auto space-y-8 flex flex-col justify-center text-white" onSubmit={(e) => { e.preventDefault() }}>
              <h1 className="text-center text-xl">
                Upload your document
              </h1>
              <input onChange={handleChange} type="file" className="file-input file-input-bordered file-input-secondary w-full" />
              <Button state={!uploadedFile ? "disabled" : "initial"} onClick={handleFileUpload} className="self-center hover:underline bg-green-700 hover:bg-green-8000 text-white w-1/3" >Upload</Button>
            </form>
          </Modal>
          <Modal id="ViewMembersModal">
            <form className="mx-auto space-y-8 flex flex-col justify-center text-white" onSubmit={(e) => { e.preventDefault() }}>
              <h1 className="text-center text-xl">
                Members
              </h1>
              <h1 className="text-center text-xl">
                <MemberView />
              </h1>
            </form>
          </Modal>
          <div className="flex mx-4 mt-4 flex-row text-white  justify-between w-full">
            {
              currentViewingCase && currentViewingCase.account.name ?
                <div className="text-4xl">{currentViewingCase?.account.name}</div>
                :
                <div className="skeleton w-48 h-18 my-8"></div>
            }
            <Button state="initial" onClick={() => { document.getElementById("FileUploadModal").showModal(); }} className="hover:underline bg-fuchsia-400 hover:bg-fuchsia-600 text-black" >Upload documents +</Button>
          </div>
        </div>
        <div className="flex flex-row w-3/4 mx-4">
          {
            user.typeOfUser.judge && publicKey?.toBase58() === currentViewingCase?.account.judge.toBase58() ?
              <div role="tablist" className="tabs tabs-boxed bg-[#0B0708] border-white border w-1/2 mx-auto my-4 font-bold">
                <button role="tab" className={selectedProsecutorTab ? activeTabStyles : inactiveTabStyles} onClick={() => { setSelectedProsecutorTab(true); setParty("prosecutor") }}>Prosecutor</button>
                <button role="tab" className={!selectedProsecutorTab ? activeTabStyles : inactiveTabStyles} onClick={() => { setSelectedProsecutorTab(false); setParty("defendant") }}>Defendant</button>
              </div>
              :
              <div className="text-xl font-light">{party?.toUpperCase()}</div>
          }
        </div>
        <div className="flex flex-row">
          {
            caseLoading ?
              <div className="flex flex-row gap-x-4 ml-12">
                <div className="skeleton w-80 h-56"></div>
                <div className="skeleton w-80 h-56"></div>
                <div className="skeleton w-80 h-56"></div>
                <div className="skeleton w-80 h-56"></div>
              </div>
              :
              <div className={hasNoDocuments ? emptyDocumentListStyles : nonEmptyDocumentListStyles}>
                {
                  !hasNoDocuments ?
                    documents.map((file: ArweaveFile | FileMetadata) => <FileCardComponent key={file.name} caseId={router.query.caseId as string} fileName={file.name} fileId={(typeof file === 'object' && file.source === "appwrite" && '$id' in file) ? file["$id"] : file.href as string} fileHref={file.href} fileSource={file.source} fileMimeType={file.mimeType} />)
                    :
                    <div className="flex flex-row justify-center w-full">
                      <div className="flex flex-col gap-y-8 m-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 256 256">
                          <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}>
                            <g transform="scale(5.12,5.12)">
                              <path d="M25,0c-3.70312,0 -6.41797,0.97656 -8.375,2.5c-1.95703,1.52344 -3.12891,3.53516 -3.96875,5.53125c-0.83984,1.99609 -1.36719,4.01563 -1.96875,5.53125c-0.60156,1.51563 -1.23047,2.39453 -2.0625,2.6875c-5.18359,1.83594 -8.625,6.19531 -8.625,12.09375c0,0.52734 0.41016,0.96875 0.9375,1c2.66016,0.14063 4.13281,0.77734 5,1.5625c0.86719,0.78516 1.24219,1.78906 1.4375,2.96875c0.19531,1.17969 0.1875,2.46484 0.40625,3.6875c0.10938,0.60938 0.26953,1.22656 0.625,1.78125c0.35547,0.55469 0.91797,1.01563 1.625,1.25c2.10156,0.69922 3.5625,1.14844 4.5625,1.71875c0.99219,0.56641 1.62891,1.24609 2.34375,2.75c0.00391,0.00781 -0.00391,0.02344 0,0.03125c0.59375,1.25781 1.41016,2.53906 2.71875,3.46875c1.31641,0.93359 3.11328,1.46875 5.53125,1.4375c3.92969,-0.05078 5.94922,-1.87891 7.15625,-3.65625c0.60156,-0.88672 1.0625,-1.74609 1.53125,-2.375c0.46875,-0.62891 0.89063,-1.01562 1.5625,-1.21875c2.55859,-0.76953 4.0625,-2.06641 4.90625,-3.5c0.84375,-1.43359 1.04688,-2.91797 1.34375,-4.09375c0.29688,-1.17578 0.61328,-1.96875 1.5,-2.5625c0.88672,-0.59375 2.58203,-1.01172 5.75,-0.84375c0.27734,0.01563 0.54688,-0.08203 0.74609,-0.26953c0.20313,-0.19141 0.31641,-0.45312 0.31641,-0.73047c0,-2.75781 0.02734,-5.8125 -1.09375,-8.53125c-1.12109,-2.71875 -3.52344,-5.01953 -7.84375,-6c-0.3125,-0.07031 -0.57031,-0.23437 -0.875,-0.625c-0.30469,-0.39062 -0.60937,-0.97656 -0.90625,-1.71875c-0.59375,-1.48437 -1.13281,-3.52344 -2,-5.5625c-0.86719,-2.03906 -2.08203,-4.13672 -4.03125,-5.71875c-1.94922,-1.58203 -4.625,-2.59375 -8.25,-2.59375zM25,2c3.25781,0 5.41016,0.86328 7,2.15625c1.58984,1.29297 2.63672,3.05859 3.4375,4.9375c0.80078,1.87891 1.33984,3.84766 2,5.5c0.33203,0.82813 0.69141,1.58203 1.1875,2.21875c0.49609,0.63672 1.16016,1.18359 2,1.375c3.85547,0.875 5.53125,2.57813 6.4375,4.78125c0.80078,1.94141 0.89063,4.37891 0.90625,6.8125c-2.68359,-0.02734 -4.61328,0.3125 -5.875,1.15625c-1.44531,0.96484 -2.01172,2.4375 -2.34375,3.75c-0.33203,1.3125 -0.52734,2.54297 -1.125,3.5625c-0.59766,1.01953 -1.54687,1.89844 -3.75,2.5625c-1.17187,0.35156 -2.01953,1.15625 -2.625,1.96875c-0.60547,0.8125 -1.04297,1.67188 -1.5625,2.4375c-1.03906,1.53125 -2.15234,2.73828 -5.53125,2.78125c-2.11719,0.02734 -3.42187,-0.40625 -4.34375,-1.0625c-0.92187,-0.65625 -1.53516,-1.59766 -2.0625,-2.71875c-0.83594,-1.76953 -1.83984,-2.90234 -3.15625,-3.65625c-1.31641,-0.75391 -2.84375,-1.15625 -4.90625,-1.84375c-0.30859,-0.10156 -0.45312,-0.24609 -0.59375,-0.46875c-0.14062,-0.22266 -0.26172,-0.5625 -0.34375,-1.03125c-0.16797,-0.93359 -0.17187,-2.28125 -0.40625,-3.6875c-0.23437,-1.40625 -0.75781,-2.94531 -2.0625,-4.125c-1.11719,-1.01172 -2.85937,-1.59766 -5.15625,-1.875c0.29297,-4.66797 2.90234,-7.85937 7.1875,-9.375c1.69141,-0.59766 2.58203,-2.18359 3.25,-3.875c0.66797,-1.69141 1.16797,-3.64062 1.9375,-5.46875c0.76953,-1.82812 1.76172,-3.51562 3.34375,-4.75c1.58203,-1.23437 3.79297,-2.0625 7.15625,-2.0625zM19,11c-1.10547,0 -2,1.34375 -2,3c0,1.65625 0.89453,3 2,3c1.10547,0 2,-1.34375 2,-3c0,-1.65625 -0.89453,-3 -2,-3zM27,11c-1.10547,0 -2,1.34375 -2,3c0,1.65625 0.89453,3 2,3c1.10547,0 2,-1.34375 2,-3c0,-1.65625 -0.89453,-3 -2,-3z"></path>
                            </g>
                          </g>
                        </svg>
                        <h1 className="text-4xl text-white">No files present</h1>
                      </div>
                    </div>
                }
              </div>

          }
          <div className="flex mt-4 flex-col ml-6 gap-y-6 border border-white p-8 rounded-xl">
            <div className="text-2xl text-white">Case Timeline</div>
            <ul className="steps text-white steps-vertical">
              {
                currentViewingCase?.account.events.map(event => (
                  <li className={event.classNames} key={event.message}>{event.message}</li>
                ))
              }
            </ul>
            {
              user.typeOfUser.judge && <Button state="initial" onClick={() => { document.getElementById("AddMembersToCase").showModal(); }} className="hover:underline bg-fuchsia-400 hover:bg-fuchsia-600 text-black" >Add {party}</Button>
            }
            <Button state="initial" onClick={() => { document.getElementById("ViewMembersModal").showModal(); }} className="hover:underline bg-fuchsia-400 hover:bg-fuchsia-600 text-black" >View members</Button>
          </div>
        </div>
      </div>
    </>
  )
}
