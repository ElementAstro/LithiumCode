import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	console.log('插件已经被激活');

	// 注册命令 - 获取文件状态
	let commandOfGetFileState = vscode.commands.registerCommand('getFileState', (uri: vscode.Uri) => {
		const filePath = uri.path.substring(1);
		fs.stat(filePath, (err, stats) => {
			if (err) {
				vscode.window.showErrorMessage(`获取文件时遇到错误：${err}`);
				return;
			}

			if (stats.isDirectory()) {
				vscode.window.showWarningMessage(`检测的是文件夹，不是文件，请重新选择！！！`);
				return;
			}

			if (stats.isFile()) {
				const size = stats.size;
				const createTime = stats.birthtime.toLocaleString();
				const modifyTime = stats.mtime.toLocaleString();

				vscode.window.showInformationMessage(`
					文件大小为: ${size} 字节;
					文件创建时间为: ${createTime};
					文件修改时间为: ${modifyTime}
				`, { modal: true });
			}
		});
	});

	context.subscriptions.push(commandOfGetFileState);

	// 注册命令 - 获取文件内容
	let commandOfGetFileContent = vscode.commands.registerCommand('getFileContent', (uri: vscode.Uri) => {
		const filePath = uri.path.substring(1);

		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				vscode.window.showErrorMessage(`读取文件时遇到错误：${err}`);
				return;
			}

			vscode.window.showInformationMessage(`文件内容：\n\n${data}`, { modal: true });
		});
	});

	context.subscriptions.push(commandOfGetFileContent);
}

export function deactivate() {}
