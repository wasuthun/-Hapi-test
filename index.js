'use strict';

const Hapi = require('@hapi/hapi');
const axios = require('axios')

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'Post',
        path: '/',
        handler: (request, h) => {
            var data = request.payload.data
            data['0'].forEach(level_0=>{
                data['1'].forEach(level_1 => {
                    data['2'].forEach(level_2 => {
                        if(level_2.parent_id===level_1.id)
                            level_1.children.push(level_2)
                    });
                    if(level_0.id===level_1.parent_id)
                        level_0.children.push(level_1)
                })
            })
            return data['0'];
        }
    })

    server.route({
        method: 'Get',
        path: '/github-search',
        handler: async (request, h) => {
            const result = await axios.get(`https://api.github.com/search/repositories?q=topic:${request.query.topic}&sort=stars&order=desc&page=${request.query.page}&per_page=${request.query.per_page}`)
            return result.data;
        }
    });
    
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();