const SocketTestGenerator = require('./generator').SocketTestGenerator;

const generator = new SocketTestGenerator();

generator.login("bestApiV2@web.local", "123123")
.then(() => {
    return generator.deleteWSObject('contact');
})
.then(() => {
    console.log(generator);
})
.catch(e => {
    console.log(e);
});