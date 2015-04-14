var UI = function(){
    var self = this;
    this.shooting = false;
    this.saveLocation = '.';

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
            gui.Shell.openItem(self.saveLocation);
        }
    }));

    this.menu.append(new gui.MenuItem({
        type: 'separator'
    }));

    this.menu.append(new gui.MenuItem({
        label: 'Settings',
        click: function() {
            var new_win = gui.Window.open('settings.html', {
                title: 'Settings',
                toolbar: false,
                frame: true,
                resizable: false,
                fullscreen: false,
                width: 300,
                height: 500
            });
        }
    }));

    this.menu.append(new gui.MenuItem({
        label: 'Quit',
        click: function() {
            gui.App.quit();
        }
    }));

    this.tray.menu = this.menu;

    //Binding event listeners
    eventEmitter.on('takePhoto', this.takingPhoto.bind(this));
    eventEmitter.on('endtakingPhoto', this.endtakingPhoto.bind(this));
};

UI.prototype.takingPhoto = function() {
    this.menu.items[2].label = 'Shooting...';
    this.menu.items[0].label = 'Cheese :)';

    this.tray.icon = 'src/shooting.png';
    this.shooting = true;
};

UI.prototype.endtakingPhoto = function() {
    this.menu.items[2].label = 'Take Snapshot';
    this.tray.icon = 'src/normal.png';

    this.shooting = false;
};

UI.prototype.updateCounter = function(msRemaining) {
    if (this.shooting)
        return false;

    if(msRemaining <= 0) {
        this.menu.items[0].label = 'Cheese :)';
        return false;
    }

    var text = this.shortEnglishHumanizer(msRemaining, { round: true });
    this.menu.items[0].label = 'Next shooting in '+ text;
};

module.exports = new UI();
