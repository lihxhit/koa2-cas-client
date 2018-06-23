'use strict'
const _ = require('lodash');
const util = require('./lib/util');
const validate = require('./lib/validate');
module.exports = cas;

const DEFAULT_OPTIONS = {
    servicePrefix: '',
    session: {
        key: 'cas'
    },
    paths: {
        homePage:'/',
        login: '/sso/login/',
        logout: {
            cas:'/sso/logout',
            server:''
        },
        serviceValidate: '/sso/serviceValidate',
    }
};
function cas(opts, next) {
    opts = _.merge(DEFAULT_OPTIONS, opts);
    return async function cas(ctx, next) {
        if (!ctx.session) {
            throw new Error('session middleware required');
        }
        if(!opts.servicePrefix){
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
        if(opts.paths.logout.server){
            if(util.pathEqual(path,opts.paths.logout.server)){
                ctx.session = null;
                ctx.redirect(util.getPath('logout'));
            }
        }

        if (util.shouldIgnore(path, opts) || ctx.session.cas) {
            return await next();
        }
        if (method === 'GET') {
            if (ctx.query.ticket) {
                await validate(ctx.query.ticket,context);
            } else {
                ctx.redirect(util.getPath('login',context));
            }
        }
        await next();
    }
}