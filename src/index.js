var fs = require("fs");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var gui = require('nw.gui');
var deferred = require('deferred');
var os = require('os');
var exec = require('child_process').exec;
var consts = {
    savingDir: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/selfielapse'
};

global.window = window;
global.navigator = navigator;
global.document = document;
global.URL = URL;
global.gui = gui;
global.eventEmitter = eventEmitter;
global.deferred = deferred;
global.os = os;
global.exec = exec;
global.consts = consts;

window.SelfieLapse = function (){
    this.db = require('./database.js');
    this.ui = require('./ui.js');
    this.camera = require('./camera.js');
    var self = this;

    //create dir if not exists
    if (!fs.existsSync(consts.savingDir)){
        fs.mkdirSync(consts.savingDir);
    }

    this.takeAndSavePhoto = function () {
        eventEmitter.emit('takingPhoto');
        this.camera.takePhoto(function(base64){
            base64 = base64.replace(/^data:image\/png;base64,/, '');

            var filename = Date.now() + '.png';

            fs.writeFile(consts.savingDir + '/'+ filename, base64, 'base64', function(err){
                if (err) throw err;

                self.db.addSnapshot(filename);
                eventEmitter.emit('endtakingPhoto');
            });
        });
    };

    eventEmitter.on('takePhoto', this.takeAndSavePhoto.bind(this));

    window.setInterval(function(){
        eventEmitter.emit('takePhoto');
    }, 60 * 1000);
};


document.addEventListener("DOMContentLoaded", function () {
    new SelfieLapse();
});
