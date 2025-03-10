import { promises as fs } from 'fs';
import initPass1 from './pass1.js';

async function testPass1() {
    const wasmModule = await initPass1();
    const runPass1 = wasmModule.cwrap('run_pass1', 'number', ['string', 'number']); // Return pointer
    const input = "INS 0 1 ;\nOSC P5 P6 B2 F2 P30;\nOUT B2 B1;\nEND;\n" +
                  "GEN 0 1 2 0 0 .999 50 .999 205 -.999 306 -.999 461 0 511;\n" +
                  "NOT 0 1 .50 125 8.45;\nTER 8.00 ;\n";
    const ptr = runPass1(input, input.length); // Get pointer
    const result = wasmModule.UTF8ToString(ptr); // Convert to string
    const byteLength = wasmModule.lengthBytesUTF8(result); // Get byte length
    console.log("Pass 1 Output (", byteLength, "bytes ):\n", result);
    await fs.writeFile('pass1.data', result);
    console.log("Output saved to pass1.data");
    wasmModule._free(ptr); // Free the memory
}

testPass1().catch(err => console.error("Error:", err));