import { encodeTM } from "./encoder.js";
import { delimiter, encodeTape, printHr, regexTrim } from "./utils.js";
import { simulateUTM } from './utm.js';

export function run(program, input) {
    printHr();
    const fullInput = `${encodeTM(program)}${delimiter}${encodeTape(input)}`;
    const result    = simulateUTM(fullInput);
    printHr();
    console.log(` > > Raw  Input : [ ${fullInput.split("#").join(" # ").split("").join("​​")} ]`); //las joins with 0 width space
    console.log(` > > Input : [ ${input} ]`);
    console.log(` > > Output: [ ${result.replace(regexTrim, "")} ]`);
    printHr();
}