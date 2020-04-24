<template>
  <div
    class="ActionButton"
    :class="{
      _small: small,
      _sub: sub,
      _selected: selected,
      _disabled: disabled,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    sub: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.ActionButton {
  $bg-base: #1a55a5;
  $bg-base-hover: #1a6fc3;
  $color-base: #fff;
  $color-border: #fff;
  $size-base: 12px;

  $bg-sub: #eee;
  $bg-sub-hover: #e2e2e2;
  $bg-sub-selected: #999;
  $color-sub: #5e5e5e;
  $color-sub-border: #ccc;
  $color-sub-selected: #fff;

  user-select: none;
  display: inline-flex;
  width: 140px;
  height: 32px;
  border: 1px solid $color-border;
  border-radius: 4px;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  background-color: $bg-base;
  color: $color-base;
  font-size: $size-base;
  cursor: pointer;

  &:hover {
    background-color: $bg-base-hover;
  }

  &:active {
    box-shadow: inset 0 3px 7px 0 rgba(0, 0, 0, 0.17);
  }

  > * {
    text-decoration: none;
    color: inherit;
    display: inline-flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  > button {
    color: inherit;
    border: inherit;
    border-radius: inherit;
    background-color: transparent;
    box-shadow: inherit;
    font: inherit;
  }

  &._sub {
    color: $color-sub;
    border: 1px solid $color-sub-border;
    background-color: $bg-sub;

    &._selected {
      background-color: $bg-sub-selected;
      color: $color-sub-selected;
    }

    &:hover {
      color: $color-sub;
      background-color: $bg-sub-hover;
    }
  }

  &._small {
    width: 104px;
    height: 32px;
    font-weight: bold;
  }

  &._disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.7;
  }
}
</style>
