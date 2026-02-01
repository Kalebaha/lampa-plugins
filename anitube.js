(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;
        var timer = null;

        this.init = function () {
            // Безпечний старт
            try {
                Lampa.Noty.show('Anitube v8: Start');
                
                Lampa.Listener.follow('full', function (e) {
                    if (e.type == 'complite') {
                        // Запускаємо захищену функцію пошуку кнопки
                        _this.findButtonSafe(e.object);
                    }
                });
            } catch (error) {
                Lampa.Noty.show('Error Init: ' + error.message);
            }
        };

        this.findButtonSafe = function (movieObject) {
            // Очищаємо старий таймер
            if (timer) clearInterval(timer);
            
            var attempt = 0;

            timer = setInterval(function () {
                try {
                    attempt++;
                    if (attempt > 15) {
                        clearInterval(timer);
                        return;
                    }

                    // Перевірка: чи існує активне вікно?
                    var activity = Lampa.Activity.active();
                    if (!activity) return; // Ще рано

                    var view = activity.render(); // Отримуємо HTML
                    if (!view) return; // Ще рано

                    // Шукаємо місця для кнопки
                    var buttons = view.find('.full-start__buttons');
                    var title = view.find('h1');

                    // Перевірка дублікатів
                    if (view.find('.view--anitube').length) {
                        clearInterval(timer);
                        return;
                    }

                    // Логіка вставки
                    if (buttons.length) {
                        var btn = $(
                            '<div class="full-start__button selector view--anitube">' +
                            '<div style="background: #b71c1c; color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: bold;">ANITUBE</div>' +
                            '</div>'
                        );
                        
                        btn.on('hover:enter click', function () {
                            _this.searchAndPlay(movieObject);
                        });

                        buttons.prepend(btn);
                        Lampa.Noty.show('Anitube: Кнопка (Panel) OK');
                        clearInterval(timer);
                    } 
                    else if (title.length) {
                        var link = $('<span class="view--anitube selector" style="color: #b71c1c; border: 1px solid #b71c1c; padding: 2px 6px; border-radius: 4px; margin-left: 10px; font-size: 0.5em; vertical-align: middle; cursor: pointer;">ANITUBE PLAY</span>');
                        
                        link.on('hover:enter click', function () {
                            _this.searchAndPlay(movieObject);
                        });

                        title.append(link);
                        Lampa.Noty.show('Anitube: Кнопка (Title) OK');
                        clearInterval(timer);
                    }

                } catch (innerError) {
                    // Якщо помилка всередині таймера - показуємо її і зупиняємось
                    Lampa.Noty.show('Error Loop: ' + innerError.message);
                    clearInterval(timer);
                }
            }, 800);
        };

        this.searchAndPlay = function (movie) {
            try {
                var title = encodeURIComponent(movie.title || movie.original_title || 'anime');
                var url = 'https://anitube.in.ua/index.php?do=search&subaction=search&story=' + title;
                Lampa.Platform.openURL(url);
            } catch (e) {
                Lampa.Noty.show('Error Play: ' + e.message);
            }
        };
    }

    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
    }
})();
