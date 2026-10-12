# ChefArchive Web

Frontend Angular do ChefArchive. Ver `README.md` para stack, estrutura e como o deploy deste repositório funciona.

## Documentação centralizada do ChefArchive

A documentação de arquitetura de **todo** o ChefArchive (os 3 repositórios: `recipes`, `chefarchive-web`, `chefarchive-infra`) vive em [`ARCHITECTURE.md` no repositório `recipes`](https://github.com/FelipeFioreti/recipes/blob/main/ARCHITECTURE.md) — não neste repositório.

**Regra:** sempre que uma mudança aqui alterar como o sistema funciona ou é deployado — rede Docker, segredo, workflow de deploy/publicação de imagem, integração com outro repositório do ChefArchive — abra também um PR em `recipes` atualizando `ARCHITECTURE.md`. Não deixe a documentação centralizada dessincronizar do código.

Mudanças que só afetam a interface/lógica interna do frontend (um componente novo, um ajuste de estilo) não precisam disso.

Antes de qualquer commit, branch ou PR: siga as convenções descritas no `docs/git-best-practices.md` do `chefarchive-infra` (privado) — commits em português, Conventional Commits, sem assinatura de ferramenta. Branches de trabalho partem da `main` e o PR vai para a `release/X.Y.Z` da versão, nunca direto para a `main`. Criar a tag `vX.Y.Z` dispara o deploy: nunca crie nem envie tags sem pedido explícito.
