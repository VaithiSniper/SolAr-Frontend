import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { Solar } from 'src/constants/solar'
import { ADMIN_WALLET_PUBKEY } from 'src/constants/admin'
import { UserProfile, useUser } from './userHooks'
import { defaultCaseAddressPubkey } from 'src/constants/case-constants'
import { useProgram } from './programHooks'

export type CaseState = anchor.IdlTypes<Solar>["CaseState"]
export type PartyType = anchor.IdlTypes<Solar>["Winner"]
export type Winner = anchor.IdlTypes<Solar>["Winner"]
export type Party = {
  type_of_party: PartyType,
  members: [PublicKey?],
  memberAccounts: [UserProfile?],
  documents: [string?],
  size: number,
}
export type Case = {
  id: PublicKey,
  name: string,
  judge: PublicKey,
  judgeAccount: UserProfile,
  prosecutor: Party,
  defendant: Party,
  caseWinner: null | Winner,
  caseState: CaseState,
  events: CaseEvent[]
}
export type CaseAccount = {
  publicKey: PublicKey,
  account: Case
}
export enum CaseEventType {
  Created = "Case created!",
  MemberAdded = "A member was added",
  MemberRemoved = "A member was removed",
  CaseStateChanged = "Case state changed",
}
export type CaseEvent = {
  type: CaseEventType,
  message: string,
  classNames: string
}

export const initialDefaultCase: CaseAccount = {
  publicKey: new PublicKey(ADMIN_WALLET_PUBKEY),
  account: {
    id: new PublicKey(ADMIN_WALLET_PUBKEY),
    name: "Sample Case",
    judge: new PublicKey(ADMIN_WALLET_PUBKEY),
    judgeAccount: {} as UserProfile,
    prosecutor: {
      type_of_party: "Prosecutor" as PartyType,
      members: [],
      memberAccounts: [],
      documents: [],
      size: 0
    },
    defendant: {
      type_of_party: "Defendant" as PartyType,
      members: [],
      memberAccounts: [],
      documents: [],
      size: 0
    },
    caseWinner: "Defendant" as PartyType,
    caseState: "ToStart" as CaseState,
    events: [] as CaseEvent[]
  }
}

export const CaseStatePairs: { [state: string]: { message: string, classNames: string } } = {
  "toStart": { message: "Yet to start", classNames: "text-sm text-yellow-500 font-bold" },
  "waitingForParticipants": { message: "Waiting for participants", classNames: "text-sm text-yellow-300 font-bold" },
  "active": { message: "Active", classNames: "text-sm text-green-500 font-bold" },
  "disposed": { message: "Disposed", classNames: "text-sm text-red-500 font-bold" },
  "completed": { message: "Completed", classNames: "text-sm text-fushcia-500 font-bold" },
  "awaitingRuling": { message: "Awating Ruling", classNames: "text-sm text-blue-500 font-bold" }
}

