var main = require('../controllers/main');
module.exports = [
    {method: 'GET', path: '/', handler: main.home},
    {method: 'POST', path: '/register', handler: main.register, config:{payload: {
    	allow: 'application/json',
    	parse: true
    }}},
    {method: 'POST', path: '/send', handler: main.send},
    {method: 'GET', path: '/list', handler: main.list},
    {method: 'GET', path: '/del/{id?}', handler: main.del}
]