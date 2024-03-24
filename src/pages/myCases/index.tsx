import CaseCardComponent from "@components/case/CaseCard"
import type { CaseCard } from "@components/case/CaseCard"
import { CaseState } from "@components/case/CaseCard"

const lawsuits: CaseCard[] = [
  {
    "name": "one",
    "description": { "date": new Date(), status: CaseState.Disposed }
  },
  {
    "name": "two",
    "description": { "date": new Date(), status: CaseState.Active }
  }
]

export default function UserCasesViewPage() {

  return (
    <>
      <div>
        <div className="text-white text-4xl text-center my-4">Ongoing Cases</div>
        <div className="flex flex-row gap-x-4 justify-center">
          {
            lawsuits.map((lawsuit, index) => <CaseCardComponent index={index} lawsuit={lawsuit} />)
          }
        </div>
      </div>
    </>
  )
}
