Como rodar o codemod

1. Instalar jscodeshift `pnpm i -g jscodeshift`
2. Clonar esse repositório no root do projeto
3. Entrar no projeto clonado e executar `pnpm install ; pnpm build`
4. Voltar para a pasta root do seu projeto
5. Executar o seguinte comando `jscodeshift -t smart-migrate-imports-to-mui/bin/migrate-imports-to-mui.js {pasta-com-o-codigo-fonte}`
