const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  const event = req.body.events?.[0];
  if (!event || event.type !== 'message' || event.message.type !== 'text') {
    return res.sendStatus(200);
  }

  const userText = event.message.text;
  const replyToken = event.replyToken;

  try {
    const aiRes = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userText }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const replyText = aiRes.data.choices[0].message.content;

    await axios.post('https://api.line.me/v2/bot/message/reply', {
      replyToken,
      messages: [{ type: 'text', text: replyText }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.sendStatus(200);
  } catch (err) {
    console.error('エラー:', err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
