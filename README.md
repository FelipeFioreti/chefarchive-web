# ChefArchive Web

Frontend Angular standalone para o backend [`recipes`](https://github.com/FelipeFioreti/recipes) (`Recipes.Api`).

## Stack

- Angular 21.2.21
- Standalone components
- Lazy loading por rota
- Signals para estado de sessao
- SCSS com tema editorial responsivo

## Scripts

- `npm install`
- `npm start`
- `npm run build`

## Estrutura

- `src/app/core`: autenticacao, guards, interceptors, modelos e servicos globais
- `src/app/layout`: cascas da aplicacao autenticada e telas publicas
- `src/app/shared`: componentes reutilizaveis
- `src/app/entities`: dominios da interface (`admin/unit`, `auth`, `home`, `recipes/{category,recipe}`)

## Integracao local

O `proxy.conf.json` encaminha chamadas `/api` para `http://localhost:5184`. Ajuste o alvo se o backend estiver exposto
em outra porta.

## Repositorios relacionados

- [`FelipeFioreti/recipes`](https://github.com/FelipeFioreti/recipes) — backend ASP.NET Core (API + migrations)
- [`FelipeFioreti/chefarchive-infra`](https://github.com/FelipeFioreti/chefarchive-infra) — docker compose de producao, nginx de borda e runbook (privado)
