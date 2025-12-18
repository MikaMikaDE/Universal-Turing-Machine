export const symbolBinaryMap = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  "+": "1010",
  "-": "1011",
  "X": "1100",
  "Y": "1101",
  "Z": "1101",
  "_": "1111",
};
export const directionMap         = {"L":"0",  "R":"1"};
export const directionMapReversed = Object.fromEntries(  Object.entries(directionMap   ).map(([k, v]) => [v, k])  );
export const binarySymbolMap      = Object.fromEntries(  Object.entries(symbolBinaryMap).map(([k, v]) => [v, k])  );
export const bitSize_state        = 4;
export const bitSize_symbol       = Object.values(symbolBinaryMap)[0].length;
export const chunkSize            = 2*bitSize_state  +  2*bitSize_symbol  +1; // 2 states (current/next)  +2 symbols (read/write),  +1 bit (direction)
for (const bin of Object.values(symbolBinaryMap)) { if (bin.length !== bitSize_state) throw new Error("ERROR: symbolBinaryMap has different bitSize!")}