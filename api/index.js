const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

bot.start((ctx) => ctx.reply("AI Bot is online! Ask me something."));

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  
  if (!process.env.GEMINI_API_KEY) {
    return ctx.reply("Missing Gemini API Key in Vercel settings!");
  }

  await ctx.sendChatAction('typing');

  try {
    // We specify the model explicitly
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    if (!text) {
        throw new Error("Empty response from AI");
    }

    await ctx.reply(text);
  } catch (error) {
    console.error("Detailed Error:", error);
    
    // Check if it's a location error
    if (error.message.includes("location is not supported")) {
        await ctx.reply("Error: Google Gemini is not available in your current Vercel region. Please change Vercel region to Washington D.C. (iad1).");
    } else {
        await ctx.reply(`Error: ${error.message.split('\n')[0]}`);
    }
  }
});

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body, res);
    } else {
      res.status(200).send('Bot is running properly.');
    }
  } catch (e) {
    res.status(500).send("Vercel Error");
  }
};
