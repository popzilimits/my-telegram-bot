const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Bot and AI
const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

bot.start((ctx) => ctx.reply("Hi! I'm your AI assistant powered by Gemini. Ask me anything!"));

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  await ctx.sendChatAction('typing');

  try {
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();
    await ctx.reply(text);
  } catch (error) {
    // This will tell us EXACTLY what went wrong
    console.error("AI Error:", error);
    await ctx.reply(`Error logic: ${error.message.substring(0, 100)}`);
  }
});

// Vercel handler
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    await bot.handleUpdate(req.body, res);
  } else {
    res.status(200).send('AI Bot is active.');
  }
};

