#!/usr/bin/env bash
set -euo pipefail

status=0

echo "Validando arquivos Markdown..."

while IFS= read -r -d '' file; do
  if [[ ! -s "$file" ]]; then
    echo "[ERRO] Arquivo Markdown vazio: $file"
    status=1
  fi

  if grep -n $'\r' "$file" >/dev/null; then
    echo "[ERRO] Quebra de linha CRLF detectada: $file"
    status=1
  fi

  if grep -nE '[[:blank:]]+$' "$file" >/dev/null; then
    echo "[ERRO] Espaco em branco no final de linha: $file"
    status=1
  fi
done < <(find . -type f -name '*.md' -print0)

if [[ "$status" -ne 0 ]]; then
  echo "Falha na validacao de Markdown."
  exit 1
fi

echo "Markdown validado com sucesso."

