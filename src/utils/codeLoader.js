import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

/**
 * 加载代码库文件，并返回 LangChain 文档对象
 * @param {string} repoPath - 代码仓库路径
 * @param {string[]} extensions - 支持的文件扩展名
 * @returns {Promise<Document[]>} 返回文档数组
 */
export async function loadCodeFiles(repoPath, extensions = [".js", ".ts", ".tsx"]) {
    const loader = new DirectoryLoader(repoPath, {
        ...extensions.reduce((acc, ext) => {
            acc[ext] = (path) => new TextLoader(path);
            return acc;
        }, {}),
    });
    return await loader.load();
}
