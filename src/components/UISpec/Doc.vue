<template>
  <div :style="{ width: width }" class="Doc">
    <nav class="Doc_NavBar">
      <ul class="Doc_NavBarTools">
        <li class="Doc_NavBarToolItem">
          <button v-if="editable" class="Doc_NavBarIconButton" @click="toggleShowEditor">
            <FontAwesomeIcon icon="edit" size="1x" />
          </button>
        </li>
      </ul>
      <ul class="Doc_Info">
        <li class="Doc_InfoItem">
          LastUpdate: {{ dateFormat(updatedDate) }} {{ updatedAuthorName }}
        </li>
        <li class="Doc_InfoItem">Created: {{ dateFormat(createdDate) }} {{ createdAuthorName }}</li>
      </ul>
    </nav>
    <div v-show="!showEditor" class="Doc_Inner">
      <!-- eslint-disable vue/no-v-html -->
      <div ref="doc" class="UISP-Md" v-html="convertedHtml"></div>
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <div v-if="editable" v-show="showEditor" class="Doc_Editor">
      <DocEditor
        class="Doc_DocEditor"
        :headlineIndex="headlineIndexToEdit"
        @openTreeDialog="openTreeDialog"
        @closeEditor="closeEditor"
      ></DocEditor>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '../Common/FontAwesomeIcon.vue'
import DocEditor from './DocEditor/ConnectedDocEditor'
export default {
  name: 'Doc',
  components: {
    FontAwesomeIcon,
    DocEditor,
  },
  props: {
    editable: {
      type: Boolean,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    convertedHtml: {
      type: String,
      default: '',
    },
    updatedDate: {
      type: String,
      default: '',
    },
    updatedAuthorName: {
      type: String,
      default: '',
    },
    createdDate: {
      type: String,
      default: '',
    },
    createdAuthorName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showEditor: false,
      headlineIndexToEdit: -1,
    }
  },
  watch: {
    convertedHtml() {
      if (this.editable) {
        this.$nextTick(() => {
          this.addEditButtonToHeadline()
        })
      }
    },
  },
  mounted() {
    if (this.editable) {
      this.addEditButtonToHeadline()
    }
  },
  methods: {
    dateFormat(date) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
      if (!date) return '--'
      return new Intl.DateTimeFormat('default', options).format(new Date(date))
    },
    toggleShowEditor() {
      this.showEditor = !this.showEditor
    },
    openTreeDialog(callback) {
      this.$emit('openTreeDialog', callback)
    },
    onClickEditByHeadline(e) {
      this.headlineIndexToEdit = parseInt(e.currentTarget.dataset.headingIndex)
      this.showEditor = true
    },
    closeEditor() {
      this.showEditor = false
      this.headlineIndexToEdit = -1
    },
    addEditButtonToHeadline() {
      const buttonClassName = 'edit-by-headline'
      this.$refs.doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((element, index) => {
        element.insertAdjacentHTML(
          'beforeend',
          `<button class="${buttonClassName}" data-heading-index="${index}"><i class="fa fa-edit" /></button>`,
        )
        element
          .querySelector(`button.${buttonClassName}`)
          .addEventListener('click', this.onClickEditByHeadline, true)
      })
    },
  },
}
</script>

<style lang="scss">
h1,
h2,
h3,
h4,
h5,
h6 {
  button.edit-by-headline {
    display: none;
    appearance: none;
    -webkit-appearance: none;
    background: none;
    border: none;
    margin: 0 0 0 10px;
    padding: 0;
  }
  &:hover button.edit-by-headline {
    display: inline-block;
  }
}
</style>
<style lang="scss" scoped>
@import '../../assets/variable.scss';
.Doc {
  width: 50%;
  overflow: hidden;
  &_NavBar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: $navBarsHeight;
    background-color: #eeeeee;
    font-size: 0.9rem;
  }
  &_NavBarTools {
    margin: 0;
    padding: 0;
  }
  &_NavBarToolItem {
    line-height: 100%;
    display: inline-block;
  }
  &_NavBarIconButton {
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
  &_Info {
    margin: 0;
    padding: 0 10px 0 0;
    text-align: right;
  }
  &_InfoItem {
    line-height: $navBarsHeight;
    display: inline-block;
    height: $navBarsHeight;
    font-size: 12px;
    margin-left: 10px;
  }
  &_Inner {
    box-sizing: border-box;
    padding: 20px 30px;
    height: calc(100vh - #{$theHeaderHeight} - #{$navBarsHeight});
    overflow: scroll;
  }
  &_Editor {
    height: calc(100vh - #{$theHeaderHeight} - #{$navBarsHeight});
  }
  &_DocEditor {
    height: 100%;
  }
  &_Footer {
    padding: 20px;
    background-color: #eeeeee;
  }
}
</style>
