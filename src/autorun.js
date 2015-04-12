var Autorun = function() {
    if(os.platform() !== 'darwin'){
        return false;
    }
};

Autorun.prototype.enable = function() {
    exec('cp com.luruke.selfielapse.plist ~/Library/LaunchAgents/');
    exec('launchctl load ~/Library/LaunchAgents/com.luruke.selfielapse.plist');
};

Autorun.prototype.disable = function() {
    exec('launchctl unload ~/Library/LaunchAgents/com.luruke.selfielapse.plist');
};

Autorun.prototype.checkStatus = function() {
    var def = deferred();

    exec('launchctl list | grep com.capablemonkey.sleepApp', function(error, stdout, stderr) {

        /*if (error !== null && error.code === 1) { 
            return def.resolve(false);
        }*/
    
        if (stdout.length) {
            def.resolve(true);
        } else {
            def.resolve(false);
        }
    });

    return def.promise;
};

module.exports = new Autorun();
