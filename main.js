document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('prompt-input');
    const terminal = document.getElementById('terminal');
    const history = document.getElementById('history');
    const neofetchTemplate = document.getElementById('neofetch-template');
    let currentPath = '~';

    // Objeto para simular o filesystem
    const fileSystem = {
        '~': {
            type: 'directory',
            hidden: false,
            children: {
                'projetos': {
                    type: 'directory',
                    hidden: false,
                    children: {
                        '.diretorioSecreto': { 
                            type: 'directory',
                            hidden: true, 
                            children: {
                                '.naoEntre': { 
                                    type: 'directory',
                                    hidden: true, 
                                    children: {
                                        '.ultimoAviso': { 
                                            type: 'directory',
                                            hidden: true, 
                                            children: {
                                                '.naoleia.txt': { 
                                                    type: 'file', 
                                                    hidden: true, 
                                                    content: 'Já que você teve o trebalho de chegar aqui, vale uma nota 10 né?' 
                                                }
                                            } 
                                        }
                                    }
                                }
                            }
                        },
                        'github': {
                            type: 'directory',
                            hidden: false,
                            children: {
                                'Under_construction_check_later.txt': { 
                                    type: 'file', 
                                    hidden: false, 
                                    content: 'Este projeto está em construção, volte mais tarde!' 
                                }
                            }
                        }
                    }
                },
                'imagemFofa.jpg': { 
                    type: 'file', 
                    hidden: false, 
                    content: '<img src="/pictures/imagemfofa.webp" class="photo">' 
                },
                'DiariodoDev.txt': { 
                    type: 'file', 
                    hidden: false, 
                    content: 'No primeiro dia, eu desisti. No segundo dia, eu desisti de desistir. No terceiro dia, eu desisti de desistir de desistir. Mas no quarto dia, eu desisti de desistir de desistir de desistir.' 
                }
            }
        }
    };

    // Entra na edição do input ao clicar no site. Tentei  implementar, mas não funcionou no meu browser 🫠. Vou deixar no código, vai que funciona com você ;)
    document.body.addEventListener('click', () => input.focus());
    input.focus();

    // Carrega o neofetch na inicialização
    executeCommand('neofetch');

    input.addEventListener('keydown', function(event) {
        if (event.key === "Enter") { //Aguarda o meu enter
            const command = input.value.trim();
            if (command) {
                // Cria um registro do comando digitado
                const commandOutput = document.createElement('div');
                commandOutput.classList.add('prompt');
                commandOutput.innerHTML = `<span class="prompt-text"><span class="green">client@Neug.zone</span><span class="cyan"> ${currentPath} $ </span></span><span class="output">${command}</span>`;
                history.appendChild(commandOutput);

                executeCommand(command);

                // Limpa o input
                input.value = "";
            }
             // Rola para o final
            window.scrollTo(0, document.body.scrollHeight);
        }
    });

    function executeCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        const output = document.createElement('div');
        output.classList.add('output');

        switch (cmd) { //Logica dos comandos
            case 'neofetch':
                const neofetchClone = neofetchTemplate.firstElementChild.cloneNode(true);
                output.appendChild(neofetchClone);
                break;
            case 'ls':
                const pathParts = currentPath.replace('~', '').split('/').filter(p => p);
                let currentDir = fileSystem['~']; // Variáveis usadas para navegar no filesystem simulado
                try {
                    if (parts[1]==="-a") {
                        pathParts.forEach(part => {
                            /*Para inodes visǘeis*/
                        if (currentDir.children && currentDir.children[part] && currentDir.children[part].type === 'directory') {
                            currentDir = currentDir.children[part];
                        } else {
                            throw new Error(`Nenhum inode encontrado em ${part}`);
                        }
                    });
                    }
                    //Para inodes ocultos
                    else{
                        pathParts.forEach(part => {
                        if (currentDir.children && currentDir.children[part] && currentDir.children[part].type === 'directory'&& currentDir.children[part].hidden) {
                            currentDir = currentDir.children[part];
                        } else {
                            throw new Error(`Nenhum inode encontrado em ${part}`);
                        }
                    });
                    }
                    // Lista os arquivos e diretórios no caminho atual
                    const items = Object.keys(currentDir.children);
                    if (items.length === 0) {
                        output.textContent = '';
                    } else {
                         items.forEach(item => {
                            const itemEl = document.createElement('span');
                            if (currentDir.children[item].type === 'directory') {
                                itemEl.classList.add('directory');
                                itemEl.textContent = `${item}/`;
                            } else {
                                itemEl.textContent = item;
                            }
                            itemEl.style.marginRight = '15px';
                            output.appendChild(itemEl);
                        });
                    }
                } catch (e) {
                     output.textContent = `ls: ${e.message}`;
                }
                break;
            case 'cd':
                //Lógica para mudar de diretório
                const targetDir = args[0] || '~';
                 if (targetDir === '..') {
                    if (currentPath !== '~') {
                        const pathParts = currentPath.split('/');
                        pathParts.pop();
                        currentPath = pathParts.join('/') || '~';
                    }
                } else if (targetDir === '~' || targetDir === '') {
                     currentPath = '~';
                } else {
                     const pathParts = currentPath.replace('~', '').split('/').filter(p => p);
                     let currentDir = fileSystem['~'];
                     pathParts.forEach(part => currentDir = currentDir.children[part]);

                     if (currentDir.children && currentDir.children[targetDir] && currentDir.children[targetDir].type === 'directory') {
                         currentPath = currentPath === '~' ? `~/${targetDir}` : `${currentPath}/${targetDir}`;
                     } else {
                         output.textContent = `cd: diretório não encontrado: ${targetDir}`;
                     }
                }
                 // Atualiza o prompt
                document.querySelector('#active-prompt .prompt-text .cyan').textContent = ` ${currentPath} $ `;
                break;
            case 'clear':
                history.innerHTML = '';
                break;
            case 'help':
                output.innerHTML = `Comandos disponíveis:<br>
                <span class="cyan">neofetch</span> - Exibe informações do sistema.<br>
                <span class="cyan">ls</span> - Lista arquivos e diretórios.<br>
                <span class="cyan">| ls -a</span> - Lista arquivos e diretórios, incluindo os ocultos.<br>
                <span class="cyan">cd [dir]</span> - Navega entre diretórios.<br>
                <span class="cyan">clear</span> - Limpa o histórico do terminal.<br>
                <span class="cyan">help</span> - Mostra esta ajuda.`;
                break;
            case 'cat':
                const fileName = args[0];
                if (!fileName) {
                    output.textContent = 'cat: arquivo não especificado';
                    break;
                }
                try {
                    const pathParts = currentPath.replace('~', '').split('/').filter(p => p);
                    let currentDir = fileSystem['~'];
                    pathParts.forEach(part => {
                        if (currentDir.children && currentDir.children[part] && currentDir.children[part].type === 'directory') {
                            currentDir = currentDir.children[part];
                        } else {
                            throw new Error(`Nenhum inode encontrado em ${part}`);
                        }
                    });
                    if (currentDir.children && currentDir.children[fileName] && currentDir.children[fileName].type === 'file') {
                        const file = currentDir.children[fileName];
                        //Lista tanto texto, como imagens
                        output.innerHTML = file.content;
                    } else {
                        output.textContent = `cat: arquivo não encontrado: ${fileName}`;
                    }
                } catch (e) {
                    output.textContent = `cat: ${e.message}`;
                }
                break;
            default:
                output.textContent = `Comando não encontrado: ${cmd}. Digite 'help' para ver a lista de comandos.`;
        }

        if (output.hasChildNodes() || output.textContent) {
            history.appendChild(output);
        }
    }
});