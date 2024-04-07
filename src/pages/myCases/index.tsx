import CaseCardComponent from "@components/case/CaseCard"
import { CaseState } from "@components/case/CaseCard"
import { CaseAccount, useCase } from "src/hooks/caseHooks"
import { useUser } from "src/hooks/userHooks"

export default function UserCasesViewPage() {

  const { user } = useUser()
  const { cases, isNotInAnyCase } = useCase()

  return (
    <>
      <div>
        <div className="text-white text-6xl text-center my-4 font-heading">Ongoing Cases <span className="text-yellow-500">({user.totalParticipatingCases})</span></div>
        <div className="flex flex-row gap-x-16 justify-start mx-8">
          {
            isNotInAnyCase && cases.length === 0 ?
              <div className="text-white text-4xl text-center my-4">No cases found</div>
              :
              cases.map((lawsuit) => <CaseCardComponent lawsuit={lawsuit} />)
          }
        </div>
      </div>
    </>
  )
}
