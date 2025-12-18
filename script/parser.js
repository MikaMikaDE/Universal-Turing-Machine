import { bitSize_state, bitSize_symbol, chunkSize } from "./maps.js";

export function parse(encoded) {

  const transitions = {};

  for (let i=0; i<encoded.length; i+=chunkSize) {
    
    const chunk = encoded.slice(i, i+chunkSize);
    if (chunk.length < chunkSize) break;

    function readChunk(bits) {
      const value = chunk.slice(idx, idx + bits);
      idx += bits;
      return value;
    }

    let   idx             = 0;
    const state_current   = readChunk(bitSize_state);
    const symbol_to_read  = readChunk(bitSize_symbol);
    const state_next      = readChunk(bitSize_state);
    const symbol_to_write = readChunk(bitSize_symbol);
    const direction       = chunk[idx];  // always 1 bit

    transitions[`${state_current}_${symbol_to_read}`] = { state_next, symbol_to_write, direction, };
  }

  return transitions;
}
