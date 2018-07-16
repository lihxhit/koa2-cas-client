const querystring = require('querystring');
const fetch = require('node-fetch');
const parseXML = require('xml2js').parseString;
const stripPrefix = require('xml2js/lib/processors').stripPrefix;
const util = require('./util');

module.exports = async function (ticket, context) {
    const { opts, ctx } = context;
    const query = querystring.stringify({
        ticket,
        service: opts.servicePrefix
    });
    let xml = '';
    const res = await fetch(`${util.getPath('serviceValidate', context)}?${query}`);
    xml = await res.text();
    return new Promise((resolve, reject) => {
        parseXML(xml, {
            explicitRoot: false,
            explicitArray: false,
            tagNameProcessors: [stripPrefix]
        }, function (err, serviceResponse) {
            if (err) {
                reject(new Error('parse cas response pailed'));
            }
            let success = undefined;
            success = serviceResponse.authenticationSuccess;
            if (!success) {
                reject(new Error('Response recieved,but authentication failed,' + JSON.stringify(serviceResponse)));
            }
            resolve(success);
        });
    }).then((res) => {
        return res;
    })
}