'use strict'

module.exports = cas

function cas(opts){
    console.log(opts);
    return async function cas(ctx,next){
        console.log(ctx);
    }
}