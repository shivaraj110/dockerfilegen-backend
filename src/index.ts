import express, { Request, Response } from 'express'
import { GoogleGenAI } from "@google/genai";
import cors from 'cors'
import { configDotenv } from 'dotenv';
const app = express()
app.use(express.json())
app.use(cors())
configDotenv({ quiet: true })
app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!')
})


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req: Request, res: Response) => {
	const { framework } = req.body;
	const llmResponse = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		config: {
			"systemInstruction": "you are a senior devops engineer and decides how the dockerfile look like just by knowing the framework. Your job is to only respond with a dockerfile",
			thinkingConfig: {
				thinkingBudget: 0,
			}
		},
		contents: `give a docker file for a ${framework} application with Postgres database used with prisma`,

	});
	res.send(llmResponse.text);

});



app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000')
})
