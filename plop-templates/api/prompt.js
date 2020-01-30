const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a api, store and view',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'model name please',
    validate: notEmpty('name')
  },
  {
    type: 'confirm',
    name: 'advanced',
    default: false,
    message: '是否使用高级模板？'
  }
  ],
  actions: data => {
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `src/api/${name}.js`,
      templateFile: 'plop-templates/api/api.hbs',
      skipIfExists: true,
    },
    {
      type: 'add',
      path: `src/views/${name}/index.vue`,
      templateFile: 'plop-templates/api/view.hbs',
      skipIfExists: true,
    },
    {
      type: 'modify',
      path: 'src/router/index.js',
      templateFile: 'plop-templates/api/router.hbs',
      pattern: /\/\/ insert/
    }
    ]

    return actions
  }
}
