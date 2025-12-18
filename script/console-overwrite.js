const logDiv      = document.getElementById('log-output');
const originalLog = console.log;

console.log = function (...args) {
    originalLog.apply(console, args);
    const message = args.map(arg => 
        typeof arg === 'object' 
            ? JSON.stringify(arg, null, 2) 
            : String(arg)
    ).join(' ');
    logDiv.textContent += message + '\n';
};
