import { d as defineEventHandler, r as readBody } from '../../nitro/nitro.mjs';
import fs from 'fs/promises';
import path from 'path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

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
