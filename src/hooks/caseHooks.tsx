import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState } from 'react'
import solarIDL from '../constants/idl.json'
import toast from 'react-hot-toast'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Solar } from 'src/constants/solar'
import { ADMIN_WALLET_PUBKEY } from 'src/constants/admin'
import { useUser } from './userHooks'

export type CaseState = anchor.IdlTypes<Solar>["CaseState"]
export type PartyType = anchor.IdlTypes<Solar>["Winner"]
export type Winner = anchor.IdlTypes<Solar>["Winner"]
export type Party = {
  type_of_party: PartyType,
  members: [PublicKey?],
  size: number,
}
export type Case = {
  id: PublicKey,
  name: string,
  judge: PublicKey,
  prosecutor: Party,
  defendant: Party,
  caseWinner: null | Winner,
  caseState: CaseState
}
export type CaseAccount = {
  publicKey: PublicKey,
  account: Case
}

export const initialDefaultCase: CaseAccount = {
  publicKey: new PublicKey(ADMIN_WALLET_PUBKEY),
  account: {
    id: new PublicKey(ADMIN_WALLET_PUBKEY),
    name: "Sample Case",
    judge: new PublicKey(ADMIN_WALLET_PUBKEY),
    prosecutor: {
      type_of_party: "Prosecutor" as PartyType,
      members: [],
      size: 0
    },
    defendant: {
      type_of_party: "Defendant" as PartyType,
      members: [],
      size: 0
    },
    caseWinner: "Defendant" as PartyType,
    caseState: "ToStart" as CaseState,
  }
}

export function useCase() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const anchorWallet = useAnchorWallet()

  const [loading, setLoading] = useState(false)
  const [cases, setCases] = useState<CaseAccount[]>([])
  const [currentViewingCase, setCurrentViewingCase] = useState<CaseAccount>()
  const [isNotInAnyCase, setIsNotInAnyCase] = useState<boolean>(false)
  const [searchKey, setSearchKey] = useState<string>()

  const { isAdminUser, isExisitingUser, user } = useUser()

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
      const programId = new PublicKey(solarIDL.metadata.address)
      const programIdl = JSON.parse(JSON.stringify(solarIDL)) // to circumvent typescript issue
      return new anchor.Program(programIdl, programId, provider)
    }
  }, [connection, anchorWallet])

  useEffect(() => {
    const getAllCasesForUser = async () => {
      if (program && publicKey) {
        try {
          setLoading(true)
          if (isAdminUser) {
            const caseAccounts: any = await program.account.case.all()
            setIsNotInAnyCase(false)
            setCases(caseAccounts)
            console.log("after setting cases", searchKey)
            if (searchKey) {
              setCurrentViewingCase(getCurrentViewingCaseBySearchKey(caseAccounts, searchKey))
            }
          }
          else {
            if (isExisitingUser && user) {
              if (user.listOfCases.length > 0) {
                let caseAccounts: any = await program.account.case.fetchMultiple(user.listOfCases)
                caseAccounts = caseAccounts.map((currentCase: any, index: number) => ({
                  account: { ...currentCase },
                  publicKey: user.listOfCases[index],
                }));
                setCases(caseAccounts)
                console.log("after setting cases", searchKey)
                if (searchKey) {
                  setCurrentViewingCase(getCurrentViewingCaseBySearchKey(caseAccounts, searchKey))
                }
              }
              else {
                setCases([])
              }
            }
          }
        } catch (error: any) {
          toast.error(error.toString())
          setIsNotInAnyCase(true)
        } finally {
          setLoading(false)
        }
      }
    }

    getAllCasesForUser()
  }, [searchKey, user, publicKey, program])

  const getCurrentViewingCaseBySearchKey = (caseAccounts: CaseAccount[], searchKey: string) => {
    console.log("Searching for:", searchKey);
    console.log("All case accounts:", caseAccounts);
    if (caseAccounts && caseAccounts.length > 0 && searchKey) {
      const caseFound = caseAccounts.find((caseItem) => (
        caseItem.publicKey?.toBase58() === searchKey
      ));
      console.log("Found case:", caseFound);
      return (caseFound)
    }
  }

  const getStatusMessageAndStylesForCaseState = (state: CaseState): { message: string, classNames: string } | undefined => {
    const [extractedState] = Object.keys(state)
    switch (extractedState) {
      case "toStart":
        return { message: "Yet to start", classNames: "text-sm text-yellow-500 font-bold" }
      case "waitingForParticipants":
        return { message: "Waiting for participants", classNames: "text-sm text-yellow-300 font-bold" }
      case "active":
        return { message: "Active", classNames: "text-sm text-green-500 font-bold" }
      case "disposed":
        return { message: "Disposed", classNames: "text-sm text-red-500 font-bold" }
      case "completed":
        return { message: "Completed", classNames: "text-sm text-fushcia-500 font-bold" }
      case "awaitingRuling":
        return { message: "Awating Ruling", classNames: "text-sm text-blue-500 font-bold" }
      default:
        return { message: "Invalid state", classNames: "text-sm text-red-500 font-bold" }
    }
    return undefined
  }


  const initializeCase = async (presidingJudge: PublicKey, casename: string) => {
    if (program && publicKey) {
      try {
        // First, get hold of judge PDA and account to decide seed
        const [judgePda] = findProgramAddressSync([utf8.encode('USER_STATE'), presidingJudge.toBuffer()], program.programId)
        const judgeAccount: any = await program.account.userProfile.fetch(judgePda)
        // Convert the bump value to a Uint8Array
        const bump = judgeAccount.totalParticipatingCases + 1
        const bumpUint8Array = new Uint8Array([bump]);
        const [casePda] = findProgramAddressSync([utf8.encode('CASE_STATE'), judgePda.toBuffer(), bumpUint8Array], program.programId)
        const tx = await program.methods.setupCase(bump, casename)
          .accounts({
            case: casePda,
            judge: judgePda,
            admin: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        toast.success('Successfully created case.')
      } catch (err: any) {
        toast.error(err.toString())
      } finally {
      }
    }
  }

  return { loading, setLoading, cases, setCases, currentViewingCase, searchKey, setSearchKey, isNotInAnyCase, initializeCase, getStatusMessageAndStylesForCaseState }
}
