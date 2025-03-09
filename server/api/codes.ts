// server/api/codes.ts
import { defineEventHandler, readBody } from 'h3';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/codes.json');

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  } else if (event.node.req.method === 'POST') {
    const body = await readBody(event);
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');
    return { success: true };
  }
});