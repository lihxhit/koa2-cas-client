<h2 align="center">Usage</h2>

**app.js**
```js
const Koa = require('koa');
const session = require('koa-session');

const app = new Koa();
app.use(session());//use whatever session middleware
app.use(noxCasClient({
    servicePrefix: '',//your server origin
    serverPath:'',//passport origin
    session: {
        key: 'cas'//the key store in the session
    },
    paths: {
        homePage: '/',
        login: '/sso/login/',
        logout: {
            cas: '/sso/logout',
            server: '/api/logout'//option
        },
        serviceValidate: '/sso/serviceValidate',//the passport path validate ticket and your service
    },
    ajax:{
        header:{
            key:'nox-ajax',//add ajax request header if you need ajax redirect
            value:'1'//
        },
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