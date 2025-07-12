const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();

// 必須: LINEのミドルウェアを使って、署名検証も行う
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log('✅ Webhook受信');
  res.status(200).end(); // ← これが絶対必要！
});

// ポートをRender用に動的に取得
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
});
