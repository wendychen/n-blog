module.exports = {
    port: 3000,
    session: {
        secret: 'news',
        key: 'news',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/news'
}