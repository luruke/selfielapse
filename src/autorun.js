//eventually this could be a single node module
var Autorun = function() {
    if(os.platform() !== 'darwin')
        return false;
};

Autorun.prototype.enable = function() {
    exec('cp ./src/com.luruke.selfielapse.plist ~/Library/LaunchAgents/', function (error) {
        if (error !== null) {
          throw 'exec error: ' + error;
        }
    });
    exec('launchctl load ~/Library/LaunchAgents/com.luruke.selfielapse.plist', function (error) {
        if (error !== null) {
          throw 'exec error: ' + error;
        }
    });
};

Autorun.prototype.disable = function() {
    exec('launchctl unload ~/Library/LaunchAgents/com.luruke.selfielapse.plist', function (error) {
        if (error !== null) {
          throw 'exec error: ' + error;
        }
    });
};

Autorun.prototype.checkStatus = function() {
    var def = deferred();

    exec('launchctl list | grep com.luruke.selfielapse', function(error, stdout, stderr) {
        def.resolve(stdout.length);
    });

    return def.promise;
};

module.exports = new Autorun();
