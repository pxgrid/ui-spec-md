import types from './types'
export default {
  [types.INIT_PAGE](state) {
    state.editable = window.SCREEN_SPEC_MD.editable === 'true'
    state.body = window.SCREEN_SPEC_MD.convertedHtml
    state.updatedDate = window.SCREEN_SPEC_MD.updatedDate
    state.updatedAuthorName = window.SCREEN_SPEC_MD.updatedAuthorName
    state.createdDate = window.SCREEN_SPEC_MD.createdDate
    state.createdAuthorName = window.SCREEN_SPEC_MD.createdAuthorName
  },
  [types.SET_MARKDOWN](state, { markdown }) {
    state.markdown = markdown
  },
  [types.SET_PAGE_CONTEXT](
    state,
    {
      editable,
      toRoot,
      title,
      screen,
      absolutesScreen,
      svgCanvas,
      body,
      updatedAuthorName,
      updatedDate,
      createdAuthorName,
      createdDate,
    },
  ) {
    state.editable = editable === 'true'
    state.toRoot = toRoot
    state.title = title
    state.screen = screen
    state.absolutesScreen = absolutesScreen
    state.svgCanvas = svgCanvas
    state.body = body
    state.updatedAuthorName = updatedAuthorName
    state.updatedDate = updatedDate
    state.createdAuthorName = createdAuthorName
    state.createdDate = createdDate
  },
  [types.SET_CONVERTED_HTML](state, { html }) {
    state.convertedHtml = html
  },
}
