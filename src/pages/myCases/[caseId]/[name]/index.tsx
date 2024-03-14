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

            {/* body */}
            <div className="flex flex-row">
                <div><iframe src="https://drive.google.com/file/d/1DCNkUc9zfwZzANnjudToPFPIkoC0ulpE/preview" width="640" height="480" allow="autoplay"></iframe></div>
                <div className="divider-horizontal w-[6px] bg-white"></div>
                <div className="flex flex-col ">
                    <div className="text-2xl text-white">Document change history</div>
                    <ul className="steps text-white steps-vertical">
                        <li className="step step-primary">Upload version 1</li>
                        <li className="step step-primary">upload version 2</li>
                        <li className="step step-primary">change in document 1</li>
                    </ul>
                    <button className="bg-purple-400 p-2 rounded-lg"> Update document</button>
                </div>
            </div>
        </div>
    </>)
}
export default App