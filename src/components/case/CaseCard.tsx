import Link from "next/link"

export enum CaseState {
  ToStart = "Yet to start",
  WaitingForParticipants = "Waiting for participants",
  Active = "Ongoing",
  AwaitingRuling = "Awaiting ruling",
  Disposed = "Disposed",
  Completed = "Completed"
}

export type CaseCard = {
  name: string,
  description: {
    date: Date,
    status: CaseState
  }
}

export default function CaseCardComponent({ lawsuit, index }: { lawsuit: CaseCard, index: number }) {

  return (
    <div key={lawsuit.name + index.toString()} className="card w-96 mt-4 bg-white text-black">
      <div className="card-body">
        <p className={lawsuit.description.status == "Ongoing" ? 'text-green-500 text-sm' : 'text-sm text-blue-500'}>{lawsuit.description.status}</p>
        <h2 className="card-title text-2xl">{lawsuit.name}</h2>
        <p className="text-md">Next hearing: {lawsuit.description.date.toDateString()}</p>

        <div className="card-actions justify-end">
          <Link href={"/myCases/" + lawsuit.name}><button className="btn bg-gray-800 hover:bg-slate-600 text-white">Details &gt;</button>
          </Link>
        </div>
      </div>
    </div>

  )
}
