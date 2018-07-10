'use strict'
const debug = require('debug')('cas-client');
const _ = require('lodash');
const util = require('./lib/util');
const validate = require('./lib/validate');
module.exports = cas;

const DEFAULT_OPTIONS = {
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
function cas(opts, next) {
    opts = _.merge(DEFAULT_OPTIONS, opts);
    opts.ajax.response.data = opts.ajax.response.data || {
        origin:opts.serverPath,
        login:opts.serverPath
    }
    return async function cas(ctx, next) {
        if (!ctx.session) {
            throw new Error('session middleware required');
        }
        if (!opts.servicePrefix) {
            throw new Error('opts.servicePrefix required');
        }
        // if (!opts.servicePrefix) {
        opts.service = ctx.href;
        // }
        const context = {
            ctx,
            opts
        }
        const path = ctx.path;
        const method = ctx.method;
        if (opts.paths.logout.server) {
            if (util.pathEqual(path, opts.paths.logout.server)) {
                ctx.session = null;
                debug("match logout");
                return ctx.redirect(util.getPath('logout', context));
            }
        }

        if (util.shouldIgnore(path, opts)) {
            debug("match ignore || session");
            if (ctx.query.ticket) {
                debug("redirect noticket");
                return ctx.redirect(util.getPath('noticket', context));
            }
            
        }
        if (ctx.query.ticket) {
            await validate(ctx.query.ticket, context);
            debug("redirect noticket after validate");
            return ctx.redirect(util.getPath('noticket', context));
        }
        if(ctx.session[opts.session.key]){
            return await next();
        }
        if(!util.isAjax(context)){
            ctx.redirect(util.getPath('login', context));
        }else{
            ctx.status = 401;
            ctx.body = opts.ajax.response;
            return;
        }
        await next();
    }
}