var UI = function(){
    this.tray = new gui.Tray({
        icon: 'src/normal.png',
        iconsAreTemplates: true
    });

    this.menu = new gui.Menu();

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
        this.menu.items[0].label = 'Shooting...';
        this.tray.icon = 'src/shooting.png';
    }.bind(this));

    eventEmitter.on('endtakingPhoto', function(){
        this.menu.items[0].label = 'Take Snapshot';
        this.tray.icon = 'src/normal.png';
    }.bind(this));
};



module.exports = new UI();
