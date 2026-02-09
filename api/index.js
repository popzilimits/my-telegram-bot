const { Telegraf } = require('telegraf');

// Get your token from @BotFather
const bot = new Telegraf(process.env.BOT_TOKEN);

// Simple commands
bot.start((ctx) => ctx.reply('Welcome! I am running on Vercel.'));
bot.help((ctx) => ctx.reply('Send me any message and I will echo it back.'));

// Echo logic
bot.on('text', (ctx) => {
  ctx.reply(`You said: ${ctx.message.text}`);
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Only handle POST requests from Telegram
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body, res);
    } else {
      res.status(200).send('Bot is running!');
    }
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).send('Error');
  }
};