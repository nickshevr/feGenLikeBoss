const rp = require('request-promise');
const nameGen = require('node-random-name');
const tough = require('tough-cookie');
const BASE_PATH = 'http://swarm.smartycrm.com/api/v2';

module.exports.SocketTestGenerator = class SocketTestGenerator {
    constructor() {
        this.contactGroupId = null;
        this.createdcontactsIds = [];

        this.projectGroupId = null;
        this.createdprojectsIds = [];

        this.cookies = null;
        this.currentWsId = null;
        this.currentEmployeeId = null;
    }

    async login(login, password) {
        try {
            const res = await rp.post({
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
            });

            this.cookies = res.headers['set-cookie'];
        } catch(e) {
            console.log(e);
        }
    }

    async registration() {
        try {
            const res = await rp.post({
                uri: `${BASE_PATH}/user/signup`,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                body: {
                    email: `${nameGen({ random: Math.random }).replace(' ', '_')}@web.local`,
                    password: '123123'
                },
                resolveWithFullResponse: true,
                json: true
            });

            this.cookies = res.headers['set-cookie'];
        } catch(e) {
            console.log(e.message);
        }
    }

    async getCurrentWs() {
        const result = await rp.get({
            uri: `${BASE_PATH}/ws/`,
            headers: {
                'User-Agent': 'Request-Promise',
                'Cookie': this.cookies
            },
            json: true
        });

        this.currentWsId = result.result[0]._id;
    }

    async getMainCollectionGroup(collectionName) {
        if (!this.currentWsId) {
            await this.getCurrentWs();
        }

        try {
            const result = await rp.get({
                uri: `${BASE_PATH}/ws/${this.currentWsId}/${collectionName}s/groups`,
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Cookie': this.cookies
                },
                json: true
            });

            this[`${collectionName}GroupId`] = result.result[0]._id;
        } catch(e) {
            console.log(e.error);
        }
    }

    async createWSObject(collectionName) {
        if (!this[`${collectionName}GroupId`]) {
            await this.getMainCollectionGroup(collectionName);
        }

        try {
            const res = await rp.post({
                uri: `${BASE_PATH}/ws/${this.currentWsId}/${collectionName}s`,
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Cookie': this.cookies
                },
                body: {
                    _groupId: this[`${collectionName}GroupId`],
                    title: nameGen({ random: Math.random })
                },
                resolveWithFullResponse: true,
                json: true
            });

            this[`created${collectionName}sIds`].push(res.body.result._id);
        } catch(e) {
            console.log(e);
        }
    }

    async deleteWSObject(collectionName) {
        if (!this[`created${collectionName}sIds`].length) {
            await this.createWSObject(collectionName);
        }

        try {
            await rp.delete({
                uri: `${BASE_PATH}/ws/${this.currentWsId}/${collectionName}s/${this[`created${collectionName}sIds`][0]}`,
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Cookie': this.cookies
                },
                resolveWithFullResponse: true,
                json: true
            });
        } catch(e) {
            console.log(e);
        }
    }
}