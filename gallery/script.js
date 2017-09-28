window.onload = function () {
    'use strict';

    function CreateRequest() {
        var Request = false;
        if (window.XMLHttpRequest) {
            //Gecko-совместимые браузеры, Safari, Konqueror
            Request = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            //Internet explorer
            try {
                Request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (CatchException) {
                Request = new ActiveXObject("Msxml2.XMLHTTP");
            }
        }
        if (!Request) {
            alert("Невозможно создать XMLHttpRequest");
        }
        return Request;
    }
    /* Функция посылки запроса к файлу на сервере
    r_method  - тип запроса: GET или POST
    r_path    - путь к файлу
    r_args    - аргументы вида a=1&b=2&c=3...
    r_handler - функция-обработчик ответа от сервера */
    function SendRequest(r_method, r_path, r_args, r_handler) {
        var Request = CreateRequest();
        if (!Request) {
            return;
        }
        // Назначение пользовательского обработчика
        Request.onreadystatechange = function () {
            if (Request.readyState == XMLHttpRequest.DONE) {
                if (Request.status == 200) {
                    r_handler(Request);
                }
            }
        }
        // Инициализация запроса
        if (r_method.toLowerCase() == "get" && r_args.length > 0) {
            r_path += "?" + r_args;
        }
        Request.open(r_method, r_path, true);
        // Данные запроса
        if (r_method.toLowerCase() == "post") {
            Request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
            Request.send(r_args);
        } else {
            Request.send(null);
        }
    }
    // Универсальный класс создания тега
    function Container(myTag, myChildren, myClass, myAttributes, myOptions) {
        this.tag = myTag;
        this.elem = document.createElement((myTag) ? myTag : 'div');
        if (myChildren instanceof Array) {
            this.cChildren = myChildren;
        } else if (myChildren) {
            throw new Error("Во втором аргументе Container (myChildren) должен быть массив.")
        } else {
            this.cChildren = [];
        }
        this.cClassName = myClass;
        if (myAttributes instanceof Object) {
            this.cAttributes = myAttributes;
        } else if (myAttributes) {
            throw new Error("В четвёртом аргументе Container (myAttributes) должен быть объект.")
        } else {
            this.cAttributes = {};
        }
        if (myOptions instanceof Object) {
            this.cOptions = myOptions;
        } else if (myOptions) {
            throw new Error("В пятом аргументе Container (myOptions) должен быть объект.")
        } else {
            this.cOptions = {};
        }
    }
    Container.prototype.render = function () {
        if (this.elem) {
            var that = this;
            this.elem = document.createElement((this.tag) ? this.tag : 'div');
            this.cChildren.forEach(function (child) {
                if (child instanceof Container) {
                    that.elem.appendChild(child.render());
                } else if (typeof child == 'object') {
                    that.elem.appendChild(child);
                } else if (typeof child == 'string') {
                    that.elem.innerHTML += child;
                } else {
                    throw new Error("Неправильный тип потомка " + child);
                }
            });
            if (this.cClassName) {
                this.elem.className = this.cClassName;
            }
            for (var key in this.cAttributes) {
                this.elem.setAttribute(key, this.cAttributes[key]);
            }
            for (var key in this.cOptions) {
                this.elem[key] = this.cOptions[key];
            }
            return this.elem;
        }
        return false;
    };
    Container.prototype.remove = function () {
        if (this.elem) {
            if (this.elem.parentNode) {
                this.elem.parentNode.removeChild(this.elem);
            }
            this.elem = null;
        }
    };

    function closePopUp(popUp) {
        return function () {
            event.preventDefault();
            popUp.remove();
        }
    }

    function writePopUp(sources) {
        return function () {
            var popUp = new Container('div', [], 'popup');
            var popUpImg = new Container('img', [], 'popup__img', {
                "src": "img/" + sources.bigImg,
                "alt": "Обои"
            });
            var popUpClose = new Container('button', ["Закрыть"], 'popup__close', {}, {
                "onclick": closePopUp(popUp)
            });
            popUp.cChildren = [popUpImg, popUpClose];
            popUp.cOptions = {
                "onclick": closePopUp(popUp)
            };
            document.getElementsByTagName('body')[0].appendChild(popUp.render());
        }
    }
    
    var startScroll = 0;
    var makeScroll = true;
    var spinScroll = new Container('i', ["&#xe839;"], 'demo-icon icon-spin6 animate-spin');
    
    //Обработка AJAX-запроса
    function writeImg(result) {
        if (result.responseText.indexOf('[]') != -1) {
            scroller = null;
            document.getElementsByClassName('spinner')[0].removeChild(spinScroll.elem);
        } else {
            JSON.parse(result.responseText).forEach(function (sources) {
                var writeImg = new Container('img', [], 'gallery__img', {
                    "src": "img/" + sources.smallImg,
                    "alt": "Миниатюра"
                }, {
                    "onclick": writePopUp(sources)
                });
                document.getElementsByClassName('gallery')[0].appendChild(writeImg.render());
            });
            if (startScroll != 0) {
                makeScroll = true;
                document.getElementsByClassName('spinner')[0].removeChild(spinScroll.elem);
            }
        }
    }
    var scroller = function () {
        if (($(window).scrollTop() >= $(document).height() - $(window).height() - 10) && (makeScroll)) {
            makeScroll = false;
            document.getElementsByClassName('spinner')[0].appendChild(spinScroll.render());
            startScroll += 4
            setTimeout(function () {
                SendRequest('GET', 'ajax.php', 'time=' + new Date().getTime() + '&start=' + startScroll, writeImg);
            }, 1000);
        }
    };
    $(window).scroll(scroller);
    SendRequest('GET', 'ajax.php', 'time=' + new Date().getTime() + '&start=0', writeImg);
};
