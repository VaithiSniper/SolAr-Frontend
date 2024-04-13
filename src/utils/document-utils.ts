const createKeccakHash = require('keccak')

function immutableHashFile(file: any) {
  return (createKeccakHash(file).update(new Date().toISOString()).digest().toString('hex'))
}


export { immutableHashFile }
