import OpenAI from 'openai';

const openAI = new OpenAI();

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content:
      'You are helpful flight asistant that gives information about the flights.',
  },
  {
    role: 'user',
    content: 'What are the flight options from FGH airport to NSD airport?',
  },
];

async function callFlightAsistant() {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: context,
    tool_choice: 'auto',
    tools: [
      {
        type: 'function',
        function: {
          name: 'findFlights',
          description: 'What flights are between FGH and NSD?',
          parameters: {
            type: 'object',
            properties: {
              departure: {
                type: 'string',
                description: 'Departure airport',
              },
              destination: {
                type: 'string',
                description: 'Destination airport',
              },
            },
            required: ['departure', 'destination'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'reserveFlight',
          description: 'Make a reservation by the given flight number.',
          parameters: {
            type: 'object',
            properties: {
              flightNumber: {
                type: 'string',
                description: 'Flight number',
              },
            },
            required: ['flightNumber'],
          },
        },
      },
    ],
  });

  const willInvokeFunction = response.choices[0].finish_reason === 'tool_calls';
  if (willInvokeFunction) {
    const toolCall = response.choices[0].message.tool_calls![0];
    const toolname = toolCall.function.name;

    if (toolname === 'findFlights') {
      const rawArguments = toolCall.function.arguments;
      const parsedArguments = JSON.parse(rawArguments);
      const toolResponse = findFlights(
        parsedArguments.departure,
        parsedArguments.destination
      );
      context.push(response.choices[0].message);
      context.push({
        role: 'tool',
        content: JSON.stringify(toolResponse),
        tool_call_id: toolCall.id,
      });
    }

    if (toolname === 'reserveFlight') {
      const rawArguments = toolCall.function.arguments;
      const parsedArguments = JSON.parse(rawArguments);
      const toolResponse = reserveFlight(parsedArguments.flightNumber);
      context.push(response.choices[0].message);
      context.push({
        role: 'tool',
        content: JSON.stringify(toolResponse),
        tool_call_id: toolCall.id,
      });
    }
  }

  const secondResponse = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: context,
  });

  console.log(secondResponse.choices[0].message.content);
}

function findFlights(departure: string, destination: string): string[] {
  const airlineCodes = [
    'AA',
    'BA',
    'DL',
    'LH',
    'AF',
    'EK',
    'QR',
    'TK',
    'UA',
    'WN',
  ];
  const numberOfFlights = Math.floor(Math.random() * 5) + 1;

  const flights: string[] = [];

  for (let i = 0; i < numberOfFlights; i++) {
    const airline =
      airlineCodes[Math.floor(Math.random() * airlineCodes.length)];
    const flightNumber = Math.floor(100 + Math.random() * 9000);
    flights.push(`${airline}${flightNumber} (${departure} → ${destination})`);
  }

  return flights;
}

function reserveFlight(flightNumber: string): string | 'FULLY_BOOKED' {
  console.log('random' + ((Math.floor(Math.random() * 10) + 1) % 2));
  if ((Math.floor(Math.random() * 10) + 1) % 2 === 0) {
    return '34346';
  }

  return 'FULLY_BOOKED';
}

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim();
  context.push({
    role: 'user',
    content: userInput,
  });

  await callFlightAsistant();
});
