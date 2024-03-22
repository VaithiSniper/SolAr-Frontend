import { readJWKFile, arDriveFactory, deriveDriveKey } from 'ardrive-core-js';

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

// async function getDriveKey(driveId: string) {
//   return await deriveDriveKey(
//     'mySecretPassWord',
//     '12345674a-eb5e-4134-8ae2-a3946a428ec7',
//     JSON.stringify((myWallet as JWKWallet).getPrivateKey())
//   );
// }

// async function createPrivateFolder(driveId: string, folderName: type) {

// }

