import { defineEventHandler, readBody } from 'file:///Users/zztt/projects/22-m5live/25-m5live-nuxt/node_modules/h3/dist/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const filePath = path.resolve("data/codes.json");
const codes = defineEventHandler(async (event) => {
  if (event.node.req.method === "GET") {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  } else if (event.node.req.method === "POST") {
    const body = await readBody(event);
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), "utf-8");
    return { success: true };
  }
});

export { codes as default };
//# sourceMappingURL=codes.mjs.map
