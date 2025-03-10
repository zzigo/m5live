#!/bin/bash

# Exit on error
set -e

echo "Starting pure static build process for Render..."

# Create output directory
echo "Creating output directory..."
mkdir -p .output/public

# Create a simple index.html
echo "Creating static index.html..."
cat > .output/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M5LIVE - Music V Live</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #1a1a1a;
            color: #fff;
        }
        h1 {
            color: #4CAF50;
            text-align: center;
            margin-bottom: 30px;
        }
        p {
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #4a148c;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #7b1fa2;
        }
        .container {
            background-color: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        code {
            background-color: #333;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }
        pre {
            background-color: #333;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <h1>M5LIVE - Music V Live</h1>
    
    <div class="container">
        <p>Welcome to M5LIVE, a web-based implementation of the classic Music V sound synthesis system.</p>
        <p>This is a temporary static page. The full interactive application is currently being deployed.</p>
        
        <h2>About Music V</h2>
        <p>Music V was one of the first computer music programs, developed by Max Mathews at Bell Labs in the 1960s. It introduced the concept of "unit generators" for sound synthesis, a paradigm that continues to influence digital audio workstations and synthesis environments today.</p>
        
        <h2>Sample Music V Code</h2>
        <pre>INS 0 2;
AD2 B6 P5 B3;
SET P8;
OSC B3 P7 B3 F3 P30;
OSC B3 P6 B6 F1 P29;
OUT B6 B1;
END;

NOT 1.5 2 0.08 440 5.0 0.5 0.3 4 ;
NOT 2 2 0.07 245 5.0 1.5 2 4 ;
TER 8 ;</pre>
        
        <p>Please check back soon for the full interactive version of M5LIVE.</p>
        
        <a href="https://github.com/zzigo/m5live" class="button">View on GitHub</a>
    </div>
</body>
</html>
EOF

# Create a simple favicon
echo "Creating favicon..."
cat > .output/public/favicon.ico << 'EOF'
EOF

echo "Static build completed successfully! Output is in .output/public" 