
const admin_route=require('./src/app/modules/admin/router/admin.router')
const manager_route=require('./src/app/modules/manager/router/manager.router')
const user_route=require('./src/app/modules/user/router/router')

module.exports = [
    {
      path: "/api/admin",
      handler: admin_route
    },
    {
      path: "/api/manager",
      handler: manager_route
    },
    {
      path: "/api/user",
      handler: user_route
    },
  ]