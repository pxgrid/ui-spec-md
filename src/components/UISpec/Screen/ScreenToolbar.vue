<template>
  <ul class="ScreenToolbar">
    <li class="ScreenToolbar_Item">
      <button
        :class="{ _disabled: isScreenFit }"
        class="ScreenToolbar_IconButton"
        @click="zoomOut()"
      >
        <FontAwesomeIcon icon="search-minus" size="1x" />
      </button>
    </li>
    <!--
    -->
    <li class="ScreenToolbar_Item">
      <output :class="{ _disabled: isScreenFit }" class="ScreenToolbar_Output">
        {{ zoomValue }}
      </output>
    </li>
    <!--
    -->
    <li class="ScreenToolbar_Item">
      <button
        :class="{ _disabled: isScreenFit }"
        class="ScreenToolbar_IconButton"
        @click="zoomIn()"
      >
        <FontAwesomeIcon icon="search-plus" size="1x" />
      </button>
    </li>
    <!--
    -->
    <li class="ScreenToolbar_Item">
      <button class="ScreenToolbar_IconButton" @click="zoomFit()">
        <FontAwesomeIcon icon="expand-arrows-alt" size="1x" />
      </button>
    </li>
    <!--
    -->
    <li class="ScreenToolbar_Item">
      <button class="ScreenToolbar_IconButton ScreenToolbar_Highlight" @click="toggleHighlight()">
        highlight
      </button>
    </li>
  </ul>
</template>

<script>
import FontAwesomeIcon from '../../Common/FontAwesomeIcon.vue'

export default {
  name: 'ScreenToolbar',
  components: {
    FontAwesomeIcon,
  },
  props: {
    zoomValue: {
      type: Number,
      required: true,
    },
    isScreenFit: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    zoomFit() {
      this.$emit('zoomFit')
    },
    zoomIn() {
      this.$emit('zoomIn')
    },
    zoomOut() {
      this.$emit('zoomOut')
    },
    toggleHighlight() {
      this.$emit('toggleHighlight')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../assets/variable.scss';
.ScreenToolbar {
  margin: 0;
  padding: 0;
  &_Item {
    line-height: 100%;
    display: inline-block;
  }
  &_IconButton {
    color: inherit;
    text-align: center;
    min-width: 30px;
    min-height: $navBarsHeight;
    padding: 0;
    border: none;
    background: none;
    margin-right: 0;
    &._disabled {
      pointer-events: none;
      cursor: default;
      opacity: 0.4;
    }
  }
  &_Output {
    font-size: 10px;
    display: block;
    text-align: center;
    width: 60px;
    height: $navBarsHeight;
    line-height: $navBarsHeight;
    background: #d6d6d6;
  }
  &_Highlight {
    padding: 0 10px;
    font-size: 12px;
  }
}
</style>
