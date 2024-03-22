import { readJWKFile, arDriveFactory, deriveDriveKey, JWKWallet, CreatePrivateFolderParams, EntityID } from 'ardrive-core-js';

interface CreatePrivateFolderPayload {
  folderName: string;
  driveKey: string;
  parentFolderId?: string;
}

const arDriveWallet = process.env.ARDRIVE_WALLET_ADDRESS;
const arDrivePassword = process.env.ARDRIVE_WALLET_PASSWORD;

function getArDriveInstance() {
  // Read wallet from file
  const myWallet = readJWKFile('../../ardrive-wallet.json');
  // Construct ArDrive class
  return arDriveFactory({ wallet: myWallet });
}

async function createDrive(caseId: string) {
  const arDrive = getArDriveInstance()
  const createDriveResult = await arDrive.createPublicDrive({ driveName: caseId });
}

async function getDriveKey(driveId: string) {
  const myWallet = readJWKFile('../../ardrive-wallet.json');
  return await deriveDriveKey(
    arDrivePassword || "",
    driveId,
    JSON.stringify((myWallet as JWKWallet).getPrivateKey())
  );
}

async function createPrivateFolder(driveId: string, folderName: string, parentFolderId: EntityID) {
  const driveKey = await getDriveKey(driveId)
  const arDrive = getArDriveInstance()
  const createFolderResult = await arDrive.createPrivateFolder({
    folderName,
    driveKey,
    parentFolderId
  })
}


export { createDrive, createPrivateFolder, getDriveKey }
