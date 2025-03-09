export function useRandomPrompt() {
  /**
   * Parses a Music V score and generates random variations for GEN and NOT statements
   * while preserving the structure and instrument definitions.
   */
  function randomizeScore(score: string): string {
    if (!score || typeof score !== 'string') {
      return score;
    }

    const lines = score.split('\n');
    const result: string[] = [];

    for (let line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines or comments
      if (!trimmedLine || trimmedLine.startsWith('COM') || trimmedLine.startsWith('COMMENT')) {
        result.push(line);
        continue;
      }

      // Handle GEN statements
      if (trimmedLine.startsWith('GEN')) {
        result.push(randomizeGenStatement(line));
        continue;
      }

      // Handle NOT statements
      if (trimmedLine.startsWith('NOT')) {
        result.push(randomizeNotStatement(line));
        continue;
      }

      // Keep other lines unchanged
      result.push(line);
    }

    return result.join('\n');
  }

  /**
   * Randomizes a GEN statement while preserving the first 3 parameters
   * Creates random envelope points within the 512 sample timeframe
   */
  function randomizeGenStatement(genLine: string): string {
    const parts = genLine.split(/\s+/);
    
    // Preserve the first 3 parameters (GEN, table number, and function type)
    const prefix = parts.slice(0, 3).join(' ');
    
    // Determine how many points to generate (between 2 and 8)
    const numPoints = Math.floor(Math.random() * 7) + 2;
    
    // Generate random points with increasing time values
    const points: { time: number, value: number }[] = [];
    
    // Always start at time 0
    points.push({
      time: 0,
      value: (Math.random() * 2 - 1) // Value between -1 and 1
    });
    
    // Generate intermediate points
    for (let i = 1; i < numPoints - 1; i++) {
      points.push({
        time: Math.floor((i / (numPoints - 1)) * 511),
        value: (Math.random() * 2 - 1) // Value between -1 and 1
      });
    }
    
    // Always end at time 511
    points.push({
      time: 511,
      value: (Math.random() * 2 - 1) // Value between -1 and 1
    });
    
    // Sort points by time to ensure they're in order
    points.sort((a, b) => a.time - b.time);
    
    // Format the points as space-separated values
    const pointsStr = points.map(p => `${p.value.toFixed(3)} ${p.time}`).join(' ');
    
    return `${prefix} ${pointsStr};`;
  }

  /**
   * Randomizes a NOT statement while preserving the first 2 parameters
   * (time and instrument assignment)
   */
  function randomizeNotStatement(notLine: string): string {
    const parts = notLine.split(/\s+/);
    
    // Preserve the first 2 parameters (NOT, time, and instrument)
    const prefix = parts.slice(0, 3).join(' ');
    
    // Generate random values for the remaining parameters
    // Typically: duration, frequency, amplitude
    const duration = (Math.random() * 0.5 + 0.1).toFixed(2); // Duration between 0.1 and 0.6
    const frequency = Math.floor(Math.random() * 1000 + 100); // Frequency between 100 and 1100 Hz
    const amplitude = (Math.random() * 8 + 1).toFixed(2); // Amplitude between 1 and 9
    
    return `${prefix} ${duration} ${frequency} ${amplitude};`;
  }

  /**
   * Gets a random prompt from the prompts.json file
   * Kept for backward compatibility
   */
  async function getRandomPrompt() {
    try {
      const response = await fetch('/prompts.json');
      const prompts = await response.json();
      return prompts[Math.floor(Math.random() * prompts.length)];
    } catch (err) {
      console.error('Error loading prompts:', err);
      return "Imagine a novel musical instrument that combines traditional acoustics with objects from technic or nature...";
    }
  }

  return {
    getRandomPrompt,
    randomizeScore
  };
}
