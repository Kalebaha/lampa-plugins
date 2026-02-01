(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;

        this.init = function () {
            // Додаємо компонент в Lampa
            Lampa.Component.add('anitube_plugin', function () {
                var item = Lampa.Component.get('anitube_plugin');
                return item;
            });

            // Додаємо кнопку на сторінку опису фільму/серіалу
            Lampa.Listener.follow('full', function (data) {
                if (data.type == 'complite') {
                    // Перевіряємо, чи це аніме (можна за жанром або ключовими словами)
                    // Тут простий приклад - додаємо кнопку завжди
                    var btn = $('<div class="full-start__button selector view--anitube"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 9V15L15 12L10 9Z" fill="currentColor"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg><span>Anitube</span></div>');

                    btn.on('hover:enter', function () {
                        // Логіка при натисканні: пошук на anitube
                        _this.searchAndPlay(data.object);
                    });

                    $('.full-start__buttons').append(btn);
                }
            });
        };

        this.searchAndPlay = function (movie_data) {
            // 1. Формуємо пошуковий запит
            var query = encodeURIComponent(movie_data.title); // Або movie_data.original_title
            var search_url = 'https://anitube.in.ua/index.php?do=search&subaction=search&story=' + query;
            
            // Відображаємо вікно завантаження
            Lampa.Loading.start(function () {
                Lampa.Loading.stop();
            });

            // 2. Робимо запит на сайт (УВАГА: Тут може бути проблема з CORS без проксі)
            var network = new Lampa.Reguest();
            network.silent(search_url, function (html) {
                Lampa.Loading.stop();
                
                // Тут логіка парсингу HTML результатів пошуку
                // Це приклад, реальні селектори треба брати з сайту anitube
                // var link = $(html).find('.search-result a').attr('href');
                
                Lampa.Noty.show('Пошук на Anitube: ' + movie_data.title);
                console.log("HTML отримано", html);

                // Якщо знайшли відео, запускаємо плеєр
                /*
                var video = {
                    title: movie_data.title,
                    url: 'URL_VIDEO_FILE_M3U8' 
                };
                Lampa.Player.play(video);
                Lampa.Player.playlist([video]);
                */
                
            }, function (a, c) {
                Lampa.Loading.stop();
                Lampa.Noty.show('Помилка мережі або CORS. Спробуйте через проксі.');
            });
        };
    }

    // Ініціалізація плагіна
    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
        console.log('Anitube Plugin: Loaded');
    }
})();