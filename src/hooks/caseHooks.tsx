import * as anchor from "@project-serum/anchor";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Solar } from "src/constants/solar";
import { ADMIN_WALLET_PUBKEY } from "src/constants/admin";
import { UserProfile, useUser } from "./userHooks";
import { defaultCaseAddressPubkey } from "src/constants/case-constants";
import { useProgram } from "./programHooks";

export type CaseState = anchor.IdlTypes<Solar>["CaseState"];
export type PartyType = anchor.IdlTypes<Solar>["Winner"];
export type Winner = anchor.IdlTypes<Solar>["Winner"];
export type Party = {
  type_of_party: PartyType,
  members: [PublicKey?],
  memberAccounts: [UserProfile?],
  documents: [string?],
  documentsCount: number,
  size: number,
}
export type Case = {
  id: PublicKey;
  name: string;
  judge: PublicKey;
  judgeAccount: UserProfile;
  prosecutor: Party;
  defendant: Party;
  caseWinner: null | Winner;
  caseState: CaseState;
  events: CaseEvent[];
};
export type CaseAccount = {
  publicKey: PublicKey;
  account: Case;
};
export enum CaseEventType {
  Created = "Case created!",
  MemberAdded = "A member was added",
  MemberRemoved = "A member was removed",
  CaseStateChanged = "Case state changed",
}
export type CaseEvent = {
  type: CaseEventType;
  message: string;
  classNames: string;
};

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
      documentsCount: 0,
      size: 0
    },
    defendant: {
      type_of_party: "Defendant" as PartyType,
      members: [],
      memberAccounts: [],
      documents: [],
      documentsCount: 0,
      size: 0
    },
    caseWinner: "Defendant" as PartyType,
    caseState: "ToStart" as CaseState,
    events: [] as CaseEvent[],
  },
};

export const CaseStatePairs: {
  [state: string]: { message: string; classNames: string };
} = {
  toStart: {
    message: "Yet to start",
    classNames: "text-sm text-yellow-500 font-bold",
  },
  waitingForParticipants: {
    message: "Waiting for participants",
    classNames: "text-sm text-yellow-300 font-bold",
  },
  active: { message: "Active", classNames: "text-sm text-green-500 font-bold" },
  disposed: {
    message: "Disposed",
    classNames: "text-sm text-red-500 font-bold",
  },
  completed: {
    message: "Completed",
    classNames: "text-sm text-fushcia-500 font-bold",
  },
  awaitingRuling: {
    message: "Awating Ruling",
    classNames: "text-sm text-blue-500 font-bold",
  },
};

