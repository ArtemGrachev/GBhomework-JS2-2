'use strict';
function Container(myTag, myId, myClass) {
    this.id = myId;
    this.className = myClass;
    this.htmlCode = "";
    this.elem = document.createElement((myTag) ? myTag : 'div');
}
Container.prototype.render = function () {
    if (this.elem) {
        if (this.id) {
            this.elem.id = this.id;
        }
        if (this.className) {
            this.elem.className = this.className;
        }
        this.innerHTML = this.htmlCode;
        return this.elem;
    }
    return false;
};

Container.prototype.remove = function () {
    if (this.elem.parentNode) {
        this.elem.parentNode.removeChild(this.elem);
    }
    this.elem = null;
};

function Menu(myId, myClass, myItems) {
    Container.call(this, 'ul', myId, myClass);
    this.items = myItems;
}
Menu.prototype = Object.create(Container.prototype);
Menu.prototype.constructor = Menu;
Menu.prototype.render = function () {
    if (this.elem) {
        var i,
            compileItem;
        this.elem = document.createElement('ul');
        if (this.id) {
            this.elem.id = this.id;
        }
        this.elem.className = this.className;
        for (i = 0; i < this.items.length; i++) {
            if ((typeof this.items[i] == 'object') &&
                (this.items[i][0] instanceof MenuItem) &&
                (this.items[i][1] instanceof Menu))
            {
                if (this.items[i][0].render()) {
                    compileItem = this.items[i][0].render();
                }
                if (this.items[i][1].render()) {
                    compileItem.appendChild(this.items[i][1].render());
                }
                this.elem.appendChild(compileItem);
            } else if (this.items[i] instanceof MenuItem) {
                if (this.items[i].render()) {
                    this.elem.appendChild(this.items[i].render());
                }
            }
        }
        return this.elem;
    }
    return false;
};

function MenuItem(myHref, myLabel) {
    Container.call(this, 'li', '', 'menu-item');
    this.href = myHref;
    this.htmlCode = myLabel;
}
MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.constructor = MenuItem;
MenuItem.prototype.render = function () {
    if (this.elem) {
        var elemA = document.createElement('a');
        elemA.setAttribute('href', this.href);
        elemA.innerHTML = this.htmlCode;
        this.elem = document.createElement('li');
        this.elem.className = this.className;
        this.elem.appendChild(elemA);
        return this.elem;
    }
    return false;
};