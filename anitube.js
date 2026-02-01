(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;
        var timer = null;

        this.init = function () {
            // Показуємо повідомлення, щоб ви точно знали, що це НОВА версія
            Lampa.Noty.show('Anitube v7: Пошук кнопок...');

            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // Очищаємо старий таймер
                    if(timer) clearInterval(timer);

                    var attempt = 0;
                    
                    // ЗАПУСКАЄМО ТАЙМЕР: Перевіряємо наявність кнопок кожні 0.5 секунди
                    timer = setInterval(function() {
                        attempt++;
                        if(attempt > 20) { // Перестаємо шукати через 10 секунд
                            clearInterval(timer);
                            return; 
                        }

                        // Шукаємо активне вікно (шар, який зараз бачить користувач)
                        var active = Lampa.Activity.active().render();
                        
                        // 1. Шукаємо стандартні кнопки
                        var buttons = active.find('.full-start__buttons');
                        
                        // 2. Якщо кнопок немає, шукаємо заголовок (h1) - він є завжди!
                        var title = active.find('h1');

                        // Перевірка: чи ми вже додали кнопку? (щоб не дублювати)
                        if (active.find('.view--anitube').length > 0) {
                            clearInterval(timer); 
                            return;
                        }

                        // Логіка вставки
                        if (buttons.length) {
                            // ВАРІАНТ А: Знайшли панель кнопок
                            var btn = $(
                                '<div class="full-start__button selector view--anitube">' +
                                '<div style="background: #c62828; padding: 6px 12px; border-radius: 20px; color: white; font-weight: bold; font-size: 13px; display: flex; align-items: center;">' +
                                '<span>ANITUBE</span>' +
                                '</div>' +
                                '</div>'
                            );
                            
                            btn.on('hover:enter click', function () {
                                _this.searchAndPlay(e.object);
                            });

                            buttons.prepend(btn);
                            Lampa.Noty.show('Anitube: Кнопку додано!');
                            clearInterval(timer); // Зупиняємо пошук

                        } else if (title.length) {
                            // ВАРІАНТ Б: Знайшли заголовок (якщо кнопки сховані)
                            var link = $('<div class="selector view--anitube" style="display: inline-block; margin-left: 15px; background: #c62828; color: white; padding: 5px 10px; border-radius: 5px; font-size: 0.5em; vertical-align: middle; cursor: pointer;">ANITUBE PLAY</div>');
                            
                            link.on('hover:enter click', function () {
                                _this.searchAndPlay(e.object);
                            });

                            title.append(link);
                            Lampa.Noty.show('Anitube: Кнопка біля заголовка!');
                            clearInterval(timer); 
                        }

                    }, 500); // Перевірка кожні 0.5 сек
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
