var fs = require("fs");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var gui = require('nw.gui');
var deferred = require('deferred');
var os = require('os');
var exec = require('child_process').exec;
var humanizeDuration = require('humanize-duration');

global.window = window;
global.navigator = navigator;
global.document = document;
global.URL = URL;
global.gui = gui;
global.eventEmitter = eventEmitter;
global.deferred = deferred;
global.os = os;
global.exec = exec;
global.humanizeDuration = humanizeDuration;

gui.Window.get().showDevTools();

window.SelfieLapse = function (){
    this.db = require('./database.js');
    this.ui = require('./ui.js');
    this.camera = require('./camera.js');

    this.takeAndSavePhoto = function () {
        var self = this;
        eventEmitter.emit('takingPhoto');

        this.checkOutputDir();
        this.camera.takePhoto(function(base64){
            base64 = base64.replace(/^data:image\/png;base64,/, '');

            var filename = Date.now() + '.png';

            self.db.getSetting('saveLocation').then(function(path) {
                fs.writeFile(path + '/'+ filename, base64, 'base64', function(err){
                    if (err) throw err;

                    self.db.addSnapshot(filename);
                    self.updateNextTimestamp();
                    eventEmitter.emit('endtakingPhoto');
                });
            });
        });
    };

    this.updateNextTimestamp = function() {
        var self = this;

        this.db.getNextShootingTimestamp()
            .then(function(ms){
                self.nextShootTimestamp = ms;
            });
    };

    this.timer = function() {
        if (!this.nextShootTimestamp)
            return false;

        var msRemaining = parseInt( (this.nextShootTimestamp - Date.now()) );

        if(msRemaining <= 0) {
            //time is expired, take a new photo
            eventEmitter.emit('takePhoto');
        }

        //to early
        eventEmitter.emit('msRemaining', msRemaining);
    };

    this.checkOutputDir = function(){
        //make sure the output folder exists
        var self = this;

        this.db.getSetting('saveLocation').then(function(path) {
            self.ui.saveLocation = path; 
            if (!fs.existsSync(path)) fs.mkdirSync(path);
        });
    };

    this.init = function() {
        var self = this;
        this.nextShootTimestamp = null; //timestamp of the next shooting

        this.checkOutputDir();
        this.updateNextTimestamp();

        window.setInterval(this.timer.bind(this), 1000);
        eventEmitter.on('takePhoto', this.takeAndSavePhoto.bind(this));
    };

    this.init();
};


document.addEventListener("DOMContentLoaded", function () {
    try {
        var app = new SelfieLapse();
        app.init();
    } catch(err) {
        window.alert('Error:', err);
    }
});
