(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;

        this.init = function () {
            Lampa.Noty.show('Anitube Floating: Завантажено');

            // Слідкуємо за відкриттям картки
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // Видаляємо стару кнопку, якщо вона залишилась з попереднього екрану
                    $('.anitube-floating-btn').remove();

                    // Створюємо кнопку з фіксованою позицією (поверх усього)
                    var btn = $(
                        '<div class="anitube-floating-btn" style="position: fixed; top: 100px; right: 20px; z-index: 10000; background: #d32f2f; color: white; padding: 15px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.5); font-weight: bold; cursor: pointer;">' +
                        'WATCH ANITUBE' +
                        '</div>'
                    );

                    // Додаємо подію кліку
                    btn.on('click hover:enter', function () {
                        _this.searchAndPlay(e.object);
                    });

                    // Додаємо прямо в BODY, щоб ігнорувати структуру сторінки
                    $('body').append(btn);
                    
                    Lampa.Noty.show('Кнопка додана справа зверху!');
                }
            });
            
            // При виході з картки прибираємо кнопку
            Lampa.Listener.follow('activity', function (e) {
                if (e.type === 'back') {
                     $('.anitube-floating-btn').remove();
                }
            });
        };

        this.searchAndPlay = function (movie) {
            var title = movie.title || movie.original_title;
            // Кодуємо назву для URL
            var search_url = 'https://anitube.in.ua/index.php?do=search&subaction=search&story=' + encodeURIComponent(title);
            
            // Відкриваємо в новому вікні (або в браузері ТВ)
            // Це тимчасово, щоб перевірити посилання
            Lampa.Platform.openURL(search_url); 
            
            Lampa.Noty.show('Відкриваємо Anitube...');
        };
    }

    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
    }
})();
