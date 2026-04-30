# Aluga.pt SaaS — Guia de Deploy

Stack: **Next.js 14 + Supabase + Vercel**  
Tempo estimado: **20–30 minutos**

---

## PASSO 1 — Criar projeto no Supabase (grátis)

1. Vai a https://supabase.com e cria conta
2. Clica em **New Project**
3. Dá um nome: `alugapt-saas`
4. Define uma password forte para a base de dados
5. Escolhe região: **West EU (Ireland)**
6. Clica **Create new project** e espera ~2 minutos

---

## PASSO 2 — Criar as tabelas (schema)

1. No painel do Supabase, vai a **SQL Editor**
2. Clica em **New query**
3. Copia e cola TODO o conteúdo do ficheiro `supabase/schema.sql`
4. Clica **Run** (botão verde)
5. Deverás ver: "Success. No rows returned"

---

## PASSO 3 — Obter as credenciais do Supabase

1. Vai a **Settings → API**
2. Copia:
   - **Project URL** → ex: `https://abcdef.supabase.co`
   - **anon public key** → começa com `eyJhb...`
3. Guarda estes dois valores — vais precisar no Passo 5

---

## PASSO 4 — Fazer upload do código para o GitHub

1. Vai a https://github.com e cria conta (se não tens)
2. Clica **New repository** → nome: `alugapt-saas` → **Create**
3. No teu computador, abre o terminal na pasta do projeto e corre:

```bash
git init
git add .
git commit -m "Aluga.pt SaaS v1"
git remote add origin https://github.com/O_TEU_USERNAME/alugapt-saas.git
git push -u origin main
```

---

## PASSO 5 — Deploy no Vercel (grátis)

1. Vai a https://vercel.com e cria conta com o GitHub
2. Clica **Add New Project**
3. Seleciona o repositório `alugapt-saas`
4. Em **Environment Variables**, adiciona:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhb...` |

5. Clica **Deploy** e espera ~2 minutos
6. O teu site estará em: `https://alugapt-saas.vercel.app`

---

## PASSO 6 — Criar a primeira conta

1. Abre o teu URL do Vercel
2. Vai a `/auth/signup`
3. Preenche o nome da empresa, email e password
4. Começa a usar! 🚀

---

## PASSO 7 — Domínio próprio (opcional, ~€10/ano)

1. Compra um domínio em https://namecheap.com ou https://namecheap.pt
2. No Vercel → **Settings → Domains** → Add domain
3. Segue as instruções para apontar o DNS

---

## Estrutura do Projeto

```
src/
  app/
    (protected)/          ← Páginas que precisam de login
      dashboard/          ← Visão geral do negócio
      inventory/          ← Gestão do inventário
      reservations/       ← Gestão de reservas
      clients/            ← CRM de clientes
      catalog-preview/    ← Preview do catálogo público
      settings/           ← Definições da empresa
    auth/
      login/              ← Página de login
      signup/             ← Registo de nova empresa
      callback/           ← OAuth callback
    catalog/[slug]/       ← Catálogo público (sem login)
  components/             ← Componentes reutilizáveis
  lib/
    supabase/             ← Clientes Supabase (browser + server)
    types.ts              ← TypeScript types
    utils.ts              ← Funções utilitárias
supabase/
  schema.sql              ← SQL para criar as tabelas
middleware.ts             ← Proteção de rotas
```

---

## Suporte

Precisas de ajuda? Pede ao Claude para:
- "Adiciona autenticação Google/Apple"
- "Integra o Stripe para pagamentos"
- "Cria um sistema de notificações por email"
- "Adiciona exportação de relatórios em PDF"
