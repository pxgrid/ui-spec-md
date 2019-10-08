import { connect } from 'vuex-connect'
import DocEditor from './DocEditor.vue'
import editableTypes from '../../../../store/modules/editable/types'
import { stateToProps, actionsToEvents } from 'vuex-connect-namespace-helper'
export default connect({
  stateToProps: {
    ...stateToProps('editable', {
      markdown: 'markdown',
      previewedHtml: 'convertedHtml',
    }),
  },
  actionsToEvents: {
    ...actionsToEvents('editable', {
      writeMarkdown: editableTypes.WRITE_MARKDOWN,
      fetchConvertedHtml: editableTypes.FETCH_CONVERTED_HTML,
    }),
  },
  methodsToEvents: {
    uploadImage: async ({ dispatch }, { imageFile, imagePath, done }) => {
      await dispatch(`editable/${editableTypes.UPLOAD_IMAGE}`, {
        imageFile,
        imagePath,
      })
      done()
    },
  },
  lifecycle: {
    mounted: async store => {
      await store.dispatch(`editable/${editableTypes.FETCH_MARKDOWN}`)
    },
  },
})(DocEditor)
