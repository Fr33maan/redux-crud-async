
var uuid = require('uuid')

module.exports = function modelsWithTmpId (models){
  return models.map(model => {
    return {
      ...model,
      tmpId : uuid.v4()
    }
  })
}
