import { promises as fs } from 'fs';
import initPass2 from './pass2.js';

async function testPass2() {
    const wasmModule = await initPass2();
    const runPass2 = wasmModule.cwrap('run_pass2', 'number', ['string', 'number']);
    const pass1Data = await fs.readFile('pass1.data', 'utf8'); // Read pass1.data
    const ptr = runPass2(pass1Data, pass1Data.length);
    const result = wasmModule.UTF8ToString(ptr);
    console.log("Pass 2 Output:\n", result);
    await fs.writeFile('pass2.data', result);
    console.log("Output saved to pass2.data");
    wasmModule._free(ptr);
}

testPass2().catch(err => console.error("Error:", err));