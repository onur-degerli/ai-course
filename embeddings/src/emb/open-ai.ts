import OpenAI from 'openai';

const openAI = new OpenAI();

export type DataWithEmbeddings = {
  input: string;
  embedding: number[];
};

export async function generateEmbeddings(input: string | string[]) {
  const response = await openAI.embeddings.create({
    input: input,
    model: 'text-embedding-3-small',
  });

  return response;
}
