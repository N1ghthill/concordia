# Concórdia

> Concórdia — Sua comunidade não é um produto.

Concórdia é uma plataforma open-source de comunicação para comunidades que valorizam privacidade, autonomia e interoperabilidade.

## Visão e missão

A visão do projeto é fortalecer comunidades digitais livres de vigilância e dependência de plataformas fechadas.

A missão é entregar uma base técnica transparente, auditável e sustentável para comunicação em tempo real, com self-host opcional e API aberta para bots.

## Diferenciais

- Privacidade por padrão, com foco em minimização de dados.
- Transparência técnica, com arquitetura e decisões documentadas.
- Autonomia operacional, com opção de self-host.
- API aberta para integrações e bots sem lock-in.
- Governança open-source orientada à comunidade.

## Estado atual do projeto

Este repositório está na fase de fundação.

- Estrutura técnica e documental organizada.
- Diretrizes de contribuição, segurança e governança definidas.
- Sem código de aplicação neste momento (cliente e servidor ainda não implementados).

## Como rodar localmente

No estado atual, não há serviços de aplicação para executar.

1. Clone o repositório.
2. Entre na pasta do projeto.
3. Rode o validador de estrutura.

```bash
git clone https://github.com/<org>/concordia.git
cd concordia
bash scripts/check-structure.sh
```

## Estrutura principal

- `docs/`: documentação técnica e de governança.
- `assets/`: ativos de marca, arquivos fonte e pacotes de distribuição.
- `src/`: área reservada para módulos compartilhados.
- `server/`: área reservada para o backend.
- `client/`: área reservada para clientes oficiais.
- `packages/`: área reservada para pacotes reutilizáveis.
- `docker/`: artefatos de conteinerização e orquestração.
- `scripts/`: automações de manutenção e qualidade.

## Documentação

- `docs/README.md`
- `docs/architecture/README.md`
- `docs/api/README.md`
- `docs/security/README.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`
- `SECURITY.md`
- `CHANGELOG.md`
- `VERSIONING.md`
- `RELEASE.md`

## Contribuição

Consulte `CONTRIBUTING.md` antes de abrir issues ou pull requests.

Toda participação deve seguir `CODE_OF_CONDUCT.md`.

## Licença

Este projeto é distribuído sob a licença MIT. Veja `LICENSE`.

## Manifesto

Comunidades merecem infraestrutura digital confiável, transparente e controlável.

Concórdia existe para provar que comunicação em larga escala pode ser ética, aberta e tecnicamente rigorosa.
