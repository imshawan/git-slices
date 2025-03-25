# GitSlices

**GitSlices** is a CLI tool that allows you to pull specific folders from a remote Git repository and place them in your project. It works similarly to how `npm install` fetches packages, but instead, it fetches only the required folders from a repository.

## Features
- Pull specific folders from a remote Git repository.
- Place the folders into the desired destination in your project.
- Supports configuration files for multiple folder pulls.
- Works with both public and private repositories.
- Easy-to-use CLI interface.

## Installation

You can install **GitSlices** globally or locally.

### Global Installation
```sh
npm install -g git-slices
```
This allows you to use `git-slices` as a command-line tool from anywhere.

### Local Installation
```sh
npm install git-slices
```
This will add it as a dependency in your project, and you can run it via `npx`:
```sh
npx git-slices <repo-url> <folder-path> [destination-path]
```

## Usage

### Pulling a Single Folder
```sh
git-slices <repo-url> <folder-path> [destination-path]
```
#### Example
```sh
git-slices https://github.com/user/repo.git src/api src/api
```
This will:
- Clone the repository.
- Extract only `src/api`.
- Copy it to `src/api` in your current working directory.

If `destination-path` is not provided, it defaults to the same path as `folder-path`.

### Using a Config File for Multiple Folders
You can define a `config.json` file specifying multiple folders to pull:

```json
[
  { "path": "src/api", "destination": "src/api" },
  { "path": "src/utils", "destination": "src/shared/utils" }
]
```
Then run:
```sh
git-slices <repo-url> --config config.json
```

## Configuration Options
| Option | Description |
|--------|-------------|
| `<repo-url>` | URL of the Git repository to pull from. |
| `<folder-path>` | Path of the folder to pull. |
| `[destination-path]` | Destination path (defaults to `folder-path`). |
| `--config <file>` | Path to a configuration file for batch pulling. |

## Uninstall
To remove the package globally:
```sh
npm uninstall -g git-slices
```

To remove it from a local project:
```sh
npm uninstall git-slices
```

## License
MIT License

## Author
Shawan Mandal (<github@imshawan.dev>)

