const rp = require('request-promise');
const nameGen = require('node-random-name');
const tough = require('tough-cookie');
const BASE_PATH = 'http://swarm.smartycrm.com/api/v2';

//const email = `${nameGen().replace(' ', '_')}@web.local`;
const login = `bestApiV2@web.local`;
const password = `123123`;
const employeeData = [];

let currentWsId = null;
let cookie = null;


for (let i = 0; i < 1; i++) {
    const fullName = nameGen({ random: Math.random });

    employeeData.push({
        fullName,
        email: `${fullName.replace(' ', '_')}@employee.local`
    })
}

rp.post({
    uri: `${BASE_PATH}/user/login`,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    body: {
        login,
        password
    },
    resolveWithFullResponse: true,
    json: true
})
.then(res => {
    cookie = res.headers['set-cookie'];

    return rp.get({
        uri: `${BASE_PATH}/ws/`,
        headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': cookie
        },
        json: true
    })
})
.then(wsObject => {
    currentWsId = wsObject.result[0]._id;

    return rp.post({
        uri: `${BASE_PATH}/ws/${currentWsId}/access_rights`,
        headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': cookie
        },
        json: true
    })
})
.then(res => {
    console.log(res.result);
})
.catch(err => {
    console.log(err.error);
});
