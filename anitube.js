(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;

        this.init = function () {
            // Повідомлення при запуску Lampa
            Lampa.Noty.show('Anitube v3: Плагін стартував');

            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // Повідомлення, що ми зайшли в картку фільму
                    Lampa.Noty.show('Anitube: Картка відкрита. Чекаємо 2 сек...');

                    // ЧЕКАЄМО 2 СЕКУНДИ, поки інтерфейс точно завантажиться
                    setTimeout(function () {
                        
                        // Шукаємо місце для кнопки (різні варіанти класів)
                        var container = $('.full-start__buttons');
                        if (!container.length) container = $('.buttons'); 
                        if (!container.length) container = $('.full-buttons');

                        if (container.length) {
                            // Якщо знайшли контейнер
                            Lampa.Noty.show('Anitube: Контейнер знайдено! Додаю кнопку.');
                            
                            var btn = $(
                                '<div class="full-start__button selector view--anitube">' +
                                '<svg style="width: 20px; height: 20px; margin-right: 7px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                '<path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 16.5V7.5L16 12L10 16.5Z" fill="#fff"/>' +
                                '</svg>' +
                                '<span>Anitube</span>' +
                                '</div>'
                            );

                            btn.on('hover:enter click', function () {
                                Lampa.Noty.show('Натиснуто Anitube: ' + (e.object.title || 'Без назви'));
                                _this.searchAndPlay(e.object);
                            });

                            // Вставляємо кнопку першою
                            container.prepend(btn);

                        } else {
                            // Якщо контейнер НЕ знайдено
                            Lampa.Noty.show('Anitube помилка: Немає куди вставити кнопку (.full-start__buttons)');
                            
                            // Аварійний варіант: виводимо список класів, які є на сторінці (для діагностики)
                            // Це покаже, які класи бачить скрипт
                            var bodyClasses = $('body').attr('class');
                            // Lampa.Noty.show('Body classes: ' + bodyClasses);
                        }

                    }, 2000); // 2000 мс = 2 секунди затримки
                }
            });
        };

        this.searchAndPlay = function (movie) {
             // Тут поки просто тест
             var query = encodeURIComponent(movie.title);
             var url = 'https://anitube.in.ua/index.php?do=search&subaction=search&story=' + query;
             
             Lampa.Platform.openURL(url); // Спробує відкрити сайт у браузері (для тесту)
        };
    }

    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
    }
})();
