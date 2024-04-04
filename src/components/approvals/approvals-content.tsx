import { useRouter } from "next/router";
import { useUser } from "src/hooks/userHooks";
import React, { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "@components/general/button";

type JudgeData = {
  docId: string;
  name: string;
  email: string;
  address: string;
};

export const AdminApprovalsContent = () => {
  const router = useRouter();

  // Hook for setting the judge state from the API
  const [data, setData] = useState<JudgeData[]>([]);

  const [selectedUnverifiedTab, setSelectedUnverifiedTab] = useState<boolean>(true);
  const inactiveTabStyles = "tab text-white text-md"
  const activeTabStyles = "tab text-white text-md tab-active"

  const { verifyUser, loading, setLoading, isAdminUser, isExisitingUser } = useUser();

  if (isExisitingUser && !isAdminUser)
    router.push("/")

  const [isUserVerified, setIsUserVerified] = useState<boolean>(false)

  useEffect(() => {
    const fetchJudges = async () => {
      const typeOfJudgesToQuery = selectedUnverifiedTab ? "unverifiedJudges" : "verifiedJudges"
      const res = await fetch(`/api/appwrite/database/${typeOfJudgesToQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const dataToSet: any = data.data.documents.map((judge: any) => ({
        ...judge,
        docId: judge["$id"]
      }))
      setData(dataToSet);
      if (isUserVerified) {
        setIsUserVerified(false)
      }
    };

    fetchJudges();
  }, [selectedUnverifiedTab, isUserVerified]);

  return (
    <>
      {
        isAdminUser ?
          (
            <div className="flex flex-col w-full h-full text-white" >
              <div className="flex flex-row items-center justify-center w-full h-full">
                <h1 className="text-5xl font-bold text-center font-heading mt-4">Approvals</h1>
              </div>
              <div role="tablist" className="tabs tabs-boxed bg-[#0B0708] border-white border w-1/2 mx-auto my-4 font-bold">
                <button role="tab" className={selectedUnverifiedTab ? activeTabStyles : inactiveTabStyles} onClick={() => { setSelectedUnverifiedTab(true) }}>Pending</button>
                <button role="tab" className={!selectedUnverifiedTab ? activeTabStyles : inactiveTabStyles} onClick={() => { setSelectedUnverifiedTab(false) }}>Completed</button>
              </div>
              <div className="ml-10 mr-10">
                <div className="card mt-10 px-10 bg-[#0B0708] border-white border shadow-lg shadow-fuchsia-400 text-white">
                  <div className="card-body">
                    <div className="overflow-x-auto">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr className="text-xl font-mono text-white">
                            <th>
                              Address
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>
                              Verify
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data &&
                            data.length > 0 &&
                            data.map((judge, index) => (
                              <tr key={index}>
                                <td>{judge.address}</td>
                                <td>{judge.name}</td>
                                <td>{judge.email}</td>
                                <td hidden={true}>{judge.docId}</td>
                                <td>
                                  <Button
                                    state={loading ? "loading" : "initial"}
                                    className="btn btn-primary"
                                    onClick={async () => {
                                      const publicKey = new PublicKey(
                                        `${judge.address}`
                                      );
                                      setLoading(true)
                                      await verifyUser(judge.docId, publicKey);
                                      setIsUserVerified(true)
                                    }}
                                  >
                                    Verify
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div >
          )
          :
          <div className="text-2xl text-white mt-4 align-middle">You are not authorized to access this!</div>
      }
    </>
  );
};
