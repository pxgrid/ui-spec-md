<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="UISP-Md" v-html="previewedHtml"></div>
  <!-- eslint-enable vue/no-v-html -->
</template>

<script>
export default {
  name: 'DocEditorPreview',
  props: {
    previewedHtml: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped></style>
