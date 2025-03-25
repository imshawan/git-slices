import simpleGit from "simple-git";
import shell from "shelljs";
import path from "path";
import fs from "fs";

const git = simpleGit();
const cwd = process.cwd();

/**
 * Pulls a specific folder from a remote Git repository.
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
        shell.cp("-R", `${sourcePath}/*`, destPath);
        console.log(`✅ Successfully pulled ${folderPath} into ${destPath}`);

        shell.rm("-rf", tempDir);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        shell.rm("-rf", tempDir);
        process.exit(1);
    }
}

/**
 * Pulls a folder using SVN (GitHub only)
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
 * Reads the config file and processes multiple folder pulls.
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