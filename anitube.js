(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;

        this.init = function () {
            Lampa.Noty.show('Anitube v5: Старт');

            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // 1. Отримуємо об'єкт активного вікна через API
                    var activity = Lampa.Activity.active();
                    
                    // Отримуємо його DOM-елемент (jQuery об'єкт)
                    var view = activity.render();

                    Lampa.Noty.show('Пошук місця для кнопки...');

                    // --- СПРОБА 1: Стандартне місце кнопок ---
                    var target = view.find('.full-start__buttons');
                    
                    // --- СПРОБА 2: Якщо немає кнопок, шукаємо заголовок ---
                    if (target.length === 0) {
                        target = view.find('.full-start__title');
                        console.log('Anitube: Кнопки не знайдено, чіпляємось до заголовка');
                    }

                    // --- СПРОБА 3: Якщо взагалі нічого немає, беремо весь контейнер ---
                    if (target.length === 0) {
                        target = view.find('.full-start');
                    }

                    if (target.length) {
                        var btn = $(
                            '<div class="full-start__button selector view--anitube" style="background-color: #2b2b2b; border: 1px solid #fff; margin-top: 10px;">' +
                            '<svg style="width: 20px; height: 20px; margin-right: 7px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                            '<path d="M8 5v14l11-7z" fill="#fff"/>' +
                            '</svg>' +
                            '<span>Anitube Play</span>' +
                            '</div>'
                        );

                        btn.on('click hover:enter', function () {
                            Lampa.Noty.show('Відкриваємо Anitube...');
                            _this.searchAndPlay(e.object);
                        });

                        // Якщо знайшли кнопки - вставляємо на початок
                        if (target.hasClass('full-start__buttons')) {
                            target.prepend(btn);
                        } 
                        // Якщо знайшли заголовок - вставляємо ПІСЛЯ нього
                        else {
                            target.after(btn);
                        }
                        
                        Lampa.Noty.show('Anitube: Кнопка додана через API!');
                    } else {
                        // --- ЗАПАСНИЙ ВАРІАНТ: Додаємо в шапку (Header) ---
                        var head = $('.head .head__content');
                        if (head.length) {
                            var headBtn = $('<div class="head__action selector">Anitube</div>');
                            headBtn.on('click hover:enter', function(){
                                _this.searchAndPlay(e.object);
                            });
                            head.append(headBtn);
                            Lampa.Noty.show('Кнопка в шапці!');
                        } else {
                            Lampa.Noty.show('Критично: Не знайдено жодного елемента');
                        }
                    }
                }
            });
        };

        this.searchAndPlay = function (movie) {
            // Тимчасово відкриваємо пошук у браузері
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
