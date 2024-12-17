import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const cloneRepo = async (repoUrl, branch = "") => {
    const repoName = repoUrl.split("/").pop()?.replace(".git", "") || "repo";
    const localPath = path.resolve("./repos", repoName);

    if (!fs.existsSync(localPath)) {
        const branchOption = branch ? `-b ${branch}` : "";
        execSync(`git clone ${branchOption} ${repoUrl} ${localPath}`);
    }

    return localPath;
};

export const generateProjectStructure = async (repoPath) => {
    const files = fs.readdirSync(repoPath, { withFileTypes: true });
    const structure = { directories: [], files: [] };

    for (const file of files) {
        const filePath = path.join(repoPath, file.name);
        if (file.isDirectory()) structure.directories.push(filePath);
        else structure.files.push(filePath);
    }

    return structure;
};
