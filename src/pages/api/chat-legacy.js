// pages/api/chat.js
import OpenAI from "openai";
const openai = new OpenAI({
    organization: "org-",
    project: "",
    apiKey: '',
});
//better to use vector database to store the data
const TASK_MAPPING = {
    "Recommend Phone": (parameters) => {
        console.log('Recommend Phone function has been triggered')
        // TODO: Validate parameters, if parameters are missing, return the missing parameters and prompt the user to provide them.
        // query device gallery API to fetch related products information as context
        // Call GPT to recommend a phone based on context and user's input, and suggest the user provide more information for better recommendations.
        //return 'missing parameters: brand';
        const recommendedPhone = 'Phone X'; //device name can be from our API or gpt's idea.
        return `Recommended a cost-effective phone for you: ${recommendedPhone}`;
    },
    "Change Monthly Plan": (parameters) => {
        console.log('Change Monthly Plan function has been triggered')
        // TODO: Validate parameters, if parameters are missing, return the missing parameters and prompt the user to provide them.
        return 'Your monthly plan has been successfully changed.';
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const context = req.body.message;

    const prompt = `
You are an intelligent assistant. Please help interpret the user's requirements. The user input may include multiple intents and conditions. Please output in pure JSON format without any rich text or extra information. don't include something like '\`\`\`json',Below is the output template:
{
    "main_intent": "After understanding the customer's full context and judging the conditions, specify which task the system should execute. Be careful to judge the truthfulness of conditions and avoid doing things the user doesn't intend.",
    "parameters": "Parameters needed to execute the next main task, or null if none."
}
The value of main_intent includes: ${Object.keys(TASK_MAPPING).join(', ')}. If none of these matches the user's needs, return "Unknown Task."
Context: "${context}"`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            stream: false,
        });
        const parsedResult = JSON.parse(completion.choices[0].message.content);
        // Simulate task execution logic
        const taskResult = executeTask(parsedResult.main_intent, parsedResult.parameters);
        const replay = await generateFeedback(context, taskResult);

        res.status(200).json({ reply: replay });
    } catch (error) {
        res.status(500).json({ reply: JSON.stringify(error) });
    }
}

// Task mapping table

// Condition evaluation function
async function evaluateCondition(condition) {
    // TODO: Recursively decompose conditions into executable tasks via speech analysis. After querying valid information, evaluate the condition.
    return true; // Default condition is true
}

// Task execution function
function executeTask(task, parameters) {
    return TASK_MAPPING[task]?.(parameters) || 'No corresponding task';
}

// Dynamic feedback generation
async function generateFeedback(context, feedback) {
    // TODO: Based on context
    // Construct a prompt
    const prompt = `
    You are an intelligent assistant. Please help on replying user's message.
The context is: ${context}
The system response is: ${feedback}
if the system response is 'No corresponding task' just ignore it, otherwise please provide the information from the system response to the user.
Please chat with user in a friendly and helpful manner, and provide a response that is relevant to the user's needs. your most responsibility is
${Object.keys(TASK_MAPPING).join(', ')}'`;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            stream: false,
        });
        return completion.choices[0].message.content;

    } catch (error) {
        return JSON.stringify(error);
    }
}
