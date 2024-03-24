import Link from "next/link";
import { useRouter } from "next/router";

export default function FileCardComponent({ caseId, fileId, fileName }: { caseId: string, fileId: string, fileName: string }) {
  return (
    <button key={caseId + fileId} className="p-4 rounded-2xl border border-white flex flex-col justify-center items-center text-white gap-y-4">
      <Link href={"/myCases/" + caseId + "/" + fileId}>
        <svg height={125} width={125} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path fill="#ffffff" d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" /></svg>
        {fileName}
      </Link>
    </button>
  )
}
