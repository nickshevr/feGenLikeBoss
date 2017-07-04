const rp = require('request-promise');
const nameGen = require('node-random-name');
const tough = require('tough-cookie');
const BASE_PATH = 'http://swarm.smartycrm.com/api/v2';

const email = `${nameGen().replace(' ', '_')}@web.local`;
const password = `123123`;
const employeeData = [];

let currentWsId = null;
let cookie = null;


for (let i = 0; i < 3; i++) {
    const fullName = nameGen();

    employeeData.push({
        fullName,
        email: `${fullName.replace(' ', '_')}@employee.local`
    })
}

rp.post({
    uri: `${BASE_PATH}/user/signup`,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    body: {
        email,
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
    rp.post({
        uri: `${BASE_PATH}/ws/${currentWsId}/employees`,
        headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': cookie
        },
        body: employeeData,
        json: true
    })
})
.then(res => {
    console.log(email, "  ", password);
})
.catch(err => {
    console.log(err.error);
});
