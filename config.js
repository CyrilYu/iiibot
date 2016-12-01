module.exports = {
  debug: {
    tag: 'diuit.dashboard'
  },
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3333,
  secretkey: 'aWlpYm90QGRpdWl0',
  production: {
    uri: 'https://developer.diuit.com',
    apiserver: 'https://api.diuit.net/2',
    payment: 'http://payment.diuit.com:3000',
    database: 'mariadb://root:1qaz2wsx@localhost:3306/dashboard'
  },
  staging: {
    uri: 'https://developer.diuit.com',
    apiserver: 'https://api.diuit.net/2',
    payment: 'http://localhost:8000',
    database: 'mariadb://root:1qaz2wsx@localhost:3306/dashboard'
  },
  development: {
    uri: 'http://localhost:3333',
    apiserver: 'http://localhost:3000/2',
    stripekey: 'sk_test_ik5aJnJFoptcnIItvfVQzJgi',
    databases: {
      dashboard: 'mariadb://root:1qaz2wsx@localhost:3306/dashboard',
      stripe: 'mariadb://root:1qaz2wsx@localhost:3306/stripe'
    }
  }
}
