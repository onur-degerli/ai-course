import { loadJsonData, saveDataToJsonFile } from './utils';
import { generateEmbeddings } from './open-ai';

export type DataWithEmbeddings = {
  input: string;
  embedding: number[];
};

async function main() {
  /* const inputFile = 'data.json';
  const outputFile = 'data-with-embeddings.json'; */

  const inputFile = 'data-2.json';
  const outputFile = 'data-with-embeddings-2.json';

  const data = loadJsonData<string[]>(inputFile);
  const embeddings = await generateEmbeddings(data);
  const dataWithEmbeddings: DataWithEmbeddings[] = [];
  for (let i = 0; i < data.length; i++) {
    dataWithEmbeddings.push({
      input: data[i],
      embedding: embeddings.data[i].embedding,
    });
  }

  saveDataToJsonFile(dataWithEmbeddings, outputFile);
}

main();
