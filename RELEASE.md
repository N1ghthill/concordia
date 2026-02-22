# Processo de Release

Este guia define o fluxo padrão para publicar uma nova versão do Concórdia.

## Pré-requisitos

- Pull requests de escopo do release já revisados e aprovados.
- `CHANGELOG.md` atualizado.
- Compatibilidade verificada conforme `VERSIONING.md`.
- Validações locais executadas.

## Checklist de preparação

1. Atualizar `CHANGELOG.md` com os itens da versão.
2. Confirmar tipo de versão (`MAJOR`, `MINOR`, `PATCH`).
3. Rodar verificações:

```bash
bash scripts/check-structure.sh
bash scripts/check-markdown.sh
```

4. Garantir que documentação afetada foi atualizada.

## Publicação

1. Criar tag da versão:

```bash
git tag vX.Y.Z
```

2. Publicar a tag:

```bash
git push origin vX.Y.Z
```

3. Criar release no GitHub associada à tag `vX.Y.Z`.
4. Copiar os principais pontos do `CHANGELOG.md` para as release notes.

## Pós-release

- Abrir ou atualizar seção `[Unreleased]` no `CHANGELOG.md`.
- Confirmar que links de comparação do changelog estão corretos.
- Comunicar release para a comunidade com resumo técnico objetivo.

## Responsabilidade

O release é uma responsabilidade de manutenção do projeto e deve priorizar:

- Transparência de mudanças.
- Previsibilidade de versão.
- Clareza para quem contribui e integra.