export function useCase() {

  const [loading, setLoading] = useState(false)
  const [cases, setCases] = useState<CaseAccount[]>([])
  const [currentViewingCase, setCurrentViewingCase] = useState<CaseAccount>()
  const [isNotInAnyCase, setIsNotInAnyCase] = useState<boolean>(false)
  const [searchKey, setSearchKey] = useState<string>()

  const { program, publicKey } = useProgram()
  const { isAdminUser, isExisitingUser, user } = useUser()

  const generatePDAWithSeed = (publicKey: PublicKey) => {
    if (program) {
      const [userPDA] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId);
      return userPDA
    }
    return undefined
  }

  const getParticipatingPartyOfUser = () => {
    if (user.typeOfUser.judge)
      return "prosecutor"
  }

  const prepareCaseAccountsArray = async (listOfCases: PublicKey[]) => {
    if (program) {
      const caseAccounts: any = await program.account.case.fetchMultiple(listOfCases)
      const caseAccountsArray: CaseAccount[] = []
      for (let index = 0; index < caseAccounts.length; index++) {
        const currentCase = caseAccounts[index];
        const currentCasePDA = listOfCases[index];
        const prosecutors: PublicKey[] = new Array(currentCase.prosecutor.size).fill(defaultCaseAddressPubkey).map((_, index) => (currentCase.prosecutor.members[index] as PublicKey))
        const defendants: PublicKey[] = new Array(currentCase.defendant.size).fill(defaultCaseAddressPubkey).map((_, index) => (currentCase.defendant.members[index] as PublicKey))
        const presidingJudge: PublicKey[] = [currentCase.judge]
        const overallParticipantsPDA = presidingJudge.concat(prosecutors, defendants).map(address => generatePDAWithSeed(address)) as PublicKey[]
        const overallParticipantsAccounts = await program.account.userProfile.fetchMultiple(overallParticipantsPDA)
        const judgeAccount = overallParticipantsAccounts.slice(0, 1)
        let prosecutorsAccount: UserProfile[] = []
        let defendantsAccount: UserProfile[] = []
        if (prosecutors.length > 0)
          prosecutorsAccount = overallParticipantsAccounts.slice(1, 1 + prosecutors.length) as UserProfile[]
        if (defendants.length > 0)
          defendantsAccount = overallParticipantsAccounts.slice(1 + prosecutors.length, overallParticipantsAccounts.length) as UserProfile[]

        // Get the array of documents
        // const prosecutorDocumentIdList = await program.methods.getDocumentsListForCaseAndParty({ prosecutor: {} })
        //   .accounts({
        //     case: currentCasePDA
        //   })
        //   .rpc()
        // const defendantDocumentIdList = await program.methods.getDocumentsListForCaseAndParty({ defendant: {} })
        //   .accounts({
        //     case: currentCasePDA
        //   })
        //   .rpc()
        // Prepare the case account for pushing
        const _caseAccount = {
          account: {
            ...currentCase,
            judgeAccount,
            prosecutor: {
              members: prosecutors,
              memberAccounts: prosecutorsAccount,
              documents: [],
              size: currentViewingCase?.account.prosecutor.size
            },
            defendant: {
              members: defendants,
              memberAccounts: defendantsAccount,
              documents: [],
              size: currentViewingCase?.account.prosecutor.size
            },
            events: [
              {
                type: CaseEventType.Created,
                message: "Case created",
                classNames: "step step-success"
              },
              {
                type: CaseEventType.MemberAdded,
                message: `${judgeAccount[0]?.username} was assigned`,
                classNames: "step step-success"
              },
            ]
          },
          publicKey: user.listOfCases[index]
        }
        if (searchKey && searchKey === user.listOfCases[index].toBase58()) {
          setCurrentViewingCase(_caseAccount)
        }
        caseAccountsArray.push(_caseAccount)
      }
      return caseAccountsArray
    }
  }

  useEffect(() => {
    const getAllCasesForUser = async () => {
      if (program && publicKey) {
        try {
          setLoading(true)
          if (isAdminUser) {
            const caseAccounts: any = await program.account.case.all()
            setCases(caseAccounts)
            if (searchKey) {
              setCurrentViewingCase(getCurrentViewingCaseBySearchKey(caseAccounts, searchKey))
              setLoading(false)
            }
            if (caseAccounts.length === 0) {
              setIsNotInAnyCase(true)
            }
          }
          else {
            if (isExisitingUser && user) {
              if (user.listOfCases.length > 0) {
                console.log("Reached! ->", user.listOfCases)
                const caseAccountsArray = await prepareCaseAccountsArray(user.listOfCases) as CaseAccount[]
                setCases(caseAccountsArray)
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

  const prosecutorsAddressList = useMemo(() => {
    if (currentViewingCase)
      return currentViewingCase.account.prosecutor.members.map(memberItem => memberItem?.toBase58())
    else
      return []
  }, [currentViewingCase])

  const defendantsAddressList = useMemo(() => {
    if (currentViewingCase)
      return currentViewingCase.account.prosecutor.members.map(memberItem => memberItem?.toBase58())
    else
      return []
  }, [currentViewingCase])

  const getCurrentViewingCaseBySearchKey = (caseAccounts: CaseAccount[], searchKey: string) => {
    if (caseAccounts && caseAccounts.length > 0 && searchKey) {
      const caseFound = caseAccounts.find((caseItem) => (
        caseItem.publicKey?.toBase58() === searchKey
      ));
      return (caseFound)
    }
  }

  const getStatusMessageAndStylesForCaseState = (state: CaseState): { message: string, classNames: string } => {
    const [extractedState] = Object.keys(state)
    return CaseStatePairs[extractedState as string]
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

  const addMemberToParty = async (caseAddress: PublicKey, memberAddress: PublicKey, partyType: PartyType) => {
    if (program && publicKey) {
      try {
        const [memberPda] = findProgramAddressSync([utf8.encode('USER_STATE'), memberAddress.toBuffer()], program.programId)
        const [judgePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const party = { [`${partyType}`.toLowerCase()]: {} }
        await program.methods.addMemberToParty(memberAddress, party)
          .accounts({
            case: caseAddress,
            user: memberPda,
            judge: judgePda,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        toast.success('Successfully added member!')
      } catch (err: any) {
        toast.error(err.toString())
      } finally {
      }
    }
  }

  const addDocumentToCaseAndParty = async (caseAddress: PublicKey, docId: string, partyType: PartyType) => {
    if (program && publicKey) {
      try {
        console.log("caseAddress ->", caseAddress.toBase58())
        console.log("partyType ->", partyType)
        console.log("docId ->", docId)
        const tx = await program.methods.addDocumentToCaseAndParty(partyType, docId.toString())
          .accounts({
            case: caseAddress,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        toast.success('Successfully added document details.')
      } catch (err: any) {
        toast.error(err.toString())
      } finally {
      }
    }
  }

  const changeCaseState = async (caseAddress: PublicKey, caseState: CaseState) => {
    if (program && publicKey) {
      try {
        console.log("caseAddress ->", caseAddress.toBase58())
        console.log("caseState ->", caseState)
        const [judgePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        console.log("judgePda->", judgePda)
        const tx = await program.methods.setCaseState(caseState)
          .accounts({
            case: caseAddress,
            judge: judgePda,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        toast.success('Successfully updated case status.')
      } catch (err: any) {
        toast.error(err.toString())
      } finally {
      }
    }
  }

  return { loading, setLoading, cases, setCases, currentViewingCase, searchKey, setSearchKey, isNotInAnyCase, initializeCase, getStatusMessageAndStylesForCaseState, addMemberToParty, prosecutorsAddressList, defendantsAddressList, addDocumentToCaseAndParty, changeCaseState }
}
