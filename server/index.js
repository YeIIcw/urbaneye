import Fastify from 'fastify';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import fastifyFormBody from '@fastify/formbody';
import fastifyWs from '@fastify/websocket';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

// Retrieve the OpenAI API key from the environment variables
const { OPENAI_API_KEY, PORT = 5050 } = process.env;

if (!OPENAI_API_KEY) {
    console.error('Missing OpenAI API key. Please set it in the .env file.');
    process.exit(1);
}

// Initialize Fastify
const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

const SYSTEM_MESSAGE = 'You are a 911 dispatch officer assisting with emergencies.';
let convo = "";
let streamSid = null;
let emergency = 'undefined', callerName = 'undefined', location = 'undefined', number = 'undefined';

// Route to confirm the server is running
fastify.get('/', async (request, reply) => {
    reply.send({ message: '911 AI Responder is running!' });
});

// Handle incoming calls from Twilio
fastify.all('/incoming-call', async (request, reply) => {
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
    <Say>Please wait while we connect you to a 911 dispatcher AI assistant.</Say>
    <Pause length="1"/>
    <Say>Connected</Say>
    <Connect>
        <Stream url="wss://${request.headers.host}/media-stream" />
    </Connect>
  </Response>`;

    reply.type('text/xml').send(twimlResponse.trim());  // Ensure no extra spaces are sent
});


// WebSocket route for Twilio media stream
fastify.register(async (fastify) => {
    fastify.get('/media-stream', { websocket: true }, (connection, req) => {
        console.log('Client connected to WebSocket');

        const openAiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "OpenAI-Beta": "realtime=v1"
            }
        });

        openAiWs.on('open', () => {
            console.log('Connected to OpenAI Realtime API');
            sendSessionUpdate(openAiWs);
        });

        openAiWs.on('message', (data) => handleOpenAIMessage(data, connection));

        connection.on('message', (message) => handleTwilioMessage(message, openAiWs));
        connection.on('close', () => handleConnectionClose(openAiWs));
    });
});

// Send session update to the OpenAI API
const VOICE = 'alloy';  // Choose one from 'alloy', 'echo', or 'shimmer'

const sendSessionUpdate = (openAiWs) => {
    const sessionUpdate = {
        type: 'session.update',
        session: {
            turn_detection: { type: 'server_vad' },
            input_audio_format: 'g711_ulaw',
            output_audio_format: 'g711_ulaw',
            voice: VOICE,  // Use a supported voice
            instructions: SYSTEM_MESSAGE,
            modalities: ['text', 'audio'],
            temperature: 0.8,
        }
    };

    console.log('Sending session update:', JSON.stringify(sessionUpdate));
    openAiWs.send(JSON.stringify(sessionUpdate));
};


// Handle messages from OpenAI WebSocket
const handleOpenAIMessage = (data, connection) => {
  try {
      const response = JSON.parse(data);

      if (response.type === 'error') {
          console.error('OpenAI Realtime API Error:', response);
          return; // Stop further processing
      }

      if (response.type === 'response.audio.delta' && response.delta) {
          const audioDelta = {
              event: 'media',
              streamSid: streamSid,
              media: { payload: Buffer.from(response.delta, 'base64').toString('base64') }
          };
          connection.send(JSON.stringify(audioDelta));
      }

      console.log(`Received OpenAI event: ${response.type}`);
  } catch (error) {
      console.error('Error processing OpenAI message:', error, 'Raw message:', data);
  }
};


// Handle messages from Twilio WebSocket
const handleTwilioMessage = (message, openAiWs) => {
    try {
        const data = JSON.parse(message);

        switch (data.event) {
            case 'media':
                if (openAiWs.readyState === WebSocket.OPEN) {
                    const audioAppend = {
                        type: 'input_audio_buffer.append',
                        audio: data.media.payload
                    };
                    openAiWs.send(JSON.stringify(audioAppend));
                }
                break;
            case 'start':
                streamSid = data.start.streamSid;
                console.log('Incoming stream started:', streamSid);
                break;
            default:
                console.log('Received non-media event:', data.event);
                break;
        }
    } catch (error) {
        console.error('Error parsing Twilio message:', error, 'Message:', message);
    }
};

// Handle WebSocket connection closure
const handleConnectionClose = (openAiWs) => {
    if (openAiWs.readyState === WebSocket.OPEN) openAiWs.close();
    console.log('Connection closed with OpenAI API and client.');
};

// Start the Fastify server
fastify.listen({ port: PORT }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
});
