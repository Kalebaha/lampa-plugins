(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;
        var timer = null;

        this.init = function () {
            // Повідомлення про старт
            Lampa.Noty.show('Anitube v9: Старт');

            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    
                    // Очищаємо старий таймер
                    if (timer) clearInterval(timer);
                    
                    var attempt = 0;

                    // Запускаємо таймер пошуку
                    timer = setInterval(function() {
                        attempt++;
                        if (attempt > 20) { // Шукаємо 10 секунд
                            clearInterval(timer);
                            return;
                        }

                        // --- ГОЛОВНА ЗМІНА: Прямий пошук через jQuery ---
                        // Ми не питаємо Lampa "де активне вікно", ми самі шукаємо його в HTML
                        var active_view = $('.activity.active');

                        if (active_view.length) {
                            // Шукаємо кнопку "Play" (Дивитись) всередині активного вікна
                            var playBtn = active_view.find('.view--play');
                            
                            // Шукаємо заголовок як запасний варіант
                            var title = active_view.find('h1');

                            // Перевірка, чи ми вже додали кнопку
                            if (active_view.find('.view--anitube').length > 0) {
                                clearInterval(timer);
                                return;
                            }

                            if (playBtn.length) {
                                // Створюємо кнопку
                                var btn = $(
                                    '<div class="full-start__button selector view--anitube" style="margin-left: 10px;">' +
                                    '<div style="background: #e50914; color: #fff; padding: 0 15px; height: 100%; display: flex; align-items: center; border-radius: 5px; font-weight: bold;">' +
                                    'ANITUBE' +
                                    '</div>' +
                                    '</div>'
                                );

                                // Додаємо подію
                                btn.on('hover:enter click', function () {
                                    _this.searchAndPlay(e.object);
                                });

                                // Вставляємо ПІСЛЯ кнопки "Дивитись"
                                playBtn.after(btn);
                                
                                Lampa.Noty.show('Anitube: Кнопка додана (v9)!');
                                clearInterval(timer);
                            } 
                            else if (title.length) {
                                // Запасний план: біля заголовка
                                var link = $('<span class="view--anitube selector" style="background: #e50914; color: white; padding: 5px 10px; border-radius: 5px; margin-left: 15px; font-size: 14px; cursor: pointer;">ANITUBE</span>');
                                
                                link.on('hover:enter click', function () {
                                    _this.searchAndPlay(e.object);
                                });

                                title.append(link);
                                Lampa.Noty.show('Anitube: Додано до заголовка');
                                clearInterval(timer);
                            }
                        }
                    }, 500); // Перевіряємо кожні 0.5 сек
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
