module.exports = {
    servicePrefix: '',
    serverPath:'',
    session: {
        key: 'cas'
    },
    paths: {
        homePage: '/',
        login: '/sso/login/',
        logout: {
            cas: '/sso/logout',
            server: ''
        },
        serviceValidate: '/sso/serviceValidate',
    },
    ajax:{
        header:{
            key:'nox-ajax',
            value:'1'
        },
        response:{
            errNum:10010,
            message:"no login",
            data:undefined,
        }
    },
    casInfoFormat(info){
        return info;
    }
};