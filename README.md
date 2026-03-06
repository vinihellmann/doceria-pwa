# Doceria PWA

Estrutura inicial de um protótipo em **Vue 3 + Vite + PWA** para:

- cadastrar doces com foto, nome, valor, descrição e ingredientes
- montar propostas com doces selecionados
- salvar tudo em `localStorage`
- preparar a evolução para geração de PDF por proposta

## Como rodar

```bash
npm install
npm run dev
```

## Estrutura principal

```txt
src/
  components/
  composables/
  router/
  types/
  utils/
  views/
```

## O que já está pronto

- base Vue 3 com Router
- configuração PWA com `vite-plugin-pwa`
- CRUD inicial de doces
- CRUD inicial de propostas
- persistência com `localStorage`
- botão de instalar app
- aviso de atualização do service worker
- upload de imagem com preview

## O que está preparado para o próximo passo

- composable `useProposalPdf.ts` com interface pronta para implementação
- tela de detalhes da proposta
- estrutura de dados com snapshot dos doces na proposta
