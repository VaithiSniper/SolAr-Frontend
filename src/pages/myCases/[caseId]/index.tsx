import { Header } from "@components/layout/header"
import { useRouter } from "next/router"
import Link from "next/link"
import BreadcrumbsNavComponent from "@components/layout/breadcrumbs-nav"
import { Crumb } from "@components/layout/breadcrumbs-nav"

export default function CaseViewPage() {
  const router = useRouter()
  const fileCollection = [{ name: "Venture" }, { name: "Land dispute" }, { name: "Agreement 1" }, { name: "Agreement 2" }]

  const caseId = router.query.caseId

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

  return (
    <>
      <BreadcrumbsNavComponent data={navData} />
      <div className="flex flex-col">
        <div className="flex flex-row w-full">
          <div className="flex mx-4 mt-2 flex-row text-white  justify-between w-full">
            <div className=" text-4xl ">{router.query.caseId}</div>
            <button className="hover:underline">Upload documents +</button>
          </div>
          <div className="mx-4 mt-2 flex flex-col justify-center align-middle "><svg style={{ color: "white" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16"> <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" fill="white"></path> </svg></div>
        </div>
        <div className="flex flex-row">
          <div className="grid grid-cols-4 col-span-4 h-2/5 gap-12 mt-4 p-2 w-3/4">
            {fileCollection.map((file, index) =>
              <button key={file.name + index.toString()} className="p-4 rounded-2xl border border-white flex flex-col justify-center items-center text-white gap-y-4">
                <Link href={"/myCases/" + router.query.caseId + "/" + file.name}>
                  <svg height={125} width={125} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path fill="#ffffff" d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" /></svg>
                  {file.name}
                </Link>
              </button>
            )}

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
