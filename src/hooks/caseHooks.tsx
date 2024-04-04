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

export type CaseState = anchor.IdlTypes<Solar>["CaseState"]
export type PartyType = anchor.IdlTypes<Solar>["Winner"]
export type Winner = anchor.IdlTypes<Solar>["Winner"]
export type CaseAccount = anchor.IdlAccounts<Solar>["case"]
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

export const initialDefaultCase: Case = {
  id: new PublicKey(""),
  name: "",
  judge: new PublicKey(""),
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

export function useCase() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const anchorWallet = useAnchorWallet()

  const [loading, setLoading] = useState(false)
  const [cases, setCases] = useState<Case>(initialDefaultCase)

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
          const [userProfilePDA] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
          const userAccount: any = await program.account.userProfile.fetch(userProfilePDA)
          console.log('user account is', userAccount)
          if (userAccount) {
            setIsExistingUser(true)
            delete userAccount.authority
            console.log(userAccount)
            setUser(userAccount)
          } else {
            setIsExistingUser(false)
          }
        } catch (error) {
          console.log(error)
          setIsExistingUser(false)
        } finally {
          setLoading(false)
        }
      }
    }
    const checkForAdminUser = () => {
      if (publicKey && (publicKey.toString() === ADMIN_WALLET_PUBKEY))
        setIsAdminUser(true)
    }
    checkForAdminUser()
    checkUserExists()
  }, [publicKey, program])

  const initializeUser = async (username: string, usertype: UserType) => {
    if (program && publicKey) {
      try {
        const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        console.log("user type is", `${usertype}`.toLowerCase())
        const tx = await program.methods.setupUser(username, { [`${usertype}`.toLowerCase()]: {} })
          .accounts({
            user: profilePda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        setIsExistingUser(true)
        toast.success('Successfully initialized user.')
      } catch (err: any) {
        console.log(err)
        toast.error(err.toString())
      } finally {
      }
    }
  }

  const verifyUser = async (docId: string, userAddress: anchor.web3.PublicKey) => {
    if (program && publicKey) {
      try {
        // Off-chain verification
        await fetch("/api/appwrite/database/unverifiedJudges", {
          method: "DELETE",
          body: JSON.stringify({
            docId: docId
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        // On-chain verification
        const [userPda] = findProgramAddressSync([utf8.encode('USER_STATE'), userAddress.toBuffer()], program.programId)
        const [adminPda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.verifyUser()
          .accounts({
            admin: adminPda,
            user: userPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        toast.success('Successfully verified judge.')
      } catch (err: any) {
        console.log(err)
        toast.error(err.toString())
      }
    }
  }




  const initializeUserProfile = async (email: string, firstName: string, lastName: string, phone: string) => {
    if (program && publicKey) {
      try {
        const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.setupUserProfile(email, firstName, lastName, phone)
          .accounts({
            user: profilePda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        toast.success('Successfully user profile.')
      } catch (err: any) {
        console.log(err)
        toast.error(err.toString())
      }
    }
  }

  return { isExisitingUser, isAdminUser, initializeUser, initializeUserProfile, loading, setLoading, user, verifyUser }
}
