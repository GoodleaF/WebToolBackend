const OpenAI = require('openai');

async function chat(req, res) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const userMessage = req.body.prompt;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: 'user', content: userMessage }],
    });

    console.log(userMessage);
    res.json({text: chatCompletion.choices[0].message.content});
  } catch (error) {
    console.error('Error in OpenAI API request:', error);
    res.status(500).send('Error processing your request');
  }
}

module.exports = { chat };
