# Scripts de Branding

Este diretório agrupa automações relacionadas à geração de ativos visuais do Concórdia.

## Pipeline

O pipeline atual está em `scripts/branding/pipeline/` e contém scripts Node.js para reconstruir exportações de marca.

## Uso sugerido

```bash
cd scripts/branding/pipeline
npm install
npm run rebuild
```

## Comandos disponíveis

- `npm run rebuild`
- `npm run derivatives`
- `npm run mobile`
- `npm run favicon`

> O repositório não mantém `node_modules` versionado.
> Alguns scripts atuais usam caminhos locais absolutos e devem ser ajustados antes de execução em outro ambiente.
