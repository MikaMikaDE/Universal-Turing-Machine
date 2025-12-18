import { draw } from "./draw.js";
import { run } from "./main.js";

document.getElementById("run").addEventListener("click", ()=>{
    document.getElementById("log-output").innerText  =  "";
    const code = document.getElementById("code").value;
    const data = document.getElementById("data").value;
    run(code, data);
    draw(code);
});


run (document.getElementById("code").value, document.getElementById("data").value);
draw(document.getElementById("code").value);