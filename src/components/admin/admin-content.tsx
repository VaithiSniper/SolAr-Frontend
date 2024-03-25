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

export const AdminContent = () => {
  const router = useRouter();

  // Hook for setting the judge state from the API
  const [data, setData] = useState<JudgeData[]>([]);

  const { verifyUser, loading, setLoading, isAdminUser, isExisitingUser } = useUser();

  if (isExisitingUser && !isAdminUser)
    router.push("/")

  const [isUserVerified, setIsUserVerified] = useState<boolean>(false)

  useEffect(() => {
    const fetchJudges = async () => {
      const res = await fetch("/api/appwrite/database/unverifiedJudges", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const dataToSet: any = data.data.documents.map(judge => ({
        ...judge,
        docId: judge["$id"]
      }))
      setData(dataToSet);
      if (isUserVerified) {
        setIsUserVerified(false)
      }
    };

    fetchJudges();
  }, [isUserVerified]);

  return (
    <>
      {
        isAdminUser ?
          (
            <div className="flex flex-col w-full h-full text-white" >
              <div className="flex flex-row items-center justify-center w-full h-full">
                <h1 className="text-5xl font-bold text-center font-heading mt-4">Admin Dashboard</h1>
              </div>

              <div className="ml-10 mr-10">
                <h2 className="text-3xl mt-10 justify-start">Pending verifications</h2>
                <div className="card mt-10 px-10 bg-slate-400 text-primary-content">
                  <div className="card-body">
                    <div className="overflow-x-auto">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th className=" text-xl font-mono text-slate-700">
                              Address
                            </th>
                            <th className=" text-xl font-mono text-slate-700">Name</th>
                            <th className=" text-xl font-mono text-slate-700">Email</th>
                            <th className=" text-xl font-mono text-slate-700">
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
