var chalk      = require('chalk')

module.exports = function(modelName) {

  if(modelName.substr(modelName.length - 1) === 's'){
    console.log(
      chalk.red('Your model "'+modelName+'" has a "s" at its end, redux-crud-async already pluralize models for you and WILL pluralize this name again as "'+modelName+'s"')
    )
  }
}
