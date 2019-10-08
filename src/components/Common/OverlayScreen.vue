<template>
  <transition name="fade">
    <section
      class="OverlayScreen"
      :class="{
        _transparent: transparent,
      }"
      @click.self="close"
    >
      <slot></slot>
    </section>
  </transition>
</template>

<script>
export default {
  name: 'OverlayScreen',
  props: {
    transparent: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.OverlayScreen {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.1);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-items: center;
  align-items: center;
  z-index: 20;
  user-select: none;
  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity 0.2s;
  }
  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
  }
  &._transparent {
    background-color: transparent;
  }
}
</style>
