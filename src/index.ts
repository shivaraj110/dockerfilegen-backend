import express, { Request, Response } from 'express'
import { GoogleGenAI } from "@google/genai";
import cors from 'cors'
import { configDotenv } from 'dotenv';
const app = express()
app.use(express.json())
app.use(cors())
configDotenv({ quiet: true })
app.get('/', (res: Response) => {
	res.send('Hello World!')
})


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req: Request, res: Response) => {
	const { framework } = req.body;
	const { database, orm } = req.body ?? { database: 'no', orm: 'no' };
	const { version } = req.body ?? { version: 'latest stable' };
	const llmResponse = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		config: {
			"systemInstruction": "you are a senior devops engineer and decides how the dockerfile would be written just by knowing the framework and other parameters like database and ORMs. Your job is to only respond with a precise dockerfile without any comments or explanations.",
			thinkingConfig: {
				thinkingBudget: 0,
			}
		},
		contents: `give an optimal docker file for a ${framework + " " + version + " version"} application with ${database + " database"} used with ${orm + " ORM"}. The dockerfile should be precise and only contain the dockerfile code.
Do not add any comments or explanations. in case of nodejs,do the same with assuming all scripts are available eg:dev,build & serve.`,

	});
	res.send(llmResponse.text);

});


app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000')
})
