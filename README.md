# Simple Project Manager

![GitHub repo size](https://img.shields.io/github/repo-size/herlanassis/simple-project-manager)
![GitHub contributors](https://img.shields.io/github/contributors/herlanassis/simple-project-manager)
![GitHub stars](https://img.shields.io/github/stars/herlanassis/simple-project-manager?style=social)
![GitHub forks](https://img.shields.io/github/forks/herlanassis/simple-project-manager?style=social)
![GitHub issues](https://img.shields.io/github/issues-raw/herlanassis/simple-project-manager?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/herlanassis?style=social)

Simple Project Manager é um `sistema` que permite `o gestor de software` monitorar o seu `projeto de software` e ao `cliente` acompanhar a execução do seu `projeto`.

Este projeto foi produzido no Trabalho de Conclusão de Curso com o título <b>SPM: Uma Ferramenta para Gerenciamento de Projetos do Github Baseada em Técnicas de Mineração de Repositório de Software</b> com a orientação de Prof. Me. João Helis Junior de Azevedo Bernardo.

Para ver o projeto em funcionamento, acesse:
* [Aplicação Manager](https://www.youtube.com/watch?v=MIreat89-Iw);
* [Aplicação Client](https://www.youtube.com/watch?v=3rp5T3PX-JM);

## Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

* Você instalou a versão mais recente do `docker`?
* Você instalou a versão mais recente do `docker-compose`?
* Você criou uma aplicação no [Github](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)?
* Você criou uma aplicação no [Google](https://developers.google.com/identity/protocols/OAuth2)?
* Você criou/obteve um serviço de [SMTP](https://medium.com/@_christopher/how-to-send-emails-with-python-django-through-google-smtp-server-for-free-22ea6ea0fb8e)? `Dica: você pode utilizar o serviço de SMTP do Google.`
* Você criou um [bot no telegram](https://core.telegram.org/bots)?

## Instalando simple-project-manager

Para instalar o simple-project-manager, siga estes passos:

1. Clone o projeto;
```shell
git clone https://github.com/HerlanAssis/simple-project-manager;
cd simple-project-manager;
docker-compose up -d --build;
```

1. Crie um arquivo chamado `secrets.env` no diretório do projeto com as seguintes variáveis:
```
# Django - Necessário para o django
SECRET_KEY=<substituia_pelas_suas_variaveis>

# CACHE - Necessário para configurar o servidor de cache
CACHE_HOST=<substituia_pelas_suas_variaveis>
CACHE_PORT=<substituia_pelas_suas_variaveis>
CACHE_KEY_PREFIX=<substituia_pelas_suas_variaveis>

# DATABASE - Necessário para configurar o banco
PG_NAME=<substituia_pelas_suas_variaveis>
PG_USER=<substituia_pelas_suas_variaveis>
PG_HOST=<substituia_pelas_suas_variaveis>
PG_PASSWORD=<substituia_pelas_suas_variaveis>
PG_PORT=<substituia_pelas_suas_variaveis>

# MAIL - Necessário para enviar email
MAIL_HOST=<substituia_pelas_suas_variaveis>
MAIL_PORT=<substituia_pelas_suas_variaveis>
MAIL_USER=<substituia_pelas_suas_variaveis>
MAIL_PASS=<substituia_pelas_suas_variaveis>

# GITHUB - Necessário para a aplicação MANAGER
SOCIAL_AUTH_GITHUB_KEY=<substituia_pelas_suas_variaveis>
SOCIAL_AUTH_GITHUB_SECRET=<substituia_pelas_suas_variaveis>

# GOOGLE - Necessário para a aplicação CLIENT
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=<substituia_pelas_suas_variaveis>
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=<substituia_pelas_suas_variaveis>

# TELEGRAM - Necessário para o BOT do telegram
TELEGRAM_BOT_TOKEN=<substituia_pelas_suas_variaveis>
```

1. Crie os seguintes hosts na sua máquina:

```
server.simpleprojectmanager.site    = 127.0.0.1
manager.simpleprojectmanager.site   = 127.0.0.1
client.simpleprojectmanager.site    = 127.0.0.1
```

1. No projeto `Client`: 

acesse `src/constants/url.js` e configure

```javascript
export const TELEGRAM_BOT_URL = 'https://telegram.me/<seu_bot>';
```

acesse `src/constants/keys.js` e configure

```javascript
export const CLIENT_ID = '<google_client_id>';
```

1. No projeto `Manager`:

acesse `src/constants/url.js` e configure

```javascript
export const TELEGRAM_BOT_URL = 'https://telegram.me/<seu_bot>';
```

acesse `src/constants/keys.js` e configure

```javascript
export const CLIENT_ID = '<github_client_id>';
```

1. Por fim execute:
```shell
docker-compose up -d --build;
```

## Utilizando simple-project-manager

Para usar a aplicação Manager acesse [manager.simpleprojectmanager.site](manager.simpleprojectmanager.site) no seu navegador.

Para usar a aplicação Client acesse [client.simpleprojectmanager.site](client.simpleprojectmanager.site) no seu navegador.

Para usar o bot do telegram pesquise `@<nome_do_seu_bot>` no telegram.

## Contribuindo para simple-project-manager

Para contribuir com simple-project-manager, siga estes passos:

1. Faça um Fork desse repositório.
2. Crie uma branch: `git checkout -b <branch_name>`.
3. Faça suas mudanças e comite para: `git commit -m '<commit_message>'`
4. Push para a branch de origem: `git push origin simple-project-manager/<location>`
5. crie um pull request.

Como alternativa, consulte a documentação do GitHub em [criando uma pull request](https://help.github.com/pt/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Contribuidores

Agradeço às seguintes pessoas que contribuíram para este projeto:

* [@herlanassis](https://github.com/herlanassis)

## Contato

Se você quiser entrar em contato comigo, entre em contato com herlanassis@gmail.com.

## License
Este projeto usa a seguinte licença: [MIT license](https://choosealicense.com/licenses/mit/).
