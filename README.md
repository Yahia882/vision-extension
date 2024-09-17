# Vision Account Extension

This VS Code extension provides two main commands available through the command palette:

- **Login**: Allows you to log in to your Vision account using a username and password.
- **Sync**: Synchronizes the current code you're working on with your Vision account.

## Features

### 1. Login Command

The **Login** command prompts the user to enter their Vision account credentials (username and password) directly from the VS Code command palette.

- **How it works**:
  - When you run the `Login` command, you'll be prompted to enter your username and password.
  - The extension will send these credentials to the Vision API for authentication.
  - Upon successful login, your access and refresh tokens are securely stored in the global state of VS Code for future use.

### 2. Sync Command

The **Sync** command helps you synchronize the current code you are working on with your Vision account.

- **How it works**:
  - After logging in, you can run the `Sync` command to send the current open files or the entire workspace to your Vision account.
  - This allows you to back up or sync your code with the cloud for collaboration or storage purposes.

## How to Use

1. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type **Vision: Login** to log in with your Vision account.
   - Enter your username and password when prompted.
3. After successfully logging in, type **Vision: Sync** to synchronize your current project.

## Installation

1. Install the extension from the [VS Code Marketplace](#).
2. Open your VS Code, and use the command palette to run the available commands.

## Available Commands

| Command           | Description                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| **Vision: Login** | Prompts you to enter your Vision account credentials (username and password). |
| **Vision: Sync**  | Synchronizes your current workspace or open files with your Vision account.   |

## Requirements

- Node.js and npm (for development)
- A Vision account for using the login and sync features

## Contributing

Feel free to open issues or submit pull requests for any bugs or new features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
