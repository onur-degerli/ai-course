import { loadJsonData, saveDataToJsonFile } from '../shared/utils';
import { generateEmbeddings } from '../shared/open-ai.service';
import { dotProduct } from '../shared/similarity.service';
import { join } from 'path';
import { existsSync } from 'fs';
import { CreateEmbeddingResponse } from 'openai/resources/embeddings';

type Movie = {
  name: string;
  description: string;
};

export type MovieWithEmbedding = Movie & {
  embedding: number[];
};

const inputFile = join(__dirname, '/data/movies.json');
const embeddingResultFile = join(__dirname, '/data/movies-embeddings.json');
const data = loadJsonData<Movie[]>(inputFile);

console.log('What movies do you like?');
console.log('...............');
process.stdin.addListener('data', async function (input) {
  let userInput = input.toString().trim();
  await recommendMovies(userInput);
});

async function recommendMovies(userInput: string) {
  const inputEmbedding = await generateEmbeddings(userInput);
  const movieEmbeddings = await getMovieEmbeddings();

  const moviesWithEmbeddings: MovieWithEmbedding[] = [];
  for (let i = 0; i < data.length; i++) {
    moviesWithEmbeddings.push({
      name: data[i].name,
      description: data[i].description,
      embedding: movieEmbeddings.data[i].embedding,
    });
  }

  const similarities: { input: string; similarity: number }[] = [];
  for (const movie of moviesWithEmbeddings) {
    const similarity = dotProduct(
      movie.embedding,
      inputEmbedding.data[0].embedding
    );
    similarities.push({
      input: movie.name,
      similarity,
    });
  }

  console.log(`If you like ${userInput}, we recommend:`);
  console.log('...............');
  const sortedSimilarity = similarities.sort(
    (a, b) => b.similarity - a.similarity
  );
  sortedSimilarity.forEach((similarity) => {
    console.log(`${similarity.input}: ${similarity.similarity}`);
  });
}

async function getMovieEmbeddings() {
  if (existsSync(embeddingResultFile)) {
    return loadJsonData<CreateEmbeddingResponse>(embeddingResultFile);
  }

  const movieEmbeddings = await generateEmbeddings(
    data.map((d) => d.description)
  );
  saveDataToJsonFile(movieEmbeddings, embeddingResultFile);
  return movieEmbeddings;
}
