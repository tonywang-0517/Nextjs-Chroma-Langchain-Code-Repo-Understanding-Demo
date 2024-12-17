import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

export async function loadCodeFiles(repoPath, extensions = [".js", ".ts", ".tsx"]) {
    const loader = new DirectoryLoader(repoPath, {
        ...extensions.reduce((acc, ext) => {
            acc[ext] = (path) => new TextLoader(path);
            return acc;
        }, {}),
    });

    // 加载文件
    const allFiles = await loader.load();

    // 排除以 `.test.tsx` 和 `.graphql.ts` 结尾的文件

    return allFiles.filter(
        (file) =>
            !file.metadata.source.endsWith(".test.tsx") &&
            !file.metadata.source.endsWith(".graphql.ts") && !file.metadata.source.endsWith(".test.ts")
    );
}