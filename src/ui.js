var tray = new gui.Tray({
    icon: 'src/webcam.png',
    alticon: 'src/webcam.png',
    iconsAreTemplates: true
});

var menu = new gui.Menu();

menu.append(new gui.MenuItem({
    label: 'Open Folder',
    click: function() {
        gui.Shell.openItem(consts.savingDir);
    }
}));

menu.append(new gui.MenuItem({
    type: 'separator'
}));

menu.append(new gui.MenuItem({
    label: 'Quit',
    click: function() {
        gui.App.quit();
    }
}));

tray.menu = menu;
