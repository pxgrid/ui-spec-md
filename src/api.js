import axios from 'axios'
const apiRoot = ''
const version = ''
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
}

class API {
  constructor() {
    this.axios = axios.create({
      headers,
    })
  }
  _request({ method = 'GET', url, data, params }) {
    return this.axios({
      method,
      url: `${apiRoot}${version}${url}`,
      data,
      params,
    })
  }

  fetchTree({ path }) {
    const url = '/tree.json'
    return this._request({
      url,
      params: {
        path,
      },
    })
  }

  fetchMarkdown({ path }) {
    const url = '/__markdown'
    return this._request({
      url,
      params: {
        path,
      },
    })
  }

  writeMarkdown({ path, markdown }) {
    const url = '/__markdown'
    return this._request({
      url,
      method: 'POST',
      data: {
        path,
        markdown,
      },
    })
  }

  writeMetadataScreen({ path, screenMetadata }) {
    const url = '/__screenMetadata'
    return this._request({
      url,
      method: 'POST',
      data: {
        path,
        screenMetadata,
      },
    })
  }

  removeMetadataScreen({ path }) {
    const url = '/__removeScreenMetadata'
    return this._request({
      url,
      method: 'PATCH',
      data: {
        path,
      },
    })
  }

  fetchConvertedHtml({ markdown }) {
    const url = '/__html'
    return this._request({
      url,
      method: 'POST',
      data: {
        markdown,
      },
    })
  }

  uploadImage({ formData }) {
    const url = '/__uploadImage'
    return this._request({
      url,
      method: 'POST',
      data: formData,
    })
  }
}

export default new API()
