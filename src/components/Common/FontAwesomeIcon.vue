<template>
  <FAIcon :icon="faIcon" :size="size" :spin="spin" :pulse="pulse" />
</template>

<script>
import { FontAwesomeIcon as FAIcon } from '@fortawesome/vue-fontawesome'
import {
  faHome,
  faEdit,
  faImage,
  faSearch,
  faSearchPlus,
  faSearchMinus,
  faPlusSquare,
  faMinusSquare,
  faTimes,
  faExpandArrowsAlt,
} from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'FontAwesomeIcon',
  components: {
    FAIcon,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: false,
      default: '1x',
    },
    spin: {
      type: Boolean,
      required: false,
      default: false,
    },
    pulse: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    faIcon() {
      switch (this.icon) {
        case 'close':
        case 'times':
          return faTimes
        case 'home':
          return faHome
        case 'edit':
          return faEdit
        case 'image':
          return faImage
        case 'search':
          return faSearch
        case 'search-plus':
          return faSearchPlus
        case 'search-minus':
          return faSearchMinus
        case 'plus-square':
          return faPlusSquare
        case 'minus-square':
          return faMinusSquare
        case 'expand-arrows-alt':
          return faExpandArrowsAlt
        default:
          return ''
      }
    },
  },
}
</script>
