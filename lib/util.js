const path = require('path');
const querystring = require('querystring');
const url = require('url');
const _ = require('lodash');
exports.pathEqual = (prev, next) => {
    if (prev.endsWith('/')) {
        prev = prev.slice(0, -1);
    }
    if (next.endsWith('/')) {
        prev = prev.slice(-1);
    }
    return prev === next;
}
exports.shouldIgnore = (opts) => {
    if (opts.match) {

    }
    if (opts.ignore) {

    }
    return false;
}

exports.getPath = function getPath(name, { opts, ctx }) {
    let path = '';
    let service = '';
    switch (name) {
        case 'login':
            const serverLoginPath = url.resolve(opts.serverPath, opts.paths.login);
            service = opts.service;
            path = `${serverLoginPath}?service=${service}`;
            break;
        case 'serviceValidate':
            path = url.resolve(opts.serverPath, opts.paths.serviceValidate);
            break;
        case 'logout':
            const serverLogoutPath = url.resolve(opts.serverPath, opts.paths.logout.cas);
            service = url.resolve(opts.servicePrefix, opts.paths.homePage);
            path = `${serverLogoutPath}?service=${service}`;
            break;
        case 'noticket':
            delete ctx.query.ticket;
            if(_.isEmpty(ctx.query)){
                path = ctx.origin + ctx.path;
            }else{
                path = `${ctx.origin}${ctx.path}?${querystring.stringify(ctx.query)}`;
            }
        default:
            break;
    }
    return path;
}

exports.isAjax = function({opts,ctx}){
    const {header} = opts.ajax;
    if(ctx.header[header.key] == header.value){
        return true;
    }
    return false;
}