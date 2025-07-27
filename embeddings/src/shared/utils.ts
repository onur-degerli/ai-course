import { readFileSync, writeFileSync } from 'fs';

export function loadJsonData<T>(filePath: string): T {
  const rawData = readFileSync(filePath);
  return JSON.parse(rawData.toString());
}

export function saveDataToJsonFile(data: any, filePath: string) {
  const dataString = JSON.stringify(data);
  const dataBuffer = Buffer.from(dataString);
  writeFileSync(filePath, dataBuffer);
}
