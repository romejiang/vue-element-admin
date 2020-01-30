const viewGenerator = require('./plop-templates/view/prompt')
const componentGenerator = require('./plop-templates/component/prompt')
const storeGenerator = require('./plop-templates/store/prompt.js')
const apiGenerator = require('./plop-templates/api/prompt.js')

module.exports = function(plop) {
  plop.setGenerator('api', apiGenerator)
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('store', storeGenerator)
  plop.setGenerator('component', componentGenerator)
}
