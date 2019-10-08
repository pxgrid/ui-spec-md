const getParamsValue = (paramsString, key) => {
  //ex. "/path/to/index.html?src=screen.png&highlight=[[1,2,3,4]]" => ["src=screen.png", "highlight=[[1,2,3,4]]"]
  const paramsArray = paramsString.replace(/.+\?/, '').split(/&/)
  const mappedObject = paramsArray.reduce((acc, current) => {
    const keyValue = current.split('=')
    acc[keyValue[0]] = keyValue[1]
    return acc
  }, {})
  return mappedObject[key]
}

export default getParamsValue
