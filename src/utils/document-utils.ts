const createKeccakHash = require('keccak')

function immutableHashFile(file: any) {
  return (createKeccakHash(file).digest().toString('hex'))
}

export { immutableHashFile }
