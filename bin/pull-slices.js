#!/usr/bin/env node

/**
 * CLI to pull specific slices (folders) from a remote Git repository.
 * 
 * @file pull-slices.js
 * @author Shawan Mandal <github@imshawan.dev>
 * @version 1.0.0
 * @description This script uses Commander to create a CLI tool that pulls specific folders from a remote Git repository.
 * 
 * @module pull-slices
 * 
 * @requires ../src/index.js
 * @requires commander
 * @requires ../package.json
 * 
 * @example
 * // Run the CLI with the following command:
 * // node pull-slices.js <repo> [folder] [destination] --config <path>
 * 
 * @param {string} repo - GitHub or Git repository URL.
 * @param {string} [folder] - Folder path to pull.
 * @param {string} [destination] - Destination folder (default: same as folder name).
 * @param {Object} options - Options object.
 * @param {string} options.config - Path to JSON config file.
 * 
 * @function
 * @name action
 * @description Executes the pull operation based on provided arguments and options.
 * 
 * @returns {void}
 */

import { pullFolder, processConfig } from "../src/index.js";
import { Command } from "commander";
import pkg from "../package.json";

const program = new Command();

program
    .version(pkg.version)
    .description("CLI to pull specific slices (folders) from a remote Git repository")
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