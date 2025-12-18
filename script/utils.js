import { binarySymbolMap, symbolBinaryMap } from './maps.js';


export function symbolToBinary(sym)        { return symbolBinaryMap[sym]; }
export function binaryToSymbol(bin)        { return binarySymbolMap[bin]; }
export function encodeTape    (tapeStr)    { return tapeStr.split("").map(symbol => symbolBinaryMap[symbol]).join(""); }
export function printHr       (n)          { console.log("-".repeat(n??70)); }
export const    delimiter = "#";
export const    regexTrim = /^_+|_+$/g;
export function binToDec(str) { return parseInt(str, 2); }

