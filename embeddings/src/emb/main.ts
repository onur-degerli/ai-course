import { loadJsonData, saveDataToJsonFile } from '../shared/utils';
import { generateEmbeddings } from '../shared/open-ai.service';
import { cosineSimilarity } from '../shared/similarity.service';
import { join } from 'path';

export type DataWithEmbeddings = {
  input: string;
  embedding: number[];
};

/* const inputFile = 'data.json';
const embeddingResultFile = 'data-with-embeddings.json';
const input = 'Cat'; // animal, cat */

const input = 'How old is John?';
const inputFile = join(__dirname, '/data/data-2.json');
const embeddingResultFile = join(
  __dirname,
  '/data/data-with-embeddings-2.json'
);

async function processEmbeddings() {
  const data = loadJsonData<string[]>(inputFile);
  const embeddings = await generateEmbeddings(data);
  const dataWithEmbeddings: DataWithEmbeddings[] = [];
  for (let i = 0; i < data.length; i++) {
    dataWithEmbeddings.push({
      input: data[i],
      embedding: embeddings.data[i].embedding,
    });
  }
  saveDataToJsonFile(dataWithEmbeddings, embeddingResultFile);
}

async function processSimilarity() {
  const dataWithEmbeddings =
    loadJsonData<DataWithEmbeddings[]>(embeddingResultFile);
  const inputEmbedding = await generateEmbeddings(input);
  const similarities: {
    input: string;
    similarity: number;
  }[] = [];

  for (const entry of dataWithEmbeddings) {
    const similarity = cosineSimilarity(
      entry.embedding,
      inputEmbedding.data[0].embedding
    );

    similarities.push({
      input: entry.input,
      similarity,
    });
  }

  console.log(`Similarity of ${input} with:`);
  const sortedSimilarities = similarities.sort(
    (a, b) => b.similarity - a.similarity
  );
  sortedSimilarities.forEach((similarity) => {
    console.log(`${similarity.input}: ${similarity.similarity}`);
  });
}

async function main() {
  await processEmbeddings();
  await processSimilarity();
}

main();
