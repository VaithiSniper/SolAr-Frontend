import { Header } from "@components/layout/header"
import Link from "next/link"


type CaseCard = {
  name: string,
  description: {
    date: Date,
    status: CaseState
  }
}

enum CaseState {
  ToStart = "Yet to start",
  WaitingForParticipants = "Waiting for participants",
  Active = "Ongoing",
  AwaitingRuling = "Awaiting ruling",
  Disposed = "Disposed",
  Completed = "Completed"
}

function App() {
  var lawsuits: CaseCard[] = [
    {
      "name": "one",
      "description": { "date": new Date(), status: CaseState.Active }
    },
    {
      "name": "two",
      "description": { "date": new Date(), status: CaseState.Active }
    }
  ]

  return (
    <>
      <div>
        <div className="text-white text-4xl text-center my-4">Ongoing Cases</div>
        <div className="flex flex-row gap-x-4 justify-center">
          {lawsuits.map((lawsuit) =>
            <div className="card w-96 mt-4 bg-white text-black">
              <div className="card-body">
                <h2 className="card-title text-2xl">{lawsuit.name}</h2>
                <p className="text-md">Next hearing: {lawsuit.description.date.toDateString()}</p>
                <p className="text-md">Status: {lawsuit.description.status}</p>

                <div className="card-actions justify-end">
                  <Link href="/myCases/case1"><button className="btn bg-gray-800 hover:bg-slate-600 text-white">Details &gt;</button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default App
