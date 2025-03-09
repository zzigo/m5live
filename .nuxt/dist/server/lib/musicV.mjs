var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class MusicV {
  constructor() {
    __publicField(this, "sampleRate", 44100);
    __publicField(this, "parameters", new Float32Array(1e3));
    __publicField(this, "events", []);
    __publicField(this, "currentTime", 0);
    __publicField(this, "instruments", /* @__PURE__ */ new Map());
    __publicField(this, "functions", /* @__PURE__ */ new Map());
    __publicField(this, "currentInstrument", null);
    __publicField(this, "audioContext", null);
    __publicField(this, "workletNode", null);
    __publicField(this, "consoleOutput", "");
    __publicField(this, "isServer", typeof globalThis.window === "undefined");
    __publicField(this, "activeNotes", /* @__PURE__ */ new Map());
    __publicField(this, "pass2Report", []);
    __publicField(this, "globalVars", /* @__PURE__ */ new Map());
    this.initDefaultFunctionTables();
    if (!this.isServer) {
      this.setupKeyboardShortcuts();
    }
  }
  initDefaultFunctionTables() {
    const sineWave = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      sineWave[i] = Math.sin(2 * Math.PI * i / 512);
    }
    this.functions.set(2, sineWave);
    const straightLine = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      straightLine[i] = i / 512;
    }
    this.functions.set(1, straightLine);
  }
  setupKeyboardShortcuts() {
    (void 0).addEventListener("keydown", (event) => {
      const isMac = (void 0).platform.toUpperCase().indexOf("MAC") >= 0;
      const stopKey = isMac ? event.metaKey && event.key === "." : event.ctrlKey && event.key === ".";
      if (stopKey) {
        event.preventDefault();
        this.stopAndReset();
      }
    });
  }
  stopAndReset() {
    try {
      if (this.audioContext) {
        if (this.workletNode) {
          this.workletNode.port.postMessage({ type: "stop" });
          this.workletNode.disconnect();
          this.workletNode = null;
        }
        this.audioContext.suspend().then(() => {
          this.audioContext.close();
          this.audioContext = null;
          this.activeNotes.clear();
          this.events = [];
          this.currentTime = 0;
          this.consoleOutput = "";
          console.clear();
          console.log("MusicV stopped and reset via Command+./Ctrl+.");
          this.consoleOutput += "MusicV stopped and reset\n";
        });
      } else {
        this.activeNotes.clear();
        this.events = [];
        this.currentTime = 0;
        this.consoleOutput = "";
        console.clear();
        console.log("MusicV reset (no audio context active)");
        this.consoleOutput += "MusicV reset\n";
      }
    } catch (error) {
      console.error("Error during stop and reset:", error);
      this.consoleOutput += `Error during stop and reset: ${error.message}
`;
    }
  }
  parseScore(scoreText) {
    this.consoleOutput = "*** MUSIC V SCORE PROCESSING ***\n\n";
    this.events = [];
    this.instruments.clear();
    this.pass2Report = [];
    this.activeNotes.clear();
    this.globalVars.clear();
    const lines = scoreText.split("\n");
    let currentInstrumentId = -1;
    const instrumentUnitCounts = /* @__PURE__ */ new Map();
    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith(";")) continue;
      if (line.trim().startsWith("COM") || line.trim().startsWith("COMMENT")) {
        this.consoleOutput += `Comment: ${line.trim().substring(line.indexOf(" ") + 1)}
`;
        continue;
      }
      const parts = line.trim().split(/\s+/);
      const opcode = parts[0];
      const formattedLine = `${opcode.padEnd(8)}${parts.slice(1).map((p) => p.padEnd(9, " ")).join("")}`;
      this.pass2Report.push(formattedLine);
      switch (opcode) {
        case "INS":
          if (this.currentInstrument) {
            this.consoleOutput += `Instrument ${currentInstrumentId} definition complete

`;
            instrumentUnitCounts.set(currentInstrumentId, this.currentInstrument.units.length);
            this.pass2Report.push(`       ${currentInstrumentId}    ${this.currentInstrument.units.length}.000    0.000`);
          }
          currentInstrumentId = parseInt(parts[1], 10);
          this.currentInstrument = {
            id: currentInstrumentId,
            units: [],
            oscillators: [],
            outputs: []
          };
          this.instruments.set(currentInstrumentId, this.currentInstrument);
          this.consoleOutput += `Defining Instrument ${currentInstrumentId}
`;
          break;
        case "OSC":
          if (this.currentInstrument) {
            const freqParam = parts[1];
            const ampParam = parts[2];
            const outputBlock = parseInt(parts[3].substring(1), 10);
            const functionNum2 = parseInt(parts[4].substring(1), 10);
            const phaseParam = parts[5] || "P30";
            const oscId = this.currentInstrument.oscillators.length + 1;
            this.currentInstrument.oscillators.push({
              id: oscId,
              type: 1,
              freqParam,
              ampParam,
              outputBus: outputBlock,
              functionTable: functionNum2,
              phaseParam
            });
            this.currentInstrument.units.push({
              type: "OSC",
              params: { freqParam, ampParam, outputBlock, functionNum: functionNum2, phaseParam }
            });
            this.consoleOutput += `  OSC: Freq=${freqParam}, Amp=${ampParam}, Out=B${outputBlock}, Func=F${functionNum2}, Phase=${phaseParam}
`;
          }
          break;
        case "OUT":
          if (this.currentInstrument) {
            const inputBlock = parseInt(parts[1].substring(1), 10);
            const outputBlock = parseInt(parts[2].substring(1), 10);
            this.currentInstrument.outputs.push({ inputBus: inputBlock, outputBus: outputBlock });
            this.currentInstrument.units.push({
              type: "OUT",
              params: { inputBlock, outputBlock, amplitude: 1 }
            });
            this.consoleOutput += `  OUT: In=B${inputBlock}, Out=B${outputBlock}, Amp=1
`;
          }
          break;
        case "AD2":
          if (this.currentInstrument) {
            const input1 = parts[1].startsWith("P") ? parts[1] : parseInt(parts[1].substring(1), 10);
            const input2 = parts[2].startsWith("P") ? parts[2] : parseInt(parts[2].substring(1), 10);
            const outputBlock = parseInt(parts[3].substring(1), 10);
            this.currentInstrument.units.push({
              type: "AD2",
              params: { input1, input2, outputBlock }
            });
            this.consoleOutput += `  AD2: In1=${input1}, In2=${input2}, Out=B${outputBlock}
`;
          }
          break;
        case "SET":
          if (this.currentInstrument) {
            const param = parts[1];
            this.currentInstrument.units.push({
              type: "SET",
              params: { param }
            });
            this.consoleOutput += `  SET: Param=${param}
`;
          }
          break;
        case "MLT":
          if (this.currentInstrument) {
            const input1 = parts[1].startsWith("P") ? parts[1] : parseInt(parts[1].substring(1), 10);
            const input2 = parts[2].startsWith("P") ? parts[2] : parseInt(parts[2].substring(1), 10);
            const outputBlock = parseInt(parts[3].substring(1), 10);
            this.currentInstrument.units.push({
              type: "MLT",
              params: { input1, input2, outputBlock }
            });
            this.consoleOutput += `  MLT: In1=${input1}, In2=${input2}, Out=B${outputBlock}
`;
          }
          break;
        case "ENV":
          if (this.currentInstrument) {
            const ampParam = parts[1];
            const durParam = parts[2];
            const outputBlock = parseInt(parts[3].substring(1), 10);
            const functionNum2 = parseInt(parts[4].substring(1), 10);
            const phaseParam = parts[5] || "P30";
            this.currentInstrument.units.push({
              type: "ENV",
              params: { ampParam, durParam, outputBlock, functionNum: functionNum2, phaseParam }
            });
            this.consoleOutput += `  ENV: Amp=${ampParam}, Dur=${durParam}, Out=B${outputBlock}, Func=F${functionNum2}, Phase=${phaseParam}
`;
          }
          break;
        case "SIA":
          const siaTime = parseFloat(parts[1]);
          const varNum = parseInt(parts[2], 10);
          const value = parseInt(parts[3], 10);
          this.globalVars.set(varNum, value);
          if (varNum === 4) this.sampleRate = value;
          this.events.push({ type: "sia", time: siaTime, varNum, value });
          this.consoleOutput += `SIA: Time=${siaTime}, Var=${varNum}, Value=${value} (SampleRate=${this.sampleRate})
`;
          break;
        case "SV2":
          const sv2Time = parseFloat(parts[1]);
          const sv2VarNum = parseInt(parts[2], 10);
          const sv2Value = parseFloat(parts[3]);
          this.events.push({ type: "sv2", time: sv2Time, varNum: sv2VarNum, value: sv2Value });
          this.consoleOutput += `SV2: Time=${sv2Time}, Var=P${sv2VarNum}, Value=${sv2Value}
`;
          break;
        case "END":
          if (this.currentInstrument) {
            this.consoleOutput += `Instrument ${currentInstrumentId} definition complete

`;
            instrumentUnitCounts.set(currentInstrumentId, this.currentInstrument.units.length);
            this.currentInstrument = null;
          }
          break;
        case "GEN":
          const functionNum = parseInt(parts[3], 10);
          const params = parts.slice(4).map((p) => parseFloat(p));
          this.handleGenFunction(functionNum, parseInt(parts[1]), parseInt(parts[2]), params);
          this.consoleOutput += `GEN: Function=${functionNum}, Params=${params.length}
`;
          break;
        case "NOT":
          const startTime = parseFloat(parts[1]);
          const insNum = parseInt(parts[2], 10);
          const amplitude = parseFloat(parts[3]);
          const frequency = parseFloat(parts[4]);
          const duration = parseFloat(parts[5]);
          const p6 = parts[6] ? parseFloat(parts[6]) : void 0;
          const p7 = parts[7] ? parseFloat(parts[7]) : void 0;
          const p8 = parts[8] ? parseFloat(parts[8]) : void 0;
          this.events.push({
            type: "note",
            time: startTime,
            insNum,
            frequency,
            amplitude,
            duration,
            p6,
            p7,
            p8
          });
          this.consoleOutput += `Note: Start=${startTime}, Ins=${insNum}, Amp=${amplitude}, Freq=${frequency}, Dur=${duration}${p6 ? `, P6=${p6}` : ""}${p7 ? `, P7=${p7}` : ""}${p8 ? `, P8=${p8}` : ""}
`;
          console.log(`Added note event: Start=${startTime}, Ins=${insNum}, Amp=${amplitude}, Freq=${frequency}, Dur=${duration}`);
          break;
        case "TER":
          const terminationTime = parseFloat(parts[1]);
          this.events.push({ type: "termination", time: terminationTime });
          this.consoleOutput += `Termination time: ${terminationTime}

`;
          console.log(`Added termination event at ${terminationTime}s`);
          break;
        case "SV3":
          this.consoleOutput += `SV3: Set variable in Pass III (not implemented)
`;
          break;
        case "SEC":
          this.consoleOutput += `SEC: End section (not implemented)
`;
          break;
        case "SV1":
          this.consoleOutput += `SV1: Set variable in Pass I (not implemented)
`;
          break;
        case "PLF":
          this.consoleOutput += `PLF: Execute subroutine in Pass I (not implemented)
`;
          break;
        case "PLS":
          this.consoleOutput += `PLS: Execute subroutine in Pass II (not implemented)
`;
          break;
        case "SI3":
          this.consoleOutput += `SI3: Set integer in Pass III (not implemented)
`;
          break;
        case "RAN":
          this.consoleOutput += `RAN: Random generator (not implemented)
`;
          break;
        case "STR":
          this.consoleOutput += `STR: Stereo output (not implemented)
`;
          break;
        case "AD3":
          this.consoleOutput += `AD3: Three-input adder (not implemented)
`;
          break;
        case "AD4":
          this.consoleOutput += `AD4: Four-input adder (not implemented)
`;
          break;
        case "FLT":
          this.consoleOutput += `FLT: Filter (not implemented)
`;
          break;
        case "RAH":
          this.consoleOutput += `RAH: Random and hold (not implemented)
`;
          break;
        case "IOS":
          this.consoleOutput += `IOS: Interpolating oscillator (not implemented)
`;
          break;
        default:
          this.consoleOutput += `Unknown opcode: ${opcode} (skipped)
`;
      }
    }
    this.events.sort((a, b) => a.time - b.time);
    this.processPass2();
  }
  processPass2() {
    this.consoleOutput += "1PASS II REPORT\n0(WORD CNT)\n";
    this.pass2Report.forEach((line) => this.consoleOutput += `${line}
`);
    this.instruments.forEach((instrument, id) => {
      this.consoleOutput += `       ${id.toString().padStart(2)}    ${instrument.units.length.toFixed(3).padStart(6)}    0.000
`;
    });
    for (const event of this.events) {
      if (event.type === "sv2") {
        const { time, varNum, value } = event;
        for (const noteEvent of this.events) {
          if (noteEvent.type === "note" && noteEvent.time >= time) {
            switch (varNum) {
              case 5:
                noteEvent.frequency = value;
                break;
              case 6:
                noteEvent.p6 = value;
                break;
              case 7:
                noteEvent.p7 = value;
                break;
              case 8:
                noteEvent.p8 = value;
                break;
              default:
                this.consoleOutput += `SV2: Unsupported varNum P${varNum}
`;
                break;
            }
            this.consoleOutput += `SV2 applied at ${time}s: P${varNum}=${value} to note at ${noteEvent.time}s
`;
          }
        }
      }
    }
    this.consoleOutput += "END OF PASS II\n\nScore processing complete\n";
  }
  processOscillator(unit, note, blocks, currentTime) {
    var _a, _b;
    const { freqParam, ampParam, outputBlock, functionNum, phaseParam } = unit.params;
    const frequency = freqParam.startsWith("B") ? ((_a = blocks.get(parseInt(freqParam.substring(1)))) == null ? void 0 : _a[0]) || 0 : note[freqParam.toLowerCase()] || note.frequency || 440;
    const amplitude = ampParam.startsWith("B") ? ((_b = blocks.get(parseInt(ampParam.substring(1)))) == null ? void 0 : _b[0]) || 0 : note[ampParam.toLowerCase()] || note.amplitude || 0.5;
    const functionData = this.functions.get(functionNum) || this.functions.get(2);
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    if (!note.oscState) {
      const initialPhase = phaseParam.startsWith("P") ? note[phaseParam.toLowerCase()] || 0 : 0;
      note.oscState = { sum: initialPhase };
    }
    const tableSize = functionData.length;
    const increment = frequency * tableSize / this.sampleRate;
    note.oscState.sum += increment;
    const index = Math.floor(note.oscState.sum % (tableSize - 1));
    const value = functionData[index];
    output[0] = value * amplitude;
    if (freqParam.startsWith("B") && parseInt(freqParam.substring(1)) === outputBlock) {
      output[0] *= 0.9;
    }
    if (currentTime < 0.01 || Math.random() < 0.01) {
      console.log(`OSC at ${currentTime.toFixed(2)}s: Freq=${frequency.toFixed(2)}, Amp=${amplitude.toFixed(2)}, Value=${value.toFixed(6)}, Out=B${outputBlock}=${output[0].toFixed(6)}`);
    }
  }
  processOutput(unit, blocks) {
    var _a;
    const { inputBlock, outputBlock, amplitude } = unit.params;
    const input = ((_a = blocks.get(inputBlock)) == null ? void 0 : _a[0]) || 0;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] += input * amplitude;
  }
  processAd2(unit, note, blocks) {
    var _a, _b;
    const { input1, input2, outputBlock } = unit.params;
    const input1Value = typeof input1 === "string" ? note[input1.toLowerCase()] || 0 : ((_a = blocks.get(input1)) == null ? void 0 : _a[0]) || 0;
    const input2Value = typeof input2 === "string" ? note[input2.toLowerCase()] || 0 : ((_b = blocks.get(input2)) == null ? void 0 : _b[0]) || 0;
    const sum = input1Value + input2Value;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] = sum;
    console.log(`AD2: In1=${input1Value.toFixed(6)}, In2=${input2Value.toFixed(6)}, Sum=${sum.toFixed(6)} -> B${outputBlock}`);
  }
  processSet(unit, note, blocks, instrumentUnits) {
    const { param } = unit.params;
    const paramValue = note[param.toLowerCase()] || 0;
    const currentIndex = instrumentUnits.findIndex((u) => u === unit);
    for (let i = currentIndex + 1; i < instrumentUnits.length; i++) {
      if (instrumentUnits[i].type === "OSC") {
        instrumentUnits[i].params.functionNum = Math.floor(paramValue) || instrumentUnits[i].params.functionNum;
        console.log(`SET: Updated OSC functionNum to ${instrumentUnits[i].params.functionNum} from ${param}`);
        break;
      }
    }
  }
  processMlt(unit, note, blocks) {
    var _a, _b;
    const { input1, input2, outputBlock } = unit.params;
    const input1Value = typeof input1 === "string" ? note[input1.toLowerCase()] || 0 : ((_a = blocks.get(input1)) == null ? void 0 : _a[0]) || 0;
    const input2Value = typeof input2 === "string" ? note[input2.toLowerCase()] || 0 : ((_b = blocks.get(input2)) == null ? void 0 : _b[0]) || 0;
    const product = input1Value * input2Value;
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    output[0] = product;
    console.log(`MLT: In1=${input1Value.toFixed(6)}, In2=${input2Value.toFixed(6)}, Product=${product.toFixed(6)} -> B${outputBlock}`);
  }
  processEnv(unit, note, blocks, currentTime) {
    var _a, _b;
    const { ampParam, durParam, outputBlock, functionNum, phaseParam } = unit.params;
    const amplitude = ampParam.startsWith("B") ? ((_a = blocks.get(parseInt(ampParam.substring(1)))) == null ? void 0 : _a[0]) || 0 : note[ampParam.toLowerCase()] || note.amplitude || 0.5;
    const duration = durParam.startsWith("P") ? note[durParam.toLowerCase()] || note.duration || 1 : ((_b = blocks.get(parseInt(durParam.substring(1)))) == null ? void 0 : _b[0]) || note.duration || 1;
    const functionData = this.functions.get(functionNum) || this.functions.get(2);
    let output = blocks.get(outputBlock);
    if (!output) {
      output = new Float32Array(1);
      blocks.set(outputBlock, output);
    }
    if (!note.envState) {
      const initialTime = phaseParam.startsWith("P") ? note[phaseParam.toLowerCase()] || 0 : 0;
      note.envState = { time: initialTime };
    }
    const elapsedTime = currentTime - note.startTime;
    const t = Math.min(elapsedTime / duration, 1);
    const index = Math.floor(t * (functionData.length - 1));
    const value = functionData[index];
    output[0] = value * amplitude;
    if (currentTime < 0.01 || Math.random() < 0.01) {
      console.log(`ENV at ${currentTime.toFixed(2)}s: Amp=${amplitude.toFixed(2)}, Dur=${duration.toFixed(2)}, T=${t.toFixed(2)}, Value=${value.toFixed(6)}, Out=B${outputBlock}=${output[0].toFixed(6)}`);
    }
  }
  generateSample(currentTime, blocks) {
    var _a;
    for (let i = 2; i <= 10; i++) {
      const block = blocks.get(i);
      if (block) block.fill(0);
    }
    for (const [noteNum, note] of this.activeNotes.entries()) {
      const noteEndTime = note.startTime + note.duration;
      if (currentTime >= note.startTime && currentTime <= noteEndTime) {
        const instrument = note.instrument;
        if (instrument && instrument.units) {
          for (const unit of instrument.units) {
            switch (unit.type) {
              case "OSC":
                this.processOscillator(unit, note, blocks, currentTime);
                break;
              case "OUT":
                this.processOutput(unit, blocks);
                break;
              case "AD2":
                this.processAd2(unit, note, blocks);
                break;
              case "SET":
                this.processSet(unit, note, blocks, instrument.units);
                break;
              case "MLT":
                this.processMlt(unit, note, blocks);
                break;
              case "ENV":
                this.processEnv(unit, note, blocks, currentTime);
                break;
              case "RAN":
                console.log("RAN: Not implemented");
                break;
              case "STR":
                console.log("STR: Not implemented");
                break;
              case "AD3":
                console.log("AD3: Not implemented");
                break;
              case "AD4":
                console.log("AD4: Not implemented");
                break;
              case "FLT":
                console.log("FLT: Not implemented");
                break;
              case "RAH":
                console.log("RAH: Not implemented");
                break;
              case "IOS":
                console.log("IOS: Not implemented");
                break;
            }
          }
        }
      } else if (currentTime > noteEndTime) {
        this.activeNotes.delete(noteNum);
      }
    }
    const rawSample = ((_a = blocks.get(1)) == null ? void 0 : _a[0]) || 0;
    const masterGain = 0.5;
    const finalSample = rawSample * masterGain;
    if (currentTime < 0.01 || Math.random() < 0.01) {
      console.log(`Sample at ${currentTime.toFixed(2)}s: Raw=${rawSample.toFixed(6)}, Gain=${masterGain}, Final=${finalSample.toFixed(6)}`);
    }
    return finalSample;
  }
  async generateSound(duration = 8) {
    try {
      const numSamples = Math.floor(this.sampleRate * duration);
      const outputBuffer = new Float32Array(numSamples);
      this.currentTime = 0;
      const blocks = /* @__PURE__ */ new Map([[1, new Float32Array(1)]]);
      this.activeNotes.clear();
      const eventsCopy = [...this.events];
      for (let i = 0; i < numSamples; i++) {
        const currentTimeInSeconds = i / this.sampleRate;
        while (eventsCopy.length > 0 && eventsCopy[0].time <= currentTimeInSeconds) {
          const event = eventsCopy.shift();
          this.processEvent(event, currentTimeInSeconds);
        }
        outputBuffer[i] = this.generateSample(currentTimeInSeconds, blocks);
        this.currentTime = currentTimeInSeconds;
      }
      return outputBuffer;
    } catch (error) {
      console.error("Error generating sound:", error);
      this.consoleOutput += `Error generating sound: ${error.message}
`;
      return new Float32Array(0);
    }
  }
  processEvent(event, currentTime) {
    switch (event.type) {
      case "note":
        const instrument = this.instruments.get(event.insNum);
        if (instrument) {
          const noteNum = Date.now() + Math.random();
          const instrumentCopy = JSON.parse(JSON.stringify(instrument));
          this.activeNotes.set(noteNum, {
            instrument: instrumentCopy,
            startTime: currentTime,
            duration: event.duration,
            frequency: event.frequency,
            amplitude: event.amplitude,
            p6: event.p6,
            p7: event.p7,
            p8: event.p8,
            p29: event.p29,
            p30: event.p30
          });
          console.log(`Note started: Instrument=${event.insNum}, Freq=${event.frequency}, Amp=${event.amplitude}`);
        } else {
          this.consoleOutput += `Error: Instrument ${event.insNum} not found
`;
        }
        break;
      case "sia":
        this.globalVars.set(event.varNum, event.value);
        if (event.varNum === 4) this.sampleRate = event.value;
        break;
      case "sv2":
        break;
      case "termination":
        this.activeNotes.clear();
        break;
    }
  }
  async initAudio() {
    if (!this.audioContext) {
      try {
        console.log("Initializing audio context...");
        if (this.isServer) throw new Error("Cannot initialize audio in server environment");
        this.audioContext = new AudioContext({ sampleRate: this.sampleRate, latencyHint: "interactive" });
        console.log("Audio context created with sample rate:", this.audioContext.sampleRate);
        if (this.audioContext.state === "suspended") {
          console.log("Audio context is suspended, attempting to resume...");
          await this.audioContext.resume();
          console.log("Audio context resumed successfully");
        }
        const workletUrl = "/musicVWorklet.js";
        console.log("Loading worklet from URL:", workletUrl);
        try {
          await this.audioContext.audioWorklet.addModule(workletUrl);
          console.log("Worklet module loaded successfully!");
        } catch (workletError) {
          console.error("Failed to load worklet module:", workletError);
          const fallbackUrl = "./musicVWorklet.js";
          console.log("Trying fallback URL:", fallbackUrl);
          await this.audioContext.audioWorklet.addModule(fallbackUrl);
          console.log("Worklet module loaded successfully from fallback URL!");
        }
        console.log("Creating AudioWorkletNode with processor name: music-v-processor");
        this.workletNode = new AudioWorkletNode(this.audioContext, "music-v-processor", {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          outputChannelCount: [1],
          processorOptions: { sampleRate: this.sampleRate }
        });
        this.workletNode.connect(this.audioContext.destination);
        console.log("AudioWorkletNode connected to destination");
        this.workletNode.onprocessorerror = (error) => {
          console.error("Worklet processor error:", error);
          this.consoleOutput += `Audio processing error: ${error.message || "Unknown error"}
`;
        };
        let terminationTime = 8;
        const terEvent = this.events.find((e) => e.type === "termination");
        if (terEvent) {
          terminationTime = terEvent.time;
          console.log(`Found termination time for init: ${terminationTime}s`);
        }
        console.log("Sending initialization data to worklet...");
        this.workletNode.port.postMessage({
          type: "init",
          events: this.events.map((e) => ({ ...e })),
          instruments: Object.fromEntries(this.instruments),
          functions: Array.from(this.functions).reduce((obj, [key, value]) => {
            obj[key] = Array.from(value);
            return obj;
          }, {}),
          sampleRate: this.sampleRate,
          terminationTime,
          masterGain: 0.5
        });
        console.log("Initialization data sent to worklet");
      } catch (error) {
        console.error("Failed to initialize audio:", error);
        this.consoleOutput += `Failed to initialize audio: ${error.message || "Unknown error"}
`;
        throw new Error(`Failed to initialize audio: ${error.message || "Unknown error"}`);
      }
    } else if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
      console.log("Existing audio context resumed");
    }
  }
  async play() {
    try {
      if (!this.audioContext) await this.initAudio();
      if (!this.audioContext || !this.workletNode) throw new Error("Audio system not properly initialized");
      if (this.audioContext.state === "suspended") {
        console.log("Resuming audio context for playback...");
        await this.audioContext.resume();
        console.log("Audio context resumed:", this.audioContext.state);
      }
      let terminationTime = 8;
      const terEvent = this.events.find((e) => e.type === "termination");
      if (terEvent) {
        terminationTime = terEvent.time;
        console.log(`Found termination time: ${terminationTime}s`);
      }
      console.log(`Sending ${this.events.length} events to worklet:`);
      this.events.forEach((e, i) => {
        console.log(`Event ${i}: ${e.type} at ${e.time}s: ${e.type === "note" ? `ins=${e.insNum}, freq=${e.frequency}, amp=${e.amplitude}, dur=${e.duration}` : ""}`);
      });
      this.workletNode.port.postMessage({
        type: "play",
        events: this.events.map((e) => ({ ...e })),
        currentTime: 0,
        terminationTime
      });
      console.log("Play command sent to audio worklet");
      this.consoleOutput += "Audio playback started\n";
    } catch (error) {
      console.error("Failed to start audio playback:", error);
      this.consoleOutput += `Failed to start audio playback: ${error.message || "Unknown error"}
`;
      throw new Error(`Failed to start audio playback: ${error.message || "Unknown error"}`);
    }
  }
  stop() {
    try {
      if (this.audioContext) {
        if (this.workletNode) {
          this.workletNode.port.postMessage({ type: "stop" });
        }
        this.audioContext.suspend();
        console.log("Audio playback stopped");
        this.consoleOutput += "Audio playback stopped\n";
      }
    } catch (error) {
      console.error("Failed to stop audio playback:", error);
      this.consoleOutput += `Failed to stop audio playback: ${error.message || "Unknown error"}
`;
    }
  }
  handleGenFunction(functionNum, genType, normalization, params) {
    const functionData = new Float32Array(512);
    if (genType === 0 || genType === 1) {
      const points = [];
      for (let i = 0; i < params.length; i += 2) {
        const value = params[i] || 0;
        const position = Math.floor(params[i + 1] || (i === params.length - 1 ? 511 : 0));
        if (position >= 0 && position < 512) {
          points.push({ position, value });
          this.consoleOutput += `  Point: val=${value}, pos=${position}
`;
        }
      }
      points.sort((a, b) => a.position - b.position);
      if (points.length < 2) {
        if (points.length === 0) {
          points.push({ position: 0, value: 0 });
          points.push({ position: 511, value: 0 });
        } else {
          points.push({ position: 511, value: points[0].value });
        }
      }
      for (let i = 0; i < points.length - 1; i++) {
        const startPoint = points[i];
        const endPoint = points[i + 1];
        const startPos = startPoint.position;
        const endPos = endPoint.position;
        const startVal = startPoint.value;
        const endVal = endPoint.value;
        for (let pos = startPos; pos <= endPos; pos++) {
          const t = endPos === startPos ? 0 : (pos - startPos) / (endPos - startPos);
          functionData[pos] = startVal * (1 - t) + endVal * t;
        }
      }
      this.consoleOutput += `Function table ${functionNum} created with ${points.length} points
`;
      console.log(`F${functionNum} sample values: [0]=${functionData[0]}, [50]=${functionData[50]}, [205]=${functionData[205]}, [306]=${functionData[306]}, [461]=${functionData[461]}, [511]=${functionData[511]}`);
    } else {
      for (let i = 0; i < 512; i++) {
        functionData[i] = Math.sin(2 * Math.PI * i / 512);
      }
      this.consoleOutput += `Warning: GEN type ${genType} not supported, using sine wave
`;
    }
    if (normalization > 0) {
      let minVal = Infinity;
      let maxVal = -Infinity;
      for (let i = 0; i < 512; i++) {
        minVal = Math.min(minVal, functionData[i]);
        maxVal = Math.max(maxVal, functionData[i]);
      }
      let normFactor = 1;
      if (normalization === 1) normFactor = Math.max(Math.abs(minVal), Math.abs(maxVal));
      else if (normalization === 2) normFactor = maxVal - minVal;
      if (normFactor !== 0) {
        for (let i = 0; i < 512; i++) {
          if (normalization === 1) functionData[i] /= normFactor;
          else if (normalization === 2) functionData[i] = (functionData[i] - minVal) / normFactor;
        }
      }
    }
    this.functions.set(functionNum, functionData);
    console.log(`Created function table F${functionNum} with ${functionData.length} points`);
  }
  getConsoleOutput() {
    return this.consoleOutput;
  }
  getFunctionTables() {
    return Array.from(this.functions.entries()).map(([functionNum, data]) => ({
      functionNum,
      data: Array.from(data)
    }));
  }
}
export {
  MusicV
};
//# sourceMappingURL=musicV.mjs.map