export function useCase() {
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<CaseAccount[]>([]);
  const [currentViewingCase, setCurrentViewingCase] = useState<CaseAccount>();
  const [isNotInAnyCase, setIsNotInAnyCase] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>();

  const [hasCaseEventFired, setHasCaseEventFired] = useState<boolean>(false);

  const { program, publicKey } = useProgram();
  const { isAdminUser, isExisitingUser, user } = useUser();

  const generatePDAWithSeed = (publicKey: PublicKey) => {
    if (program) {
      const [userPDA] = findProgramAddressSync(
        [utf8.encode("USER_STATE"), publicKey.toBuffer()],
        program.programId
      );
      return userPDA;
    }
    return undefined;
  };

  const getParticipatingPartyOfUser = () => {
    if (user.typeOfUser.judge) return "prosecutor";
  };

  const prepareCaseAccountsArray = async (listOfCases: PublicKey[]) => {
    if (program) {
      const caseAccounts: any = await program.account.case.fetchMultiple(
        listOfCases
      );
      const caseAccountsArray: CaseAccount[] = [];
      for (let index = 0; index < caseAccounts.length; index++) {
        const currentCase = caseAccounts[index];
        const currentCasePDA = listOfCases[index];
        const prosecutors: PublicKey[] = new Array(currentCase.prosecutor.size)
          .fill(defaultCaseAddressPubkey)
          .map(
            (_, index) => currentCase.prosecutor.members[index] as PublicKey
          );
        const defendants: PublicKey[] = new Array(currentCase.defendant.size)
          .fill(defaultCaseAddressPubkey)
          .map((_, index) => currentCase.defendant.members[index] as PublicKey);
        const presidingJudge: PublicKey[] = [currentCase.judge];
        const overallParticipantsPDA = presidingJudge
          .concat(prosecutors, defendants)
          .map((address) => generatePDAWithSeed(address)) as PublicKey[];
        const overallParticipantsAccounts =
          await program.account.userProfile.fetchMultiple(
            overallParticipantsPDA
          );
        const judgeAccount: any = overallParticipantsAccounts.slice(0, 1);
        let prosecutorsAccount: UserProfile[] = [];
        let defendantsAccount: UserProfile[] = [];
        if (prosecutors.length > 0)
          prosecutorsAccount = overallParticipantsAccounts.slice(
            1,
            1 + prosecutors.length
          ) as UserProfile[];
        if (defendants.length > 0)
          defendantsAccount = overallParticipantsAccounts.slice(
            1 + prosecutors.length,
            overallParticipantsAccounts.length
          ) as UserProfile[];

        const prosecutorDocumentIdList: string[] = new Array(currentCase.prosecutor.documentsCount).fill(defaultCaseAddressPubkey).map((_, index) => (currentCase.prosecutor.documents[index] as string))
        const defendantDocumentIdList: string[] = new Array(currentCase.defendant.documentsCount).fill(defaultCaseAddressPubkey).map((_, index) => (currentCase.defendant.documents[index] as string))

        const getEventsListForCaseId = async (caseId: PublicKey) => {
          const result = await fetch(
            `/api/appwrite/database/caseHistory?caseId=${caseId.toBase58()}`
          );
          const data = await result.json();
          console.log("data is", data);
          const res = data.new_document.txnId.map((doc: any, idx: number) => {
            return {
              txnId: doc,
              message: data.new_document.message[idx],
              classNames: "step step-success",
            };
          });
          return res;
        };

        const eventsList = await getEventsListForCaseId(currentCasePDA);

        // Prepare the case account for pushing
        const _caseAccount = {
          account: {
            ...currentCase,
            judgeAccount,
            prosecutor: {
              members: prosecutors,
              memberAccounts: prosecutorsAccount,
              documents: prosecutorDocumentIdList,
              documentsCount: currentViewingCase?.account.prosecutor.documentsCount,
              size: currentViewingCase?.account.prosecutor.size
            },
            defendant: {
              members: defendants,
              memberAccounts: defendantsAccount,
              documents: defendantDocumentIdList,
              size: currentViewingCase?.account.prosecutor.size
            },
            events: eventsList,
          },
          publicKey: user.listOfCases[index],
        };
        if (searchKey && searchKey === user.listOfCases[index].toBase58()) {
          setCurrentViewingCase(_caseAccount);
        }
        caseAccountsArray.push(_caseAccount);
      }
      return caseAccountsArray;
    }
  };

  useEffect(() => {
    const getAllCasesForUser = async () => {
      if (program && publicKey) {
        try {
          setLoading(true);
          if (isAdminUser) {
            const caseAccounts: any = await program.account.case.all();
            setCases(caseAccounts);
            if (searchKey) {
              setCurrentViewingCase(
                getCurrentViewingCaseBySearchKey(caseAccounts, searchKey)
              );
              setLoading(false);
            }
            if (caseAccounts.length === 0) {
              setIsNotInAnyCase(true);
            }
          } else {
            if (isExisitingUser && user) {
              if (user.listOfCases.length > 0) {
                console.log("Reached! ->", user.listOfCases);
                const caseAccountsArray = (await prepareCaseAccountsArray(
                  user.listOfCases
                )) as CaseAccount[];
                setCases(caseAccountsArray);
              } else {
                setCases([]);
              }
            }
          }
        } catch (error: any) {
          toast.error(error.toString());
          setIsNotInAnyCase(true);
        } finally {
          setLoading(false);
        }
      }
    };

    getAllCasesForUser();
    setHasCaseEventFired(false);
  }, [hasCaseEventFired, searchKey, user, publicKey, program]);

  const prosecutorsAddressList = useMemo(() => {
    if (currentViewingCase)
      return currentViewingCase.account.prosecutor.members.map((memberItem) =>
        memberItem?.toBase58()
      );
    else return [];
  }, [currentViewingCase]);

  const defendantsAddressList = useMemo(() => {
    if (currentViewingCase)
      return currentViewingCase.account.prosecutor.members.map((memberItem) =>
        memberItem?.toBase58()
      );
    else return [];
  }, [currentViewingCase]);

  const getCurrentViewingCaseBySearchKey = (
    caseAccounts: CaseAccount[],
    searchKey: string
  ) => {
    if (caseAccounts && caseAccounts.length > 0 && searchKey) {
      const caseFound = caseAccounts.find(
        (caseItem) => caseItem.publicKey?.toBase58() === searchKey
      );
      return caseFound;
    }
  };

  const addEventToCase = async (
    caseAddress: PublicKey,
    event: CaseEvent,
    txnId: string
  ) => {
    setHasCaseEventFired(true);
    const result = await fetch("/api/appwrite/database/caseHistory", {
      method: "PATCH",
      body: JSON.stringify({
        caseId: caseAddress.toBase58(),
        txnId,
        message: event.message,
      }),
    });
    const data = await result.json();
    console.log("data is", data.message);
  };

  const createCaseDocument = async (caseAddress: PublicKey) => {
    const result = await fetch("/api/appwrite/database/caseHistory", {
      method: "POST",
      body: JSON.stringify({
        caseId: caseAddress.toBase58(),
      }),
    });
    const data = await result.json();
    console.log("data is", data.message);
  };

  const getStatusMessageAndStylesForCaseState = (
    state: CaseState
  ): { message: string; classNames: string } => {
    const [extractedState] = Object.keys(state);
    return CaseStatePairs[extractedState as string];
  };

  const initializeCase = async (
    presidingJudge: PublicKey,
    casename: string
  ) => {
    if (program && publicKey) {
      try {
        // First, get hold of judge PDA and account to decide seed
        const [judgePda] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), presidingJudge.toBuffer()],
          program.programId
        );
        const judgeAccount: any = await program.account.userProfile.fetch(
          judgePda
        );
        // Convert the bump value to a Uint8Array
        const bump = judgeAccount.totalParticipatingCases + 1;
        const bumpUint8Array = new Uint8Array([bump]);
        const [casePda] = findProgramAddressSync(
          [utf8.encode("CASE_STATE"), judgePda.toBuffer(), bumpUint8Array],
          program.programId
        );
        const tx = await program.methods
          .setupCase(bump, casename)
          .accounts({
            case: casePda,
            judge: judgePda,
            admin: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        toast.success("Successfully created case.");
        createCaseDocument(casePda);
        addEventToCase(
          casePda,
          {
            type: CaseEventType.Created,
            message: "Case created",
            classNames: "step step-success",
          },
          tx
        );
        addEventToCase(
          casePda,
          {
            type: CaseEventType.MemberAdded,
            message: `${judgeAccount?.username} was assigned`,
            classNames: "step step-success",
          },
          tx
        );
      } catch (err: any) {
        toast.error(err.toString());
      } finally {
      }
    }
  };

  const addMemberToParty = async (
    caseAddress: PublicKey,
    memberAddress: PublicKey,
    partyType: PartyType
  ) => {
    if (program && publicKey) {
      try {
        const [memberPda] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), memberAddress.toBuffer()],
          program.programId
        );
        const [judgePda] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );
        const party = { [`${partyType}`.toLowerCase()]: {} };
        const tx = await program.methods
          .addMemberToParty(memberAddress, party)
          .accounts({
            case: caseAddress, 
            user: memberPda,
            judge: judgePda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        toast.success("Successfully added member!");
        const memberAccount: any = await program.account.userProfile.fetch(
          memberPda
        );
        addEventToCase(
          caseAddress,
          {
            type: CaseEventType.MemberAdded,
            message: `${memberAccount.firstName} ${memberAccount.lastName} was added to ${partyType} party`,
            classNames: "step step-success",
          },
          tx
        );
      } catch (err: any) {
        toast.error(err.toString());
      } finally {
      }
    }
  };

  const addDocumentToCaseAndParty = async (
    caseAddress: PublicKey,
    docId: string,
    partyType: PartyType
  ) => {
    if (program && publicKey) {
      try {
        const tx = await program.methods.addDocumentToCaseAndParty(partyType, docId.toString())
          .accounts({
            case: caseAddress,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        toast.success("Successfully added document details.");
        addEventToCase(
          caseAddress,
          {
            type: CaseEventType.MemberAdded,
            message: `Document ${docId} was added to ${partyType} party`,
            classNames: "step step-success",
          },
          tx
        );
      } catch (err: any) {
        toast.error(err.toString());
      } finally {
      }
    }
  };

  const changeCaseState = async (
    caseAddress: PublicKey,
    caseState: CaseState
  ) => {
    if (program && publicKey) {
      try {
        console.log("caseAddress ->", caseAddress.toBase58());
        console.log("caseState ->", caseState);
        const [judgePda] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );
        console.log("judgePda->", judgePda);
        const tx = await program.methods
          .setCaseState(caseState)
          .accounts({
            case: caseAddress,
            judge: judgePda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        toast.success("Successfully updated case status.");
        const displayedCaseState =
          getStatusMessageAndStylesForCaseState(caseState);
        const newState = Object.values(displayedCaseState)[0];
        addEventToCase(
          caseAddress,
          {
            type: CaseEventType.CaseStateChanged,
            message: `Case state changed to ${newState}`,
            classNames: "step step-success",
          },
          tx
        );
      } catch (err: any) {
        toast.error(err.toString());
      } finally {
      }
    }
  };

  const declareCaseWinner = async (caseAddress: PublicKey, partyBool: boolean) => {
    if (program && publicKey) {
      try {
        const [judgePda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.declareWinner(partyBool)
          .accounts({
            case: caseAddress,
            judge: judgePda,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        toast.success('Successfully declared winner.')
      } catch (err: any) {
        toast.error(err.toString())
      } finally {
      }
    }
  }

  return { loading, setLoading, cases, setCases, currentViewingCase, searchKey, setSearchKey, isNotInAnyCase, initializeCase, getStatusMessageAndStylesForCaseState, addMemberToParty, prosecutorsAddressList, defendantsAddressList, addDocumentToCaseAndParty, changeCaseState, declareCaseWinner }
}
