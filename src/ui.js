var tray = new gui.Tray({
    icon: 'src/webcam.png',
    alticon: 'src/webcam.png',
    iconsAreTemplates: true
});

var menu = new gui.Menu();
menu.append(new gui.MenuItem({ label: 'Open Folder' }));
menu.append(new gui.MenuItem({ type: 'separator' }));
menu.append(new gui.MenuItem({ label: 'Settings' }));
menu.append(new gui.MenuItem({ label: 'Quit' }));

menu.items[0].click = function() {
    gui.Shell.showItemInFolder('~');
};

tray.menu = menu;
