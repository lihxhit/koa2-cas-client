const querystring = require('querystring');
const fetch = require('node-fetch');

const parseXML = require('xml2js').parseString;
const stripPrefix = require('xml2js/lib/processors').stripPrefix;
const util = require('./util');
module.exports = async function validate(ticket, context) {
    const { opts, ctx } = context;
    const query = querystring.stringify({
        ticket,
        service: opts.servicePrefix
    })
    const res = await fetch(`${util.getPath('serviceValidate', context)}?${query}`);
    const xml = await res.text();
    parseXML(xml, {
        explicitRoot: false,
        explicitArray: false,
        tagNameProcessors: [stripPrefix]
    }, function (err, serviceResponse) {
        let success = undefined;
        success = serviceResponse.authenticationSuccess;
        if (!success) {
            throw new Error('cas authentication failed');
        }
        if (opts.casInfoFormat) {
            ctx.session.cas = opts.casInfoFormat(serviceResponse.authenticationSuccess);
        } else {
            ctx.session.cas = serviceResponse.authenticationSuccess;
        }

    });
}