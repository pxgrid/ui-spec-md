<template>
  <div
    :style="{ left: styleLeft }"
    class="Separator"
    draggable="true"
    @drag="onDrag($event)"
    @dragstart="onDragStart($event)"
  />
</template>

<script>
export default {
  name: 'Separator',
  data() {
    return {
      styleLeft: '50%',
    }
  },
  mounted() {},
  methods: {
    onDragStart(e) {
      // ドラッグ中にブラウザが表示する半透明の要素を見せないようにするための対策
      e.target.style.opacity = 0
    },
    onDrag(e) {
      const eventX = e.x
      if (eventX <= 0) return
      e.target.style.opacity = 100

      const screenWidth = window.innerWidth
      const leftScreenRate = Math.min(Math.max(e.x / screenWidth, 0.2), 0.8)
      this.styleLeft = `${leftScreenRate * 100}%`
      this.$emit('drag', { leftScreenRate })
    },
  },
}
</script>

<style lang="scss" scoped>
.Separator {
  cursor: col-resize;
  position: absolute;
  z-index: 1;
  top: 48px;
  left: 50%;
  bottom: 0;
  width: 1px;
  padding: 0 5px;
  margin-left: -5px;
  &:after {
    content: '';
    display: block;
    height: 100%;
    background: #ccc;
    transition: all 0.1s;
  }
}
</style>
