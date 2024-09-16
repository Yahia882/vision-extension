// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const axios = require("axios")


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "hello" is now active!');

	let Register = vscode.commands.registerCommand('vision.Login', async ()=>{
		await register(context);
	});

	let sync = vscode.commands.registerCommand('vision.sync',async ()=>{
		await fetchDataWithAccessToken(context);
	} );

	context.subscriptions.push(Register,sync);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}

async function register(context) {

	const email = await vscode.window.showInputBox({
		prompt: 'Enter your email',
		placeHolder: 'email@example.com',
		validateInput: (input) => input ? null : 'Email cannot be empty'
	});

	if (!email) {
		vscode.window.showErrorMessage('Email is required!');
		return;
	}

	const password = await vscode.window.showInputBox({
		prompt: 'Enter your password',
		password: true,  // Mask input for password
		validateInput: (input) => input ? null : 'Password cannot be empty'
	});

	if (!password) {
		vscode.window.showErrorMessage('Password is required!');
		return;
	}

	try {
	
		const response = await axios.post('http://localhost:8000/auth/login/', {
			email: email,
			password: password
		});

		const accessToken = response.data.access;
		const refreshToken = response.data.refresh;

		await context.globalState.update('accessToken', accessToken);
		await context.globalState.update('refreshToken', refreshToken);

		vscode.window.showInformationMessage('Login successful! Tokens stored.');

	} catch (error) {
		vscode.window.showErrorMessage('Login failed! Check your credentials.');
		console.error(error);
	}
}



async function refreshAccessToken(context) {
    const refreshToken = context.globalState.get('refreshToken');

    if (!refreshToken) {
        vscode.window.showErrorMessage('No refresh token found. Please log in.');
        return null;
    }

    try {
     
        const response = await axios.post('http://localhost:8000/auth/refresh', {
            refresh_token: refreshToken
        });

        const newAccessToken = response.data.access;

        // Store the new access token
        await context.globalState.update('accessToken', newAccessToken);

        return newAccessToken;

    } catch (error) {
        vscode.window.showErrorMessage('Failed to refresh access token.');
        console.error(error);
        return null;
    }
}


async function fetchDataWithAccessToken(context) {
    let accessToken = context.globalState.get('accessToken');

    if (!accessToken) {
        vscode.window.showErrorMessage('No access token found. Please log in.');
        return;
    }

    try {
  
        const response = await axios.get('http://localhost:8000/vision/currentpage', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        vscode.window.showInformationMessage('Data fetched successfully!');
        writeContent(response.data) 

    } catch (error) {
        if (error.response && error.response.status === 401) {

            const newAccessToken = await refreshAccessToken(context);

            if (newAccessToken) {
      
                try {
                    const retryResponse = await axios.get('http://localhost:8000/vision/currentpage', {
                        headers: {
                            'Authorization': `Bearer ${newAccessToken}`
                        }
                    });

                    vscode.window.showInformationMessage('Data fetched successfully!');
                    console.log(retryResponse.data);

                } catch (retryError) {
                    vscode.window.showErrorMessage('Failed to fetch data after refreshing token. please login again.');
                    console.error(retryError);
                }
            }

        } else {
            vscode.window.showErrorMessage('Failed to fetch data. Please login again.');
            console.error(error);
        }
    }
}

function writeContent(code){


	const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;

	if (!workspaceFolder) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}


	for (const [filename, content] of Object.entries(code)) {
		const filePath = path.join(workspaceFolder, filename);


		fs.writeFile(filePath, content, (err) => {
			if (err) {
				vscode.window.showErrorMessage(`Failed to write file ${filename}.`);
				console.error(err);
				return;
			}
			console.log(`${filename} has been created successfully`);
		});
	}

	vscode.window.showInformationMessage('All files have been created successfully.');
}