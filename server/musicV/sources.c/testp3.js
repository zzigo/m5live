import { promises as fs } from 'fs';
import initPass3 from './pass3.js';

async function testPass3() {
    const wasmModule = await initPass3();
    const runPass3 = wasmModule.cwrap('run_pass3', 'number', ['string', 'number']);
    const pass2Data = await fs.readFile('pass2.data', 'utf8');
    const ptr = runPass3(pass2Data, pass2Data.length);
    const result = wasmModule.UTF8ToString(ptr);
    console.log("Pass 3 Result:\n", result);
    wasmModule._free(ptr);
}

testPass3().catch(err => console.error("Error:", err));