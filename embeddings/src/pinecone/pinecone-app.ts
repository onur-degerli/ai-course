import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECODE_API_KEY!,
});

const pineconeIndex = pinecone.index<InfoType>('cool-index');

type InfoType = {
  info: string;
  reference: string;
  relevance: number;
};

const studentInfo = `Alexandra Thompson, a 19-year-old computer science sophomore with a 3.7 GPA,
is a member of the programming and chess clubs who enjoys pizza, swimming, and hiking
in her free time in hopes of working at a tech company after graduating from the University of Washington.`;

const clubInfo = `The university chess club provides an outlet for students to come together and enjoy playing
the classic strategy game of chess. Members of all skill levels are welcome, from beginners learning
the rules to experienced tournament players. The club typically meets a few times per week to play casual games,
participate in tournaments, analyze famous chess matches, and improve members' skills.`;

const universityInfo = `The University of Washington, founded in 1861 in Seattle, is a public research university
with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
As the flagship institution of the six public universities in Washington state,
UW encompasses over 500 buildings and 20 million square feet of space,
including one of the largest library systems in the world.`;

const dataToEmbed: InfoType[] = [
  {
    info: studentInfo,
    reference: 'a student 123',
    relevance: 0.9,
  },
  {
    info: clubInfo,
    reference: 'a club 123',
    relevance: 0.8,
  },
  {
    info: universityInfo,
    reference: 'a university 123',
    relevance: 0.7,
  },
];

async function storeEmbeddings() {
  await Promise.all(
    dataToEmbed.map(async (item, index) => {
      const embeddingResponse = await openAI.embeddings.create({
        model: 'text-embedding-3-small',
        input: item.info,
      });
      const embedding = embeddingResponse.data[0].embedding;

      await pineconeIndex.upsert([
        {
          id: `id-${index}`,
          values: embedding,
          metadata: item,
        },
      ]);
    })
  );
}

async function queryEmbeddings(question: string) {
  const questionResponse = await openAI.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
  });
  const questionEmbedding = questionResponse.data[0].embedding;
  const queryResponse = await pineconeIndex.query({
    vector: questionEmbedding,
    topK: 1,
    includeMetadata: true,
    includeValues: true,
  });

  return queryResponse;
}

async function askOpenAI(question: string, relevantInfo: string) {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0,
    messages: [
      {
        role: 'assistant',
        content: `Answer the next question using this information ${relevantInfo}`,
      },
      {
        role: 'user',
        content: question,
      },
    ],
  });

  const responseMessage = response.choices[0].message;
  console.log(responseMessage);
}

async function main() {
  // await storeEmbeddings();
  const question = 'What does Alexandra Thompson like to do in her free time?';
  const response = await queryEmbeddings(question);
  const relevantInfo = response.matches[0].metadata;

  if (relevantInfo) {
    await askOpenAI(question, relevantInfo.info);
  }
}

main();
