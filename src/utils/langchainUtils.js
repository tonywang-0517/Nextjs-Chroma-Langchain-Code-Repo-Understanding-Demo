import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "langchain/vectorstores/chroma";

export const splitDocuments = (documents) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 50,
    });
    return textSplitter.splitDocuments(documents);
};

export const createRetriever = async (texts) => {
    const embeddings = new OpenAIEmbeddings();
    const db = await Chroma.fromDocuments(texts, embeddings);
    return db.asRetriever({ search_type: "mmr", search_kwargs: { k: 10 } });
};
