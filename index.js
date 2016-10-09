"use strict";

const app = require('express')();
const async = require('async');
const _ = require('lodash');
const amqp = require('seneca-amqp-transport');
const seneca =require('seneca')().use(amqp);
const ready = require('hello-common/ready');

const languages = ['english'];


app.get('/hi', (req, res) => {

    res.send('hi');
});


app.get('/greeting', (req, res) => {

    async.map(languages, (language, callback) => {

        seneca.act({
            service: `service-${language}`,
            word_type: 'greeting'
        }, callback);

    }, (err, results) => {

        if (err) {
            return res.send('an error occurred!');
        }

        const hello = _.map(results, (result) => {
            
            const greeting = _.get(result, 'greeting', 'unknown');
            const reverse = _.get(result, 'reverse', 'unknown');

            return `${greeting} (${reverse})`;
        }).join(', ');

        res.send(`${hello} crazy world!!!`);
    });
});

ready({
    hostname: 'rabbitmq',
    port: 15672,
    path: '/api'
}, () => {

    seneca.client({
        type: 'amqp',
        hostname: 'rabbitmq',
        port: 5672,
        username: 'guest',
        password: 'guest',
        pin: [
            {service: 'service-english'},
            {service: 'service-hawaiian'},
            {service: 'service-spanish'}
        ]
    });
    
    app.listen(process.env.APP_PORT, () => {

        console.log('listening on', process.env.APP_PORT);
    });

});