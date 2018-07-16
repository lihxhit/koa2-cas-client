<h2 align="center">Usage</h2>

**app.js**
```js
const Koa = require('koa');
const session = require('koa-session');

const app = new Koa();
app.use(session());//use whatever session middleware
app.use(noxCasClient({
    servicePrefix: '',//your server origin (port required if you need))
    serverPath:'',//passport origin
    session: {
        key: 'cas'//the key store in the session
    },
    paths: {
        homePage: '/',//home page path, '/' default
        login: '/sso/login/',//passport login path
        logout: {
            cas: '/sso/logout',//passport logout path
            server: '/api/logout'//server logout path if you need
        },
        serviceValidate: '/sso/serviceValidate',//the passport path which validate ticket and your server origin
    },
    ajax:{
        header:{
            key:'nox-ajax',//add ajax request header if you need ajax redirect
            value:'1'//
        },
        //custom ajax response
        response:{
            errNum:10010,
            message:"no login",
            data:undefined,
        }
    },
    // custom passport response, attributes default
    casInfoFormat(info){
        return info.attributes;
    }
}));
```