const Koa = require('koa');
const noxCasClient = require('../index.js');
const app = new Koa();
app.use(noxCasClient({

}));
app.use(async function (ctx) {
    console.log('2');
    ctx.body = 'Hello World';
});
app.listen(8888);
