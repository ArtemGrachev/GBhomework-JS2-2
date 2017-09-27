/*jslint plusplus: true, devel: true, eqeq: true */
'use strict';
var dataOrder = 0;
function Container() {
    this.deleted = false;
    this.id = "";
    this.className = "";
    this.htmlCode = "";
}
Container.prototype.renderExisting = function () {
    return this.htmlCode;
};
Container.prototype.render = function () {
    return (this.deleted == false) ? this.renderExisting() : '';
};
Container.prototype.remove = function () {
    this.deleted = true;
    if (this.selectThis()) {
        this.selectThis().parentNode.removeChild(this.selectThis());
    }
};

function Menu(myId, myClass, myItems) {
    Container.call(this);
    this.order = dataOrder++;
    this.id = myId;
    this.className = myClass;
    this.items = myItems;
}
Menu.prototype = Object.create(Container.prototype);
Menu.prototype.constructor = Menu;
Menu.prototype.renderExisting = function () {
    var result = (this.id && this.id != '') ? '<ul class="' + this.className + '" id="' + this.id + '">' : '<ul class="' + this.className + '" data-order="' + dataOrder++ + '">',
        i;
    for (i = 0; i < this.items.length; i++) {
        if ((this.items[i] instanceof MenuItem) || (this.items[i] instanceof SubMenu)) {
            this.items[i].menu = this.selectThis();
            result += this.items[i].render();
        }
    }
    result += '</ul>';
    return result;
};
Menu.prototype.selectThis = function () {
    return (this.id && this.id != '') ? document.getElementById(this.id) : document.querySelector('[data-order="' + this.order + '"]');
};

function MenuItem(myHref, myLabel) {
    Container.call(this);
    this.className = 'menu-item';
    this.href = myHref;
    this.label = myLabel;
}
MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.constructor = MenuItem;
MenuItem.prototype.renderExisting = function () {
    return '<li class="' + this.className + '"><a href="' + this.href + '" >' + this.label + '</a></li>';
};
MenuItem.prototype.selectThis = function () {
    return (this.menu && this.menu != '') ? this.menu.querySelector('[href="' + this.href + '"]') : document.querySelector('[href="' + this.href + '"]');
};

function SubMenu(myHref, myLabel, myId, myClass, myItems) {
    Container.call(this);
    this.className = 'menu-item';
    this.href = myHref;
    this.label = myLabel;
    this.menuId = myId;
    this.menuClassName = myClass;
    this.menuItems = myItems;
}
SubMenu.prototype = Object.create(Container.prototype);
SubMenu.prototype.constructor = SubMenu;
SubMenu.prototype.renderExisting = function () {
    var writeSubMenu = new Menu(this.menuId, this.menuClassName, this.menuItems);
    return '<li class="' + this.className + '"><a href="' + this.href + '" >' + this.label + '</a>' + writeSubMenu.render() + '</li>';
};
SubMenu.prototype.selectThis = function () {
    return (this.menu && this.menu != '') ? this.menu.querySelector('[href="' + this.href + '"]') : document.querySelector('[href="' + this.href + '"]');
};