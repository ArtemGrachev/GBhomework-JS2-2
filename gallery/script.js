window.onload = function() {
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
        Request.onreadystatechange = function() {
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
            Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
            Request.send(r_args);
        } else {
            Request.send(null);
        }
    }
    function closePopUp() {
        event.preventDefault();
        var closing = document.getElementsByClassName('popup')[0];
        closing.parentElement.removeChild(closing);
    }
    function writeImg(result) {
        JSON.parse(result.responseText).forEach(function (sources) {
            var writeImg = document.createElement('img'),
                writeA = document.createElement('a');
            writeImg.className = 'gallery__img'
            writeImg.setAttribute('src', 'img/' + sources.smallImg);
            writeImg.setAttribute('alt', 'Миниатюра');
            writeA.appendChild(writeImg);
            writeA.className = 'gallery__a';
            writeA.onclick = function() {
                event.preventDefault();
                var popUpImg = document.createElement('img');
                popUpImg.className = 'popup__img'
                popUpImg.setAttribute('src', 'img/' + sources.bigImg)
                popUpImg.setAttribute('alt', 'Обои');
                var popUpClose = document.createElement('button');
                popUpClose.className = 'popup__close';
                popUpClose.innerHTML = 'Закрыть';
                popUpClose.onclick = closePopUp;
                var popUp = document.createElement('div');
                popUp.appendChild(popUpImg);
                popUp.appendChild(popUpClose);
                popUp.className = 'popup';
                popUp.onclick = closePopUp;
                document.getElementsByTagName('body')[0].appendChild(popUp);
            }
            document.getElementsByClassName('gallery')[0].appendChild(writeA);
        });
    }
    SendRequest('GET', 'files.json', 'time=' + new Date().getTime(), writeImg);
};