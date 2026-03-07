import { GoogleGenerativeAI } from "@google/generative-ai";

function extractJSONArray(text) {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');

    if (start !== -1 && end !== -1) {
        return text.substring(start, end + 1);
    }

    return null;
}

export const aiContent = async (userPrompt, type) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    let promptText = '';
    if (type === 'paragraph') {
        promptText = `
You are a professional blog writer.

Write a detailed, high-quality blog paragraph based on the following details:

Details: "${userPrompt}"

Instructions:
- Write in a clear and engaging blog style.
- Make it informative and easy to understand.
- Use 120-180 words.
- Do NOT include headings.
- Do NOT include markdown formatting.
- The paragraph should feel like part of a professional blog article.
`;
    } else if (type === 'code') {
        promptText = `
You are a professional programming educator writing a blog.

Generate a code example based on the following details.

Details: "${userPrompt}"

Instructions:
- Provide clean and correct code.
- Include a short explanation before the code.
- Use proper formatting.
- The code should be beginner-friendly.
- Keep explanation under 80 words.
`;
    } else if (type === 'quote') {
        promptText = `
Generate a powerful quote based on the following details.

Details: "${userPrompt}"

Instructions:
- The quote should be inspiring or thought-provoking.
- Keep it under 30 words.
- Make it suitable for a blog highlight section.
- Do NOT include quotation marks in the output.
`;
    } else if (type === 'tag') {
        promptText = `
You are an expert blog SEO assistant.

Generate relevant tags for a blog post based on the given title.

Title: "${userPrompt}"

Instructions:
- Generate 5 to 10 highly relevant tags
- Tags should represent the main topics of the blog
- Use short keyword-style tags (1-3 words)
- Avoid repeating words from the title unless important
- Focus on SEO-friendly keywords

Strictly return the output ONLY as a JSON array.

Example:
["Artificial Intelligence", "Machine Learning", "AI Tools", "Future Technology"]
`;
    }
    try {
        console.log(promptText);
        console.log(userPrompt,type);
        const result = await model.generateContent(promptText);
        const response = await result.response;
        let text = response.text();
        console.log(text);
        if (type === 'tag') {
            const jsonPart = extractJSONArray(text);
            text = JSON.parse(jsonPart);
        }
        return text;

    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error(`Failed to generate ${type}`);
    }
};