# m5live - Modern Music V Live Coding Environment

m5live is a modern web-based implementation of the classic Music V sound synthesis system, reimagined for live coding and real-time audio synthesis in the browser. This project brings the pioneering work of Max Mathews into the modern era with a user-friendly interface built on Nuxt.js.

## About Music V

Music V was one of the first computer music programs, developed by Max Mathews at Bell Labs in the 1960s. It introduced the concept of "unit generators" for sound synthesis, a paradigm that continues to influence digital audio workstations and synthesis environments today. The original Music V allowed composers to create sounds by specifying instruments as networks of unit generators and defining scores to play these instruments.

## Features

- **Live Coding Environment**: Write and execute Music V code in real-time
- **Web Audio Integration**: Uses the Web Audio API for high-quality, low-latency sound synthesis
- **Split Editor Interface**: Dedicated score editor and console output areas
- **Function Table Visualization**: Visual representation of waveforms and function tables
- **Keyboard Shortcuts**: Efficient workflow with keyboard commands for common operations
- **Mobile-Friendly**: Responsive design works on various devices
- **Help Documentation**: Built-in reference for Music V syntax and concepts

## Music V Implementation

m5live implements the core concepts of the original Music V system:

- **Instruments**: Define synthesis networks with unit generators
- **Unit Generators**: Basic building blocks like oscillators and outputs
- **Function Tables**: Store waveforms and other data for synthesis
- **Parameters**: Control various aspects of sound generation
- **Score Language**: Simple syntax for defining musical events

### Supported Unit Generators

- **OSC**: Oscillator with amplitude, frequency, and waveform controls
- **OUT**: Output unit for routing audio signals
- **ADD**: Add signals together
- **MUL**: Multiply signals
- **ENV**: Envelope generator

### Score Syntax

```
COM Define instrument 1
INS 1 1 ;
OSC P5 P6 B2 F2 P30 ;
OUT B2 B1 ;
END ;

COM Play a note
NOT 0 1 1 1 440 0.5 ;
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm, yarn, or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/m5live.git
cd m5live

# Install dependencies
npm install
# or
yarn install
# or
bun install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
bun run dev
```

The application will be available at `http://localhost:3000`.

### Production

```bash
# Build for production
npm run build
# or
yarn build
# or
bun run build

# Start production server
npm run start
# or
yarn start
# or
bun run start
```

## Usage Examples

1. **Simple Sine Wave**:
   ```
   COM Define a simple sine wave instrument
   INS 1 1 ;
   OSC P5 P6 B2 F1 ;
   OUT B2 B1 ;
   END ;
   
   COM Play a note at 440Hz for 2 seconds
   NOT 0 2 1 1 440 0.5 ;
   ```

2. **FM Synthesis**:
   ```
   COM FM synthesis instrument
   INS 1 1 ;
   OSC P7 P6 B3 F1 ;
   OSC P5 B3 B2 F1 ;
   OUT B2 B1 ;
   END ;
   
   COM Play a note with modulation
   NOT 0 2 1 1 440 0.5 5 1000 ;
   ```

## Keyboard Shortcuts

- **Ctrl+Enter**: Evaluate selected code
- **Ctrl+H**: Clear editor
- **Ctrl+?**: Show help

## Acknowledgements

This project is based on the pioneering work of Max Mathews and the original Music V system. It also draws inspiration from:

- Jean-Claude Risset's "Introductory Catalogue of Computer Synthesized Sounds"
- The MUSIC-N family of languages
- Modern live coding environments

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
