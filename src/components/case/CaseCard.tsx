import AvatarGroup from "@components/general/avatar-group"
import { PublicKey } from "@solana/web3.js"
import Link from "next/link"
import { defaultCaseAddress, defaultCaseAddressPubkey } from "src/constants/case-constants"
import { CaseAccount, useCase } from "src/hooks/caseHooks"
import { UserProfile } from "src/hooks/userHooks"

export enum CaseState {
  ToStart = "Yet to start",
  WaitingForParticipants = "Waiting for participants",
  Active = "Ongoing",
  AwaitingRuling = "Awaiting ruling",
  Disposed = "Disposed",
  Completed = "Completed"
}

export default function CaseCardComponent({ lawsuit: { publicKey, account } }: { lawsuit: CaseAccount }) {

  const { getStatusMessageAndStylesForCaseState } = useCase()

  const caseStateParse = getStatusMessageAndStylesForCaseState(account.caseState)

  const participantsList = [account.judgeAccount].concat(account.prosecutor.memberAccounts as UserProfile[], account.defendant.memberAccounts as UserProfile[])
  const imageOrCharGroupList = participantsList.map((participant: any, index) => participant[index.toString()].username.substring(0, 1) as string)

  return (
    <div key={publicKey.toBase58()} className="card w-96 mt-4 bg-[#0B0708] border-white border shadow-md shadow-fuchsia-400">
      <div className="card-body">
        <div className="flex flex-row justify-between">
          <span className={caseStateParse?.classNames}>{caseStateParse?.message}</span>
          <span className="text-base-800 text-md flex flex-row gap-x-2 my-auto">
            <AvatarGroup imageOrCharGroup={imageOrCharGroupList} />
          </span>
        </div>
        <h2 className="card-title text-2xl text-white">{account.name}</h2>
        {/* <p className="text-md">Next hearing: {account.description.date.toDateString()}</p> */}

        <div className="card-actions justify-end">
          <Link href={"/myCases/" + publicKey.toBase58()}><button className="btn bg-gray-800 hover:bg-slate-600 text-white">Details &gt;</button>
          </Link>
        </div>
      </div>
    </div >

  )
}
