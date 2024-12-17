import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadCodeFiles } from "../../utils/codeLoader";

export default async function handler(req, res) {
    try {
        const repoPath = "/Users/t832993/workSpace/online-web-shop/src";

        const rawDocs = await loadCodeFiles(repoPath);

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50,
        });
        const documents = await textSplitter.splitDocuments(rawDocs);

        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        await Chroma.fromDocuments(documents, embeddings, {
            collectionName: "online-web-shop",
            url: "http://localhost:8000",
        });

        res.status(200).json({ message: "Code repository ingested successfully!" });
    } catch (error) {
        console.error("Error ingesting code repository:", error);
        res.status(500).json({ error: "Failed to ingest code repository." });
    }
}
