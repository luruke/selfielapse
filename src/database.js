var Database = function() {
    this.dbName = "snapshotdb";
    this.dbVersion = "0.1";
    this.dbDesc = "store snapshot from webcam";
    this.db = null; //websql instance

    this.initialize();

    // Query out the data
    /*db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM foo', [], function (tx, results) {
        var len = results.rows.length, i;
        for (i = 0; i < len; i++) {
          alert(results.rows.item(i).text);
        }
      });
    });*/
};

Database.prototype.initialize = function() {
    this.db = window.openDatabase(this.dbName, this.dbVersion, this.dbDesc, 2 * 1024 * 1024);

    this.db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS snapshots (id unique, text)');
    });
};

Database.prototype.hasTodaySnapshot = function() {
    return false;
};

Database.prototype.addSnapshot = function(fileName) {
    this.db.transaction(function(tx){
        tx.executeSql('INSERT INTO snapshots (id, text) VALUES (1, "'+ fileName +'")');
    });
};

module.exports = new Database();
