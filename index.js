import express from 'express';
import line from '@line/bot-sdk';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new line.Client(config);
const app = express();

app.use(express.json());  // ここが重要！


app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    await Promise.all(
      req.body.events.map(async (event) => {
        if (event.type === 'message' && event.message.type === 'text') {
          const userMessage = event.message.text;

          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "あなたは親切なアシスタントです。" },
              { role: "user", content: userMessage },
            ],
            max_tokens: 500,
          });

          const replyText = completion.choices[0].message.content;

          await client.replyMessage(event.replyToken, {
            type: 'text',
            text: replyText,
          });
        }
      })
    );

    res.status(200).end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
});
