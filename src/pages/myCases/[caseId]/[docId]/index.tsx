import { Header } from "@components/layout/header"
import { useRouter } from "next/router"
import Link from "next/link"
import BreadcrumbsNavComponent from "@components/layout/breadcrumbs-nav"
import { Crumb } from "@components/layout/breadcrumbs-nav"

export default function DocumentViewPage() {

  const router = useRouter()

  const caseId = router.query.caseId
  const docId = router.query.docId

  const navData: Crumb[] = [
    {
      name: "My Cases",
      link: "/myCases"
    },
    {
      name: caseId,
      link: `/myCases/${caseId}`
    },
    {
      name: docId,
      link: `/myCases/${docId}`
    }
  ]

  return (
    <>
      <BreadcrumbsNavComponent data={navData} />
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex-row w-3/4 mt-8 justify-center"><iframe src="https://drive.google.com/file/d/1DCNkUc9zfwZzANnjudToPFPIkoC0ulpE/preview" width="640" height="480" allow="autoplay"></iframe></div>
          <div className="divider-horizontal w-[4px] mt-8 bg-white"></div>
          <div className="flex flex-col ">
            <div className="text-2xl mt-8 text-white">Document change history</div>
            <ul className="steps text-white steps-vertical">
              <li className="step step-primary">Upload version 1</li>
              <li className="step step-primary">upload version 2</li>
              <li className="step step-primary">change in document 1</li>
            </ul>
            <button className="bg-purple-400 p-2 rounded-lg"> Update document</button>
          </div>
        </div>
      </div>
    </>
  )
}
