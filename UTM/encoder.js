import { bitSize_state, directionMap, symbolBinaryMap } from './maps.js';

export function encodeTM(tmLines) {
  const stateIds   = {};
  let stateCounter = 0;
  let encoded      = "";
  const lines      = tmLines.trim().split("\n")
                        .map   (l => l.trim())
                        .filter(l => l.length && !l.startsWith("//"));

  function getStateId(state) {
    if (state === "HALT") return "1".repeat(bitSize_state);
    if (!(state in stateIds)) {
      stateIds[state] = stateCounter.toString(2).padStart(bitSize_state, "0");
      stateCounter++;
    }
    return stateIds[state];
  }

  //     current read   ➤      next     write     dir
  // eg: q0      0      ➤      q1      0          R
  for (const line of lines) {
    if (!line.includes("➤")) continue;
    const parts = line.split("➤").map(x => x.trim());
    if (parts.length !== 2) continue;

    const [left         , right                     ] = parts;
    const [state_current, symbol_to_read            ] = left .split(" ");
    const [state_next   , symbol_to_write, direction] = right.split(" ");

    const bin = [
      getStateId(state_current), symbolBinaryMap[symbol_to_read ],
      getStateId(state_next)   , symbolBinaryMap[symbol_to_write],
      directionMap[direction]
    ].join("");

    encoded += bin;
  }

  return encoded;
}
