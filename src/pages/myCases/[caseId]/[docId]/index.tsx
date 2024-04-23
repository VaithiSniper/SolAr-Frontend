import { useRouter } from "next/router"
import FilePreviewer from 'react-file-previewer';
import BreadcrumbsNavComponent from "@components/layout/breadcrumbs-nav"
import { Crumb } from "@components/layout/breadcrumbs-nav"
import { useCase } from "src/hooks/caseHooks"
import { useEffect, useState } from "react"
import { Button } from "@components/general/button"
import { ArweaveFile, useDocument } from "src/hooks/documentHooks"
import { useArweave } from "src/hooks/arweaveHooks";

export default function DocumentViewPage() {

  const router = useRouter()

  const { searchKey, setSearchKey, currentViewingCase } = useCase()
  const { currentViewingDocument, setCurrentViewingDocument, currentViewingDocumentId, setCurrentViewingDocumentId, party } = useDocument()
  const { retrieveFileFromArweave } = useArweave()

  const [navData, setNavData] = useState<Crumb[]>([])

  useEffect(() => {
    if (router.query.docId as string && router.query.source as string) {
      setCurrentViewingDocumentId(router.query.docId as string)
      const getDocument = async () => {
        if (router.query.source === "appwrite") {
          const result = await fetch(`/api/appwrite/storage/documents?caseId=${router.query.caseId}&party=${party}&docId=${router.query.docId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
          const { data } = await result.json()
          setCurrentViewingDocument(data)
        }
        else {
          let arweaveFile: any = await retrieveFileFromArweave(router.query.docId as string);
          const data: ArweaveFile = {
            ...arweaveFile.tags,
            txnId: router.query.docId as string,
            href: arweaveFile.href
          };
          setCurrentViewingDocument(data)
        }
      }
      getDocument()
    }
  }, [router.query.docId, currentViewingDocumentId])

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
        },
        {
          name: currentViewingDocument?.name as string,
          link: router.query.docId as string
        }
      ])
    }
  }, [router.query.caseId, searchKey, currentViewingCase])

  return (
    <>
      <BreadcrumbsNavComponent data={navData} />
      <div className="flex flex-col">
        <div className="flex mx-4 mt-4 flex-row text-white  justify-between w-full">
          <div className="text-4xl">{currentViewingDocument?.name}</div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row w-3/4 m-8 p-4 justify-center items-center text-white gap-y-4 bg-[#0B0708] border-white border shadow-md shadow-fuchsia-400 rounded-xl">
            {
              router.query.source as string === "appwrite" ?
                <FilePreviewer file={{
                  url: currentViewingDocument?.href,
                  name: currentViewingDocument?.name,
                }} hideControls={true}
                />
                :
                <FilePreviewer file={{
                  data: currentViewingDocument?.href,
                  mimeType: currentViewingDocument?.mimeType,
                  name: currentViewingDocument?.name
                }} />

            }
          </div>
          <div className="flex mt-4 flex-col ml-6 gap-y-6 border border-white p-8 rounded-xl">
            <div className="text-2xl text-white">Document Timeline</div>
            <ul className="steps text-white steps-vertical">
              {
                currentViewingCase?.account.events.map(event => (
                  <li className={event.classNames} key={event.message}>{event.message}</li>
                ))
              }
            </ul>
            <Button state="initial" onClick={() => { }} className="hover:underline bg-fuchsia-400 hover:bg-fuchsia-600 text-black" >Update document</Button>
          </div>
        </div>
      </div >
    </>
  )
}
