import { binarySymbolMap, bitSize_state, bitSize_symbol, directionMap, directionMapReversed } from './maps.js';
import { parse } from "./parser.js";
import { binaryToSymbol, delimiter, printHr, symbolToBinary } from './utils.js';

function splitTape(tapeStr) {
  const [prog, input] = tapeStr.split(delimiter);
  return { program: prog,   input: input || "" };
}


function binaryToTape(binStr) {
    const tape = [];
    for (let i = 0; i < binStr.length; i += bitSize_symbol) {
        const chunk = binStr.slice(i, i + bitSize_symbol);
        tape.push(binaryToSymbol(chunk));
    }
    return tape;
}

export function simulateUTM(fullTapeBinary, startState = "0".repeat(bitSize_state)) {
    const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null; //print head if in node window
    const { program, input } = splitTape(fullTapeBinary);
    const transitions = parse(program);
    printTable(transitions);

    const tape        = binaryToTape(input);
    let head          = 0;
    let state_current = startState;
    let step          = 0;
    
    while (true) {
        let readSym      = tape[head] || "_";
        const binSym     = symbolToBinary(readSym);
        const key        = `${state_current}_${binSym}`;
        const transition = transitions[key];
        if (!transition) { console.log(`HALT at step ${step}, state ${parseInt(state_current, 2)}`); break; }
        log(transition);
        tape[head]       = binaryToSymbol(transition.symbol_to_write);
        state_current    = transition.state_next;

        function checkIfAtStart() { if (head < 0           ) { tape.unshift("_"); head = 0; }}
        function checkIfAtEnd  () { if (head >= tape.length) { tape.push   ("_");           }}
        switch (transition.direction) {
            case directionMap["R"]: head++; checkIfAtEnd  (); break;
            case directionMap["L"]: head--; checkIfAtStart(); break;
            default: throw new Error(`Invalid direction: ${transition.direction}`);
        }
        step++;
    }
    return tape.join("");

    function log(transition) {
        const str_step     = `Step ${String(step).padStart(3)}`;
        const str_tran     = `q${parseInt(state_current, 2)},${binarySymbolMap[transition.symbol_to_write]};${directionMapReversed[transition.direction]}`;
        const str_tran_bin = `(${state_current},${transition.symbol_to_write};${transition.direction})`;
        const str_head     = `Position {${String(head).padStart(2)} }`;
        const str_tape     = tape.map((char, i) => {
            if (i === head) {
                if (isNode) {
                    const RESET = "\x1b[0m";
                    const RED   = "\x1b[44m";
                    const BOLD  = "\x1b[1m";
                    return `${BOLD}${RED}${char}${RESET}`;
                } else return char;
            }
            return char;
        }).join("");
        console.log(`${str_step}, ${str_tran} ${str_tran_bin}, ${str_head} of Tape [${str_tape}]`);

    }
}

function printTable(transitions) {
    const transitionTable = JSON.stringify(Object.entries(transitions));
    console.log("Encoded transitions:"); 
    printHr();
    console.log(transitionTable.substring(1,transitionTable.length-1));
    printHr();
    console.log("Starting Program:");
    printHr();
}