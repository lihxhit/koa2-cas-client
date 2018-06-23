const Koa = require('koa');
const session = require('koa-session');
const sessConfig = require('./config/session');
const noxCasClient = require('../index.js');
const app = new Koa();
app.keys = ['some secret hurr'];
 

const handler = async (ctx, next) =>{  
    try{  
        await next();  
    }catch(e){  
        ctx.response.status = e.statusCode ||e.status ||500;  
        ctx.body = e.message;
        console.log(e);
    }  
}  
app.use(handler);  

app.use(session(sessConfig, app));
app.use(noxCasClient({
    servicePrefix:'http://www.noxinfluencer.com',
    serverPath:'https://passport-us.bignox.com',
    paths:{
        homePage:'/',
        serviceValidate: '/sso/serviceValidate',
        logout:{
            cas:'/sso/logout',
            server:'/api/logout'
        }
    },
    casInfoFormat(info){
        return info.attributes;
    }
}));
app.use(async function (ctx) {
    ctx.body = ctx.session;
});
app.listen(8888);
