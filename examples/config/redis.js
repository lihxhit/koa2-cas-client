const Redis = require('ioredis');

const redis = new Redis({
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    // family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: '1993012j',
    // db: 0
});
module.exports = redis;