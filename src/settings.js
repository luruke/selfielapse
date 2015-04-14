var Settings = function() {
    this.init();
};

Settings.prototype.init = function() {
    this.handleSaveLocation();
};

Settings.prototype.handleSaveLocation = function() {
    var self = this;

    this.saveField = document.getElementById('saveLocation');
    this.saveField.onchange = this.saveFieldChange.bind(this);
    this.currentSaveLocation = document.getElementById('currentSaveLocation');

    global.db.getSetting('saveLocation').then(function(path){
        self.currentSaveLocation.innerText = path;
    });

    global.eventEmitter.on('changeSetting:saveLocation', function(path){
        self.currentSaveLocation.innerText = path;
    });
};

Settings.prototype.saveFieldChange = function(e) {
    var newPath = e.target.value;
    global.db.setSetting('saveLocation', newPath);
};


document.addEventListener("DOMContentLoaded", function () {
    //try {
        var settings = new Settings();
    //} catch(err) {
    //    window.alert('Error:', err);
    //}
});
