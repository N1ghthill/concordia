# Versionamento

O Concórdia adota Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`.

## Regras

- `MAJOR`: mudancas incompativeis de API/contrato.
- `MINOR`: funcionalidades novas compativeis com versoes anteriores.
- `PATCH`: correcoes e ajustes compativeis.

## Estado atual

Enquanto o projeto estiver em `0.x`, mudancas podem ocorrer com maior frequencia, mas devemos manter previsibilidade e documentacao clara.

## Política de compatibilidade

- Toda mudança de contrato público deve ser registrada em `CHANGELOG.md`.
- Mudanças incompatíveis exigem justificativa técnica no PR e atualização de documentação.
- APIs para bots e integrações devem explicitar versão e ciclo de deprecação.

## Tags e releases

- As tags devem seguir o formato: `vMAJOR.MINOR.PATCH`.
- Cada release deve possuir nota no GitHub e entrada correspondente no `CHANGELOG.md`.

## Pré-releases

Quando necessário, utilizar sufixos SemVer para pré-release:

- `v1.2.0-alpha.1`
- `v1.2.0-beta.1`
- `v1.2.0-rc.1`

Pré-releases devem ser identificadas claramente nas notas de release.
