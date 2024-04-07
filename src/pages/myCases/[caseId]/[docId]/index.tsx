import { Header } from "@components/layout/header"
import { useRouter } from "next/router"
import Link from "next/link"
import BreadcrumbsNavComponent from "@components/layout/breadcrumbs-nav"
import { Crumb } from "@components/layout/breadcrumbs-nav"
import { useCase } from "src/hooks/caseHooks"
import { useEffect, useState } from "react"
import { Button } from "@components/general/button"
import { getDocumentPreviewFromStorage, getDocumentsFromStorage } from "@pages/appwrite"

export default function DocumentViewPage() {

  const router = useRouter()

  const { searchKey, setSearchKey, currentViewingCase } = useCase()
  const [navData, setNavData] = useState<Crumb[]>([])

  const fileView = getDocumentPreviewFromStorage("6612e848a02ae6746d72")
  const fileViewUrl = fileView.href

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
          name: router.query.docId as string,
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
          <div className="text-4xl">{router.query.docId as string}</div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row w-3/4 mt-8 justify-center">
            <iframe src={fileViewUrl} width="960" height="640" allow="autoplay"></iframe>
          </div>
          <div className="divider-horizontal w-[4px] mt-8 bg-white"></div>
          <div className="flex mt-4 h-screen flex-col ml-6 gap-y-6">
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
