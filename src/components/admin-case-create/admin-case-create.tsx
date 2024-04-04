import { useRouter } from "next/router";
import { useUser } from "src/hooks/userHooks";
import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "@components/general/button";

type VerifiedJudgeOption = {
  name: string,
  address: string
}

export const AdminCaseCreate = () => {
  const router = useRouter();

  const [verifiedJugesList, setVerifiedJudgesList] = useState<VerifiedJudgeOption[]>()

  const [caseState, setCaseState] = useState<VerifiedJudgeOption>()

  const { loading, setLoading, isAdminUser, isExisitingUser } = useUser();

  if (isExisitingUser && !isAdminUser)
    router.push("/")

  useEffect(() => {
    const fetchJudges = async () => {
      const res = await fetch(`/api/appwrite/database/verifiedJudges`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const dataToSet: VerifiedJudgeOption[] = data.data.documents.map((judge: any) => ({
        address: judge["address"],
        name: judge["name"]
      }))
      setVerifiedJudgesList(dataToSet)
    }
    fetchJudges()
  }, [verifiedJugesList])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    console.log(name, value)
    setCaseState((prevValue) => (
      {
        ...prevValue,
        [name]: value
      }
    ));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(caseState)
  };


  return (
    <>
      {
        isAdminUser ?
          (
            <div className="flex flex-col w-full h-full text-white" >
              <div className="flex flex-row items-center justify-center w-full h-full">
                <h1 className="text-5xl font-bold text-center font-heading mt-4">Create Case</h1>
              </div>
              <div className="justify-center flex">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex flex-col gap-y-4">
                      <>
                        <h1 className="text-md font-sub text-center">
                          Please fill in the case details
                        </h1>
                        <form className="max-w-md mx-auto">
                          <div className="flex flex-row gap-x-4">
                            <div className="relative z-0 w-full mb-5 group">
                              <input
                                type="text"
                                name="name"
                                id="casename"
                                value={caseState?.name}
                                onChange={handleChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                              />
                              <label
                                htmlFor="casename"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Case Name
                              </label>
                            </div>
                          </div>

                          <div className="flex flex-row gap-x-4">
                            <label
                              htmlFor="presidingJudge"
                              className="peer-focus:font-medium absolute duration-300"
                            >
                              Presiding Judge
                            </label>
                            <div className="relative z-0 w-full mb-5 group">
                              <select onChange={handleChange} name="address" id="presidingJudge" className="select select-bordered w-full max-w-xs">
                                <>
                                  <option selected disabled>Choose presiding judge</option>
                                  {
                                    verifiedJugesList && verifiedJugesList.length > 0 &&
                                    verifiedJugesList.map(({ name, address }: { address: string, name: string }) =>
                                      <option key={address} value={address} title={address}>{name}</option>
                                    )
                                  }
                                </>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-row mt-4 justify-center flex-grow gap-x-10">
                            <Button
                              type="button"
                              state={loading ? "loading" : "initial"}
                              onClick={handleSubmit}
                              className="p-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
                            >
                              Submit
                            </Button>
                          </div>
                        </form>
                      </>
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
