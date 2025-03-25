#!/usr/bin/env node

import { pullFolder, processConfig } from "../src/index.js";
import { Command } from "commander";

const program = new Command();

program
    .version("1.0.0")
    .description("CLI to pull specific folders from a remote Git repository")
    .argument("<repo>", "GitHub or Git repository URL")
    .argument("[folder]", "Folder path to pull")
    .argument("[destination]", "Destination folder (default: same as folder name)")
    .option("--config <path>", "Path to JSON config file")
    .action((repo, folder, destination, options) => {
        if (options.config) {
            processConfig(repo, options.config);
        } else {
            pullFolder(repo, folder, destination);
        }
    });

program.parse(process.argv);