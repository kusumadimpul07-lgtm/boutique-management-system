// Optional AI Assistant. Uses OpenAI's chat API if OPENAI_API_KEY is set.
// If the key is missing, the assistant simply reports itself as unavailable
// and the rest of the app keeps working normally.

// @desc    Check whether the AI Assistant is configured
// @route   GET /api/ai/status
const checkAIStatus = (req, res) => {
  res.json({ available: Boolean(process.env.OPENAI_API_KEY) });
};

const checkCustomerAIStatus = (req, res) => {
  res.json({ available: Boolean(process.env.OPENAI_API_KEY) });
};

// @desc    Send a message to the AI Assistant
// @route   POST /api/ai/chat
const chatWithAI = async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({
      available: false,
      reply:
        "AI Assistant is currently unavailable. Add an OPENAI_API_KEY in the backend .env file to enable this feature.",
    });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Please provide a message" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for a boutique/tailoring shop management system. Answer briefly and helpfully.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({
        message: "AI Assistant failed to respond. Please try again later.",
      });
    }

    const reply =
      data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : "Sorry, I could not generate a response.";

    res.json({ available: true, reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI Assistant is currently unavailable." });
  }
};

const chatWithCustomerAI = async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.json({
      available: false,
      reply:
        "Your style assistant is not configured yet. Please ask the BOUTIQ team for help.",
    });
  }

  try {
    const { message } = req.body;
    if (!message || !message.trim())
      return res.status(400).json({ message: "Please provide a message" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are BOUTIQ's warm, concise customer style assistant. Help with outfit ideas, fabrics, tailoring measurements, care instructions, delivery questions, and general payment guidance. Never claim to see private orders, payment records, staff data, or customer data. Never promise a price or delivery date; tell the customer to check their order page or contact the studio for confirmation.",
          },
          { role: "user", content: message.trim() },
        ],
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      if (
        response.status === 429 ||
        data.error?.code === "insufficient_quota"
      ) {
        return res
          .status(503)
          .json({
            message:
              "The style assistant has no API credits available. Add credits to the OpenAI account and try again.",
          });
      }
      return res
        .status(500)
        .json({
          message: "Style assistant failed to respond. Please try again later.",
        });
    }
    res.json({
      available: true,
      reply:
        data.choices?.[0]?.message?.content ||
        "Sorry, I could not generate a response.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Style assistant is currently unavailable." });
  }
};

module.exports = {
  chatWithAI,
  checkAIStatus,
  chatWithCustomerAI,
  checkCustomerAIStatus,
};
