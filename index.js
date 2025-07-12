const express = require('express');
const line = require('@line/bot-sdk');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

const client = new line.Client(config);
const app = express();

app.post('/webhook', line.middleware(config), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(async (event) => {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;

        // OpenAIに問い合わせ
        const completion = await openai.createChatCompletion({
          model: "gpt-4o-mini",  // もしくは "gpt-4o" など
          messages: [
            { role: "system", content: "あなたは親切なアシスタントです。" },
            { role: "user", content: userMessage },
          ],
          max_tokens: 500,
        });

        const replyText = completion.data.choices[0].message.content;
        console.log('OpenAI応答:', completion.data.choices[0].message.content);

        // LINEに返信
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: replyText,
        });
      }
    }));
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
