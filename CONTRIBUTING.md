# Guia de Contribuicao

Obrigado por contribuir com o Concordia.

Este documento define o fluxo minimo para colaboracao tecnica com consistencia e previsibilidade.

## Principios

- Clareza antes de complexidade.
- Privacidade e seguranca como requisitos de base.
- Transparencia de decisoes tecnicas.
- Evolucao incremental com revisao publica.

## Como contribuir

1. Abra uma issue descrevendo problema, proposta ou melhoria.
2. Alinhe o escopo antes de implementar mudancas grandes.
3. Crie uma branch a partir da branch principal.
4. Envie um pull request com contexto tecnico e impactos.

## Pull requests

Cada pull request deve incluir:

- Objetivo claro.
- Motivacao da mudanca.
- Resumo tecnico do que foi alterado.
- Riscos conhecidos e plano de rollback (quando aplicavel).
- Atualizacao de documentacao relacionada.

## Padrao de qualidade

- Evite acoplamento desnecessario.
- Nao introduza dependencias externas sem discussao previa.
- Mantenha nomenclatura consistente e linguagem direta.
- Prefira mudancas pequenas e revisaveis.

## Commits

Recomendado:

```text
tipo(escopo): resumo curto
```

Exemplos de `tipo`: `docs`, `chore`, `feat`, `fix`, `refactor`.

## Versoes e releases

- Siga a politica em `VERSIONING.md`.
- Registre mudancas em `CHANGELOG.md`.
- Para publicar versao, siga `RELEASE.md`.

## Seguranca

Nao abra vulnerabilidades em issues publicas.

Use o fluxo definido em `SECURITY.md`.

## Conduta

Ao participar do projeto, voce concorda com `CODE_OF_CONDUCT.md`.
