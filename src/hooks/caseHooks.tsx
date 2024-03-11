import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState } from 'react'
import * as solarIDL from '../constants/idl.json'
import toast from 'react-hot-toast'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'

export function useCase() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const anchorWallet = useAnchorWallet()

  const [isExisitingUser, setIsExistingUser] = useState(false)
  const [caseId, setCaseId] = useState("000")
  const [loading, setLoading] = useState(false)

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
      const programId = new PublicKey(solarIDL.IDL.metadata.address)
      const programIdl = JSON.parse(JSON.stringify(solarIDL.IDL)) // to circumvent typescript issue
      return new anchor.Program(programIdl, programId, provider)
    }
  }, [connection, anchorWallet])

  useEffect(() => {
    const getCases = async () => {
      if (program && publicKey) {
        try {
          setLoading(true)
          const [casePDA] = findProgramAddressSync([utf8.encode('CASE'), publicKey.toBuffer()], program.programId)
          const caseAccount = await program.account.Case.fetch(casePDA)
          if (caseAccount) {
            setIsExistingUser(true)
            setCaseId(caseAccount?.case_id || "case_id not set")
          } else {
            setIsExistingUser(false)
          }
        } catch (error) {
          console.log(error)
          setIsExistingUser(false)
          setCaseId("Some error occurred")
        } finally {
          setLoading(false)
        }
      }
    }
    getCases()
  }, [publicKey, program])

  const initializeUser = async () => {
    if (program && publicKey) {
      try {
        const [profilePda] = findProgramAddressSync([utf8.encode('CASE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.setupCase()
          .accounts({
            userProfile: profilePda,
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

  return { isExisitingUser, initializeUser, loading }
}
