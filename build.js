var NwBuilder = require('node-webkit-builder');

var nw = new NwBuilder({
    files: [
        './package.json',
        './node_modules/**/**',
        './src/**/**',
    ],
    platforms: ['osx64']
});

nw.on('log',  console.log);

nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
