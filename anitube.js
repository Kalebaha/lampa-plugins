(function () {
    'use strict';

    // 1. Моментальне повідомлення при завантаженні файлу
    // Якщо ви не бачите цього повідомлення - значить завантажилась стара версія файлу (КЕШ!)
    if(typeof Lampa !== 'undefined') {
        Lampa.Noty.show('Anitube: Скрипт завантажено! (v4)');
    }

    // 2. Функція додавання кнопки
    function addAnitubeButton(object) {
        // Шукаємо будь-яку панель кнопок
        var buttons = $('.full-start__buttons, .full-buttons, .buttons').first();

        if (buttons.length) {
            // Перевіряємо, чи ми вже не додали кнопку, щоб не дублювати
            if (buttons.find('.view--anitube').length) return;

            var btn = $(
                '<div class="full-start__button selector view--anitube">' +
                '<svg style="width: 20px; height: 20px; margin-right: 7px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2"/>' +
                '<path d="M10 8L16 12L10 16V8Z" fill="#fff"/>' +
                '</svg>' +
                '<span>Anitube</span>' +
                '</div>'
            );

            btn.on('hover:enter click', function () {
                Lampa.Noty.show('Відкриваємо: ' + (object.title || 'Відео'));
                // Тут потім буде логіка запуску
                var searchUrl = 'https://anitube.in.ua/index.php?do=search&subaction=search&story=' + encodeURIComponent(object.title);
                console.log('Open:', searchUrl);
                Lampa.Platform.openURL(searchUrl); // Тимчасово відкриваємо в новому вікні
            });

            buttons.prepend(btn);
            Lampa.Noty.show('Anitube: Кнопка додана');
        } else {
            console.log('Anitube: Кнопки не знайдено');
        }
    }

    // 3. Слухач подій
    if (window.lampa_listener) window.lampa_listener.destroy(); // Видаляємо старий слухач, якщо був

    window.lampa_listener = Lampa.Listener.follow('full', function (e) {
        if (e.type == 'complite') {
            // Невелика затримка, щоб інтерфейс промалювався
            setTimeout(function() {
                addAnitubeButton(e.object);
            }, 1000);
        }
    });

})();
