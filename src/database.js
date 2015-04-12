var Database = function() {
    this.dbName = "snapshotdb";
    this.dbVersion = "0.1";
    this.dbDesc = "store snapshot from webcam";
    this.db = null; //websql instance

    this.defaultSettings = {
        saveLocation: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/selfielapse',
        shootEach: 3600, //in seconds, 1h
    };

    this.initialize();
};

Database.prototype.sql = function (str, data) {
    data = data || [];
    var def = deferred();

    this.db.transaction(function (tx){
        tx.executeSql(str, data,
            function(tx, results){
                def.resolve(results);
            },
            function(tx, e){
                var msg = '('+e.code+') '+e.message;
                window.alert(msg);
                def.reject(msg);
            }
        );
    });

    return def.promise;
};

Database.prototype.drop = function() {
    this.sql('DROP TABLE IF EXISTS snapshots');
    this.sql('DROP TABLE IF EXISTS settings');
};

Database.prototype.initialize = function () {
    var self = this;

    this.db = window.openDatabase(this.dbName, this.dbVersion, this.dbDesc, 2 * 1024 * 1024);

    this.drop(); //temporary, start a fresh session
    self.sql('CREATE TABLE IF NOT EXISTS snapshots (id INTEGER PRIMARY KEY, filename VARCHAR, timestamp TEXT)');
    self.sql('CREATE TABLE IF NOT EXISTS settings (key VARCHAR, value VARCHAR)');

    for(key in self.defaultSettings){
        self.sql('INSERT OR IGNORE INTO settings (key, value) VALUES(?, ?)', [key, self.defaultSettings[key]])
    }
};

Database.prototype.hasTodaySnapshot = function () {
    return false;

    //select max(datetime) from tableName;
};

Database.prototype.addSnapshot = function (fileName) {
    return this.sql('INSERT INTO snapshots (filename, timestamp) VALUES (?, ?)', [ fileName, Date.now() ]);
};

Database.prototype.getSetting = function (key) {
    var self = this;
    var def = deferred();

    this.sql('SELECT * FROM settings WHERE key=?', [ key ])
        .then(function (results) {
            if (!results.rows.length) {
                def.reject(false);
            };

            def.resolve(results.rows.item(0).value);
    });

    return def.promise;
};

Database.prototype.setSetting = function (key, value, callback) {
    var self = this;
    var def = deferred();

    this.getSetting(key).then(
        function (result){
            self.sql('UPDATE settings SET value=? WHERE key=?', [ value, key ]).then(function(){
                def.resolve();
            }); 
        },
        function (result){
            self.sql('INSERT INTO settings (key, value) VALUES (?, ?)', [ key, value ]).then(function(){
                def.resolve();
            });
        }
    );

    return def.promise;
};

module.exports = new Database();
