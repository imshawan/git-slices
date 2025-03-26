import simpleGit from "simple-git";
import shell from "shelljs";
import path from "path";
import fs from "fs";

const git = simpleGit();
const cwd = process.cwd();
const isNT = process.platform === "win32";

/**
 * Pulls a specific folder from a remote Git repository into a local destination.
 *
 * @param {string} repoUrl - The URL of the remote Git repository.
 * @param {string} folderPath - The path of the folder within the repository to pull.
 * @param {string} destination - The local destination path where the folder should be copied. Defaults to the same folder path.
 * @returns {Promise<void>} - A promise that resolves when the folder has been successfully pulled.
 *
 * @throws {Error} - Throws an error if the folder is not found in the repository or if there is an issue during the pull process.
 */
export async function pullFolder(repoUrl, folderPath, destination) {
    console.log(`🔄 Pulling ${folderPath} from ${repoUrl}...`);

    const tempDir = path.join(cwd, ".git-temp");
    shell.rm("-rf", tempDir); // Clean temp dir
    shell.mkdir("-p", tempDir);

    try {
        await git.clone(repoUrl, tempDir, ["--depth", "1"]);

        const sourcePath = path.join(tempDir, folderPath);
        const destPath = path.resolve(cwd, destination || folderPath);

        if (!fs.existsSync(sourcePath)) {
            console.error(`❌ Folder "${folderPath}" not found in the repo.`);
            shell.rm("-rf", tempDir);
            process.exit(1);
        }

        shell.mkdir("-p", destPath);
        shell.cp("-R", (isNT ? sourcePath : `${sourcePath}/*`), destPath);
        console.log(`✅ Successfully pulled ${folderPath} into ${destPath}`);

        shell.rm("-rf", tempDir);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        shell.rm("-rf", tempDir);
        process.exit(1);
    }
}

/**
 * Pulls a specific folder from an SVN repository and exports it to a destination path.
 *
 * @param {string} repoUrl - The URL of the SVN repository.
 * @param {string} folderPath - The path of the folder within the repository to pull.
 * @param {string} [destination] - The destination path where the folder should be exported. Defaults to the folderPath.
 * @throws Will exit the process if SVN is not installed.
 */
export function pullFromSvn(repoUrl, folderPath, destination) {
    const svnUrl = repoUrl.replace("github.com", "github.com/") + `/trunk/${folderPath}`;
    console.log(`🔄 Pulling ${folderPath} from ${repoUrl} via SVN...`);

    if (!shell.which("svn")) {
        console.error("❌ SVN is not installed. Install it and try again.");
        process.exit(1);
    }

    const destPath = path.resolve(cwd, destination || folderPath); 
    shell.exec(`svn export ${svnUrl} ${destPath}`, { silent: false });

    console.log(`✅ Successfully pulled ${folderPath} into ${destPath}`);
}

/**
 * Processes the configuration file and pulls folders from the repository.
 *
 * @param {string} repoUrl - The URL of the repository.
 * @param {string} configPath - The path to the configuration file.
 * @param {boolean} useSvn - Flag indicating whether to use SVN for pulling folders.
 * @returns {Promise<void>} A promise that resolves when the process is complete.
 * @throws Will exit the process with code 1 if the config file is not found or is not an array.
 */
export async function processConfig(repoUrl, configPath, useSvn) {
    const absoluteConfigPath = path.resolve(cwd, configPath);

    if (!fs.existsSync(absoluteConfigPath)) {
        console.error(`❌ Config file "${absoluteConfigPath}" not found.`);
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(absoluteConfigPath, "utf8"));

    if (!Array.isArray(config)) {
        console.error("❌ Config file should contain an array of objects with 'path' and 'destination'.");
        process.exit(1);
    }

    for (const { path: folderPath, destination } of config) {
        const destPath = path.resolve(cwd, destination || folderPath);
        if (useSvn) {
            pullFromSvn(repoUrl, folderPath, destPath);
        } else {
            await pullFolder(repoUrl, folderPath, destPath);
        }
    }
}