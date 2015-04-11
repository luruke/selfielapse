global.window = window;
global.navigator = navigator;
global.document = document;
global.URL = URL;
global.gui = require('nw.gui');

document.addEventListener("DOMContentLoaded", function(event) {

    var db = require('./database.js');
    var ui = require('./ui.js');
    var camera = require('./camera.js');

    camera.takePhoto(function(base64){
        console.log(base64);
    });

});
