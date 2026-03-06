<template>
  <section class="stack">
    <div class="page-head">
      <div>
        <h1>{{ isEditing ? 'Editar doce' : 'Novo doce' }}</h1>
        <p>Cadastro base do catálogo da doceria para uso posterior nas propostas.</p>
      </div>

      <RouterLink class="btn ghost" to="/doces">Voltar</RouterLink>
    </div>

    <form class="card stack" @submit.prevent="handleSubmit">
      <div class="form-grid two">
        <div class="field">
          <label for="name">Nome</label>
          <input id="name" v-model.trim="form.name" type="text" required placeholder="Ex.: Brigadeiro gourmet" />
        </div>

        <div class="field">
          <label for="price">Valor</label>
          <input
            id="price"
            v-model.number="form.price"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="0,00"
          />
        </div>
      </div>

      <div class="field">
        <label for="description">Descrição</label>
        <textarea
          id="description"
          v-model.trim="form.description"
          placeholder="Descreva o doce, o acabamento, a ocasião ideal..."
        />
      </div>

      <div class="field">
        <label for="image">Foto</label>
        <input id="image" type="file" accept="image/*" capture="environment" @change="handleImageChange" />

        <img v-if="form.imageDataUrl" :src="form.imageDataUrl" alt="Pré-visualização" class="preview-image" />
      </div>

      <div class="field">
        <label>Ingredientes</label>
        <div class="inline-input">
          <input
            v-model.trim="newIngredient"
            type="text"
            placeholder="Ex.: Leite condensado"
            @keydown.enter.prevent="addIngredient"
          />
          <button type="button" class="btn ghost" @click="addIngredient">Adicionar</button>
        </div>

        <div class="badges">
          <span v-for="ingredient in form.ingredients" :key="ingredient" class="badge">
            {{ ingredient }}
            <button type="button" @click="removeIngredient(ingredient)">×</button>
          </span>
        </div>
      </div>

      <div class="actions">
        <button class="btn primary" type="submit">Salvar doce</button>
        <RouterLink class="btn ghost" to="/doces">Cancelar</RouterLink>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCandies } from '@/composables/useCandies'
import { fileToDataUrl } from '@/utils/image'

const route = useRoute()
const router = useRouter()
const { getCandyById, saveCandy } = useCandies()

const candyId = computed(() => String(route.params.id || ''))
const isEditing = computed(() => !!candyId.value)

const currentCandy = isEditing.value ? getCandyById(candyId.value) : null

const form = reactive({
  name: currentCandy?.name ?? '',
  price: currentCandy?.price ?? 0,
  description: currentCandy?.description ?? '',
  ingredients: currentCandy?.ingredients ? [...currentCandy.ingredients] : [],
  imageDataUrl: currentCandy?.imageDataUrl ?? null as string | null
})

const newIngredient = ref('')

async function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  form.imageDataUrl = await fileToDataUrl(file)
}

function addIngredient() {
  if (!newIngredient.value) return
  if (form.ingredients.includes(newIngredient.value)) {
    newIngredient.value = ''
    return
  }

  form.ingredients.push(newIngredient.value)
  newIngredient.value = ''
}

function removeIngredient(ingredient: string) {
  form.ingredients = form.ingredients.filter((item) => item !== ingredient)
}

function handleSubmit() {
  saveCandy(
    {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      ingredients: form.ingredients,
      imageDataUrl: form.imageDataUrl
    },
    candyId.value || undefined
  )

  router.push('/doces')
}
</script>
