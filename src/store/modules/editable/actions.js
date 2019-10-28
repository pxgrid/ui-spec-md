import api from '../../../api'
import types from './types'

const getCurrentPath = () => {
  return location.pathname.replace(/^\//, '')
}
const makeImageFormData = (imageFile, imagePath) => {
  const formData = new FormData()
  formData.append('imagePath', imagePath)
  formData.append('filePath', location.pathname)
  formData.append('image', imageFile)
  return formData
}

export default {
  async [types.FETCH_MARKDOWN]({ commit }) {
    const path = location.pathname
    const res = await api.fetchMarkdown({ path })
    const markdown = res.data
    commit(types.SET_MARKDOWN, { markdown })
  },

  async [types.FETCH_CONVERTED_HTML]({ commit }, { markdown }) {
    const res = await api.fetchConvertedHtml({ markdown })
    const html = res.data.html
    commit(types.SET_CONVERTED_HTML, { html })
  },

  async [types.UPLOAD_IMAGE]({ commit }, { imageFile, imagePath }) {
    const res = await api.uploadImage({
      formData: makeImageFormData(imageFile, imagePath),
    })
    return res.data.context
  },

  async [types.WRITE_MARKDOWN]({ commit }, { markdown }) {
    const path = getCurrentPath()
    const res = await api.writeMarkdown({ path, markdown })
    commit(types.SET_PAGE_CONTEXT, res.data.context)
    commit(types.SET_MARKDOWN, { markdown })
  },

  async [types.WRITE_SCREEN_METADATA](
    { commit },
    { screenMetadata, fileToUpload = null, imagePath = '' },
  ) {
    const path = getCurrentPath()
    const promiseWriteMetadata = api.writeMetadataScreen({ path, screenMetadata })
    const promiseUploadImage = fileToUpload
      ? api.uploadImage({ formData: makeImageFormData(fileToUpload, imagePath) })
      : Promise.resolve()
    const [resWriteMetadata, resUploadImage] = await Promise.all([
      promiseWriteMetadata,
      promiseUploadImage,
    ])
    commit(types.SET_PAGE_CONTEXT, resWriteMetadata.data.context)
    return resWriteMetadata.data.context
  },

  async [types.REMOVE_SCREEN_METADATA]({ commit }) {
    const path = getCurrentPath()
    const res = await api.removeMetadataScreen({ path })
    commit(types.SET_PAGE_CONTEXT, res.data.context)
  },
}
