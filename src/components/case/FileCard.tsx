import Link from "next/link";
import { FilePreviewerThumbnail } from 'react-file-previewer';
import { base64String } from "src/hooks/documentHooks";
import { HrefURL } from "@pages/appwrite"

export default function FileCardComponent({ caseId, fileId, fileName, fileHref, fileSource, fileMimeType }: { caseId: string, fileId: string, fileName: string, fileHref?: HrefURL | base64String | string, fileSource: "appwrite" | "arweave", fileMimeType: string }) {


  console.log("case id", caseId)
  return (
    <button key={caseId + fileId} className="p-4 flex flex-col justify-center items-center text-white gap-y-4 w-72 h-52 bg-[#0B0708] border-white border shadow-md shadow-fuchsia-400 rounded-xl">
      <Link href={"/myCases/" + caseId + "/" + fileId}>
        {
          fileHref ?
            (
              fileSource === "appwrite" ?
                (
                  <FilePreviewerThumbnail file={{
                    url: fileHref
                  }} />
                )
                :
                (
                  <FilePreviewerThumbnail file={{
                    data: fileHref,
                    mimeType: fileMimeType,
                    name: fileName
                  }} />
                )
            )
            :
            (
              <svg height={125} width={125} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path fill="#ffffff" d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
              </svg>
            )
        }
        <div className="font-sub font-light mt-2">{fileName}</div>
      </Link>
    </button >
  )
}
