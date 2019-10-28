<template>
  <div class="TheHeader">
    <nav class="TheHeader_MainNav">
      <button class="TheHeader_IconButton" @click="openTreeDialog">
        <FontAwesomeIcon icon="search" size="lg" />
      </button>
      <a class="TheHeader_IconLink" href="/">
        <FontAwesomeIcon icon="home" size="lg" />
      </a>
    </nav>
    <span class="TheHeader_PageTitle">
      {{ title }}
    </span>
  </div>
</template>

<script>
import FontAwesomeIcon from './Common/FontAwesomeIcon.vue'
export default {
  name: 'TheHeader',
  components: {
    FontAwesomeIcon,
  },
  computed: {
    title() {
      return window.SCREEN_SPEC_MD.title
    },
  },
  methods: {
    openTreeDialog() {
      this.$emit('openTreeDialog')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/variable.scss';
.TheHeader {
  display: grid;
  grid-template-rows: $theHeaderHeight;
  grid-template-columns: 100px 1fr auto;
  position: relative;
  height: $theHeaderHeight;
  background-color: #2f6fad;
  &_MainNav {
    display: grid;
    grid-template-rows: $theHeaderHeight;
    grid-template-columns: 50px 50px;
    grid-column: 1 / 2;
    align-items: center;
  }
  &_IconLink {
    color: #ffffff;
    width: 50px;
    font-size: 12px;
    text-align: center;
  }
  &_IconButton {
    color: #ffffff;
    font-size: 12px;
    text-align: center;
    min-width: 50px;
    min-height: $theHeaderHeight;
    padding: 0;
    border: none;
    background: none;
    margin-right: 0;
  }
  &_PageTitle {
    display: block;
    color: #ffffff;
    font-size: 18px;
    line-height: $theHeaderHeight;
    padding: 0 0 0 20px;
    grid-column: 2 / 3;
  }
  &_NavForDeveloper {
    display: grid;
    grid-template-rows: $theHeaderHeight;
    grid-template-columns: 50px 50px;
    grid-column: 3 / 4;
    align-items: center;
  }
  &_Link {
    color: #ffffff;
    font-size: 14px;
    text-align: center;
  }
}
</style>
