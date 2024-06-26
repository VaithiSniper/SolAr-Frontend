import { useMemo } from "react";
import GraphNetwork, { Graph } from "./GraphNetwork";
import { CustomNode, CustomLink } from "./GraphNetwork";

export interface Member {
  username: string;
  role: string;
  group?: string;
}

export function MemberView() {

  const members: Member[] = [
    {
      username: "Judge1",
      role: "Judge",
    },
    {
      username: "Lawyer1",
      role: "Lawyer",
      group: "Defendant",
    },
    {
      username: "Client1",
      role: "Client",
      group: "Prosecutor",
    },
  ];

  const sortedParticipantList: Member[] = useMemo(() => {
    const judge = members.filter(member => member.role === "Judge")
    const prosecutors = members.filter(member => member.group === "Prosecutor")
    const defendants = members.filter(member => member.group === "Defendant")
    return judge.concat(prosecutors, defendants)
  }, [members])

  // TODO: Replace with actual member list

  return (
    <GraphNetwork height={400} width={460} members={sortedParticipantList} />
    // <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
    //   {
    //     sortedParticipantList.map(member => (
    //       <li className="pb-3 sm:pb-4" key={member.username}>
    //         <div className="flex items-center space-x-4 rtl:space-x-reverse">
    //           <div className="flex-shrink-0">
    //             <Avatar imageOrChar={member.username.substring(0, 1)} mini={true} />
    //           </div>
    //           <div className="flex-1 min-w-0">
    //             <p className="text-lg font-medium text-gray-900 truncate dark:text-white">
    //               {member.username}
    //             </p>
    //             <p className="text-sm text-gray-500 truncate dark:text-gray-400">
    //               {member.role}
    //             </p>
    //           </div>
    //           <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">

    //             {!(member.role === "Judge") && member.group}
    //           </div>
    //         </div>
    //       </li>

    //     ))
    //   }
    // </ul>
  )
}
