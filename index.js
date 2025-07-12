const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();

// LINEの署名検証ミドルウェア
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log('✅ Webhook受信');

  // メッセージイベントごとに処理
  Promise.all(req.body.events.map(async (event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;
      const replyToken = event.replyToken;

      // 簡単な返信（echo）
      await client.replyMessage(replyToken, {
        type: 'text',
        text: `あなたは「${userMessage}」と言いましたね！`,
      });
    }
  }))
  .then(() => res.status(200).end())
  .catch((err) => {
    console.error('❌ 応答エラー:', err);
    res.status(500).end();
  });
});

// Renderでポートを取得
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
});
