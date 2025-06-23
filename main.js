document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('prompt-input');
    const terminal = document.getElementById('terminal');
    const history = document.getElementById('history');
    const neofetchTemplate = document.getElementById('neofetch-template');
    let currentPath = '~';

    // Objeto que fingimos ser o sistema de arquivos
    const fileSystem = {
        '~': {
            type: 'directory',
            children: {
                'projetos': {
                    type: 'directory',
                    children: {
                        '.diretorio_secreto': { 
                            type: 'directory', 
                            children: {
                                '.nao_entre': { 
                                    type: 'directory', 
                                    children: {
                                        '.ultimo_aviso': { 
                                            type: 'directory', 
                                            children: {
                                                'naoleia.txt': { type: 'file' }
                                            } 
                                        }
                                    }
                                }
                            }
                        },
                    }
                },
                'imagemfofa.jpg': { type: 'file' },
                'DiariodoDev.txt': { type: 'file' }
            }
        }
    };

});