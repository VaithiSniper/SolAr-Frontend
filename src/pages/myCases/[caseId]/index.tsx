import { Header } from "@components/layout/header"
import { useRouter } from "next/router"
import Link from "next/link"
function App() {
    const router = useRouter()
    return (<><Header />
        <div className="text-sm p-3 bg-violet-300 breadcrumbs">
            <ul>
                <li><Link href="/myCases">My Cases</Link></li>
                <li>{router.query.caseId}</li>
            </ul>
        </div>
        <div className="flex flex-col">
            <div className="flex flex-row w-full">
                <div className="flex mx-4 mt-2 flex-row text-white  justify-between w-full">
                    <div className=" text-4xl ">{router.query.caseId}</div>
                    <button className="hover:underline">Upload documents +</button>
                </div>
                <div className="mx-4 mt-2 flex flex-col justify-center align-middle "><svg style={{ color: "white" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16"> <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" fill="white"></path> </svg></div>
            </div>
            {/* body */}
            <div className="">
                <button className="flex flex-col justify-center text-white gap-y-4">
                    <svg height={150} width={150} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path fill="#ffffff" d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" /></svg>
                    {/* <i className="fas fa-folder" style={{ color: "white" }}></i> */}
                    Document 1
                </button>
            </div>
        </div>
    </>)
}
export default App