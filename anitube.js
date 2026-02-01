(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;

        this.init = function () {
            Lampa.Noty.show('Anitube v6: Loaded');

            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // Чекаємо трохи довше, щоб інтерфейс точно завантажився
                    setTimeout(function () {
                        // Отримуємо активне вікно
                        var view = Lampa.Activity.active().render();
                        
                        // Шукаємо кнопку Play (клас view--play є стандартним для всіх скінів)
                        var playBtn = view.find('.view--play');

                        if (playBtn.length) {
                            // Якщо знайшли Play, створюємо нашу кнопку
                            var btn = $(
                                '<div class="full-start__button selector view--anitube" style="margin-left: 10px;">' +
                                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                '<circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2"/>' +
                                '<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold">UA</text>' +
                                '</svg>' +
                                '</div>'
                            );

                            // Додаємо дію
                            btn.on('click hover:enter', function () {
                                _this.searchAndPlay(e.object);
                            });

                            // Вставляємо ПІСЛЯ кнопки Play
                            playBtn.after(btn);
                            Lampa.Noty.show('Anitube: Кнопку додано біля Play!');
                        } else {
                            // План Б: Якщо Play не знайдено, пробуємо причепитись до заголовка
                            var title = view.find('.full-start__title');
                            if (title.length) {
                                title.append(' <span style="color:red; border:1px solid red; padding:5px;">[ANITUBE]</span>');
                            }
                            Lampa.Noty.show('Anitube: Кнопку Play не знайдено (' + playBtn.length + ')');
                        }

                    }, 1500); // 1.5 секунди затримки
                }
            });
        };

        this.searchAndPlay = function (movie) {
            var title = encodeURIComponent(movie.title);
            var url = 'https://anitube.in.ua/index.php?do=search&subaction=search&story=' + title;
            Lampa.Noty.show('Відкриваємо Anitube...');
            Lampa.Platform.openURL(url);
        };
    }

    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
    }
})();
