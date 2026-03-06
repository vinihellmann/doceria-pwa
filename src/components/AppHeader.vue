<template>
  <header class="app-bar">
    <div class="container app-bar__inner">
      <RouterLink class="app-brand" to="/">
        <div class="app-brand__logo">🍬</div>
        <div>
          <h1>Doceria PWA</h1>
          <p>Protótipo local para doces e propostas</p>
        </div>
      </RouterLink>

      <nav class="nav-links">
        <RouterLink class="nav-link" to="/">Início</RouterLink>
        <RouterLink class="nav-link" to="/doces">Doces</RouterLink>
        <RouterLink class="nav-link" to="/propostas">Propostas</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
