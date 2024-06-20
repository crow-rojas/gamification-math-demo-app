<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <p>
        This is an inline formula:
        <KaTeXRenderer :formula="'c = \\pm\\sqrt{a^2 + b^2}'" inline />
      </p>
      <p>
        And this is a block formula:
        <KaTeXRenderer :formula="'c = \\pm\\sqrt{a^2 + b^2}'" />
      </p>
    </div>
    <div>
      <KaTeXEditor />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import KaTeXRenderer from 'components/KaTeXRenderer.vue';
import KaTeXEditor from 'components/KaTeXEditor.vue';

defineOptions({
  name: 'IndexPage',
});
</script>
