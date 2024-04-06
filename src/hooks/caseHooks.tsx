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
import { initialFixedPubkey, useUser } from './userHooks'



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
  const [isNotInAnyCase, setIsNotInAnyCase] = useState<boolean>(false)

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
          }
          else {
            if (isExisitingUser && user) {
              const listOfParticipatingCases = user.listOfCases.filter((casePubkey) => casePubkey.toBase58() !== initialFixedPubkey.toBase58())
              if (listOfParticipatingCases.length > 0) {
                const caseAccounts = await program.account.case.fetchMultiple(listOfParticipatingCases)
                console.log('case accounts list for normal user', caseAccounts)
                // setCases(caseAccounts)
              }
              else {
                console.log('no cases found for user')
              }
            }
          }
        } catch (error) {
          console.log(error)
          setIsNotInAnyCase(true)
        } finally {
          setLoading(false)
        }
      }
    }

    getAllCasesForUser()
  }, [publicKey, program])

  const initializeCase = async (presidingJudge: PublicKey, casename: string) => {
    if (program && publicKey) {
      try {
        const [casePda, caseBump] = findProgramAddressSync([utf8.encode('CASE_STATE'), publicKey.toBuffer()], program.programId)
        const [judgePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.setupCase(casename)
          .accounts({
            case: casePda,
            judge: judgePda,
            admin: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        toast.success('Successfully created case.')
      } catch (err: any) {
        console.log(err)
        toast.error(err.toString())
      } finally {
      }
    }
  }

  return { loading, setLoading, cases, setCases, isNotInAnyCase, initializeCase }
}
