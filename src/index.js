var fs = require("fs");
var consts = {
    savingDir: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/selfielapse'
};

global.window = window;
global.navigator = navigator;
global.document = document;
global.URL = URL;
global.gui = require('nw.gui');
global.consts = consts;

var SelfieLapse = function(){
    this.db = require('./database.js');
    this.ui = require('./ui.js');
    this.camera = require('./camera.js');

    //create dir if not exists
    if (!fs.existsSync(consts.savingDir)){
        fs.mkdirSync(consts.savingDir);
    }

    var self = this;
    window.setInterval(function(){
        self.camera.takePhoto(function(base64){
            base64 = base64.replace(/^data:image\/png;base64,/, '');

            fs.writeFile(consts.savingDir + '/'+ Date.now() +'.png', base64, 'base64', function(err){
                if (err) throw err;
            });
        });
    }, 10000);
    
};


document.addEventListener("DOMContentLoaded", function() {
    new SelfieLapse();
});
