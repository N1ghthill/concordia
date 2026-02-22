#!/usr/bin/env bash
set -euo pipefail

required_dirs=(
  .github
  .github/ISSUE_TEMPLATE
  .github/workflows
  docs
  docs/architecture
  docs/api
  docs/security
  assets
  assets/branding
  assets/source-images
  assets/archives
  src
  server
  client
  packages
  docker
  scripts
  scripts/branding
)

required_files=(
  README.md
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  LICENSE
  SECURITY.md
  ROADMAP.md
  ARCHITECTURE.md
  CHANGELOG.md
  VERSIONING.md
  RELEASE.md
  .github/PULL_REQUEST_TEMPLATE.md
  .github/SUPPORT.md
  .github/dependabot.yml
  .github/workflows/repository-health.yml
  scripts/check-markdown.sh
)

echo "Validando estrutura do repositorio Concordia..."

for dir in "${required_dirs[@]}"; do
  if [[ -d "$dir" ]]; then
    echo "[OK] Diretorio: $dir"
  else
    echo "[ERRO] Diretorio ausente: $dir"
    exit 1
  fi
done

for file in "${required_files[@]}"; do
  if [[ -f "$file" ]]; then
    echo "[OK] Arquivo: $file"
  else
    echo "[ERRO] Arquivo ausente: $file"
    exit 1
  fi
done

echo "Estrutura validada com sucesso."
