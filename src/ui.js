var UI = function(){
    this.shooting = false;

    this.shortEnglishHumanizer = humanizeDuration.humanizer({
        language: 'shortEn',
        spacer: "",
        languages: {
            shortEn: {
                year: function() { return "y"; },
                month: function() { return "mo"; },
                week: function() { return "w"; },
                day: function() { return "d"; },
                hour: function() { return "h"; },
                minute: function() { return "m"; },
                second: function() { return "s"; },
                millisecond: function() { return "ms"; },
            }
        }
    });

    this.tray = new gui.Tray({
        icon: 'src/normal.png',
        iconsAreTemplates: true
    });

    this.menu = new gui.Menu();

    this.menu.append(new gui.MenuItem({
        label: '',
        enabled: false
    }));

    this.menu.append(new gui.MenuItem({
        type: 'separator'
    }));

    this.menu.append(new gui.MenuItem({
        label: 'Take Snapshot',
        click: function(){
            eventEmitter.emit('takePhoto');
        }
    }));

    this.menu.append(new gui.MenuItem({
        label: 'Open Folder',
        click: function() {
            gui.Shell.openItem(consts.savingDir);
        }
    }));

    this.menu.append(new gui.MenuItem({
        type: 'separator'
    }));

    this.menu.append(new gui.MenuItem({
        label: 'Quit',
        click: function() {
            gui.App.quit();
        }
    }));

    this.tray.menu = this.menu;

    eventEmitter.on('takePhoto', function(){
        this.menu.items[2].label = 'Shooting...';
        this.menu.items[0].label = 'Cheese :)';

        this.tray.icon = 'src/shooting.png';
        this.shooting = true;
    }.bind(this));

    eventEmitter.on('endtakingPhoto', function(){
        this.menu.items[2].label = 'Take Snapshot';
        this.tray.icon = 'src/normal.png';

        this.shooting = false;
        this.tickNextShoot();
    }.bind(this));


    this.nextShootTimestamp = Date.now(); //Timestamp of the next shoot
    this.clockNextShoot = window.setInterval(this.tickNextShoot.bind(this), 1000);

    eventEmitter.on('nextShoot', function(timestamp) {
        this.nextShootTimestamp = timestamp;
    }.bind(this));
};

UI.prototype.tickNextShoot = function() {
    if (this.shooting)
        return false;

    var msRemaining = parseInt( (this.nextShootTimestamp - Date.now()) );

    if(msRemaining <= 0) {
        eventEmitter.emit('checkCRON');
        this.menu.items[0].label = 'Cheese :)';

        return false;
    }

    var text = this.shortEnglishHumanizer(msRemaining, { round: true });
    this.menu.items[0].label = 'Next shooting in '+ text;
};



module.exports = new UI();
