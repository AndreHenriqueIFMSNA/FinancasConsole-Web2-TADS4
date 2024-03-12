const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const inquirer = require('inquirer');

var caminhoUsuario;
var usuario;

var voltarMenuPrincipal;

function run(username, funcaoMenuPrincipal) {
	const caminho = path.join('contas', username + '.json');

	if (fs.existsSync(caminho)) {
		caminhoUsuario = caminho;
		usuario = username;
		voltarMenuPrincipal = funcaoMenuPrincipal;
		dashboard();
	} else {
		throw new Exception('Usuário não existe!');
	}
}

function dashboard() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'opcao',
				message: 'Selecione a opção desejada:',
				choices: ['Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
			},
		])
		.then((respostas) => {
			const resp = respostas['opcao'];

			if (resp === 'Consultar Saldo') {
				consultaSaldo();
			} else if (resp === 'Depositar') {
				deposita();
			} else if (resp === 'Sacar') {
				saca();
			} else {
				voltarMenuPrincipal();
			}
		})
		.catch((err) => {
			console.log(err);
			voltarMenuPrincipal();
		});
}

function consultaSaldo() {
	const contaUsuario = JSON.parse(fs.readFileSync(caminhoUsuario));

	console.log(`Seja bem vindo o seu saldo é : R$${contaUsuario['saldo']}`);

	dashboard();
}

function deposita() {
	inquirer
		.prompt([
			{
				name: 'valor',
				message: 'Digite o valor que deseja depositar: ',
			},
		])
		.then((resposta) => {
			const valorDeDeposito = resposta['valor'];

			const dadosConta = JSON.parse(fs.readFileSync(caminhoUsuario));

			const novoSaldo = {
				type: Number,
				senha: dadosConta['senha'],
				saldo: dadosConta['saldo'] + parseFloat(valorDeDeposito),
			};

			fs.writeFileSync(caminhoUsuario, JSON.stringify(novoSaldo));
			console.log('Seu deposito foi realizado com sucesso.');

			dashboard();
		})
		.catch((err) => {
			console.log(err);
			dashboard();
		});
}

function saca() {
	inquirer
		.prompt([
			{
				name: 'saque',
				message: 'Digite o valor que deseja sacar: ',
			},
		])
		.then((resposta) => {
			const valorDeSaque = resposta['saque'];

			const dadosAntigos = JSON.parse(fs.readFileSync(caminhoUsuario));

			if (valorDeSaque > dadosAntigos['saldo']) {
				console.log(
					'Não foi possível realizar o saque, o saldo é insuficiente.'
				);
			} else {
				const novosDados = {
					senha: dadosAntigos['senha'],
					saldo: dadosAntigos['saldo'] - valorDeSaque,
				};

				fs.writeFileSync(caminhoUsuario, JSON.stringify(novosDados));
				console.log('Saque foi realizado com sucesso.');
			}
			dashboard();
		})
		.catch((err) => {
			console.log(err);
			dashboard();
		});
}

module.exports = run;
