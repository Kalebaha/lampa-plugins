(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;
        var timer = null;

        this.init = function () {
            Lampa.Noty.show('Anitube v7: Мисливець запущений');

            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // Очищаємо попередній таймер, якщо був
                    if(timer) clearInterval(timer);

                    var attempt = 0;
                    
                    // ЗАПУСКАЄМО ТАЙМЕР: Перевіряємо кожні 0.8 секунди
                    timer = setInterval(function() {
                        attempt++;
                        if(attempt > 20) { // Здаємося через 16 секунд
                            clearInterval(timer);
                            return; 
                        }

                        // Шукаємо активне вікно
                        var active = $('.activity.active'); 
                        
                        // 1. Спроба знайти панель кнопок (найкращий варіант)
                        var buttons = active.find('.full-start__buttons');
                        
                        // 2. Якщо кнопок немає, шукаємо заголовок (h1)
                        var title = active.find('h1');

                        // Перевірка: чи ми вже додали кнопку?
                        if (active.find('.view--anitube').length > 0) {
                            clearInterval(timer); // Вже є, зупиняємось
                            return;
                        }

                        if (buttons.length) {
                            // ВАРІАНТ А: Знайшли панель кнопок
                            var btn = $(
                                '<div class="full-start__button selector view--anitube">' +
                                '<div style="background: #e50914; padding: 5px 10px; border-radius: 20px; color: white; font-weight: bold; font-size: 12px;">ANITUBE</div>' +
                                '</div>'
                            );
                            
                            btn.on('hover:enter click', function () {
                                _this.searchAndPlay(e.object);
                            });

                            buttons.prepend(btn);
                            Lampa.Noty.show('Anitube: Знайшов кнопки!');
                            clearInterval(timer); // Успіх, зупиняємось

                        } else if (title.length) {
                            // ВАРІАНТ Б: Знайшли заголовок
                            var link = $('<span class="view--anitube selector" style="margin-left: 20px; font-size: 0.6em; background: #e50914; padding: 5px 10px; border-radius: 5px; cursor: pointer; color: white; vertical-align: middle;">▶ ANITUBE</span>');
                            
                            link.on('hover:enter click', function () {
                                _this.searchAndPlay(e.object);
                            });

                            title.append(link);
                            Lampa.Noty.show('Anitube: Причепився до заголовка!');
                            clearInterval(timer); // Успіх
                        }

                    }, 800); // Інтервал 800 мс
                }
            });
        };

        this.searchAndPlay = function (movie) {
            var title = encodeURIComponent(movie.title);
            var url = 'https://anitube.in.ua/index.php?do=search&subaction=search&story=' + title;
            Lampa.Platform.openURL(url);
        };
    }

    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
    }
})();
