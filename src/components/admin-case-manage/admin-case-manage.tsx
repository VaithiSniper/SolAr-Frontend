import { useRouter } from "next/router";
import { useUser } from "src/hooks/userHooks";
import React from "react";
import { Button } from "@components/general/button";
import { useCase } from "src/hooks/caseHooks";

export const AdminCaseManage = () => {
  const router = useRouter();

  const { loading, isAdminUser, isExisitingUser } = useUser();
  const { cases, isNotInAnyCase } = useCase()
  console.log(cases)

  if (isExisitingUser && !isAdminUser)
    router.push("/")

  return (
    <>
      {
        isAdminUser ?
          (
            <div className="flex flex-col w-full h-full text-white" >
              <div className="flex flex-row items-center justify-center w-full h-full">
                <h1 className="text-5xl font-bold text-center font-heading mt-4">Manage Cases</h1>
              </div>
              <div className="ml-10 mr-10">
                <div className="card mt-10 px-10 bg-[#0B0708] border-white border shadow-lg shadow-fuchsia-400 text-white">
                  <div className="card-body">
                    <div className="overflow-x-auto">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr className="text-xl font-mono text-white">
                            <th>Address</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Judge Address</th>
                            <th>Winner</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            !isNotInAnyCase &&
                            cases.map(({ publicKey, account }) => (
                              <tr key={publicKey.toBase58()}>
                                <td>{publicKey.toBase58().substring(0, 6) + "..."}</td>
                                <td>{account.id.toBase58().substring(0, 6) + "..."}</td>
                                <td>{account.name}</td>
                                <td>{account.judge.toBase58().substring(0, 6) + "..."}</td>
                                <td>{account.caseWinner ? (account.caseWinner.defendant ? "Defendant" : "Prosecutor") : "Undecided"}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )
          :
          <div className="text-2xl text-white mt-4 align-middle">You are not authorized to access this!</div>
      }
    </>
  );
};
