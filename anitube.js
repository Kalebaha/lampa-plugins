(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;

        this.init = function () {
            console.log('Anitube Plugin: Init started'); // Лог 1: Старт

            Lampa.Listener.follow('full', function (e) {
                // e.type 'complite' означає, що картка фільму повністю завантажилась і відмалювалась
                if (e.type == 'complite') {
                    console.log('Anitube Plugin: Full page loaded', e.object); // Лог 2: Сторінка відкрита

                    // Шукаємо контейнер для кнопок.
                    // .full-start__buttons - стандартний клас для десктоп/ТВ версії
                    var buttons = $('.full-start__buttons');
                    
                    if (buttons.length) {
                        console.log('Anitube Plugin: Buttons container found'); // Лог 3: Контейнер знайдено
                        
                        // Створюємо кнопку
                        var btn = $(
                            '<div class="full-start__button selector view--anitube">' +
                            '<svg style="width: 20px; height: 20px; margin-right: 5px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                            '<path d="M10 9V15L15 12L10 9Z" fill="currentColor"/>' +
                            '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>' +
                            '</svg>' +
                            '<span>Anitube</span>' +
                            '</div>'
                        );

                        // Подія натискання (для миші та тачскрінів)
                        btn.on('click', function() {
                            _this.searchAndPlay(e.object);
                        });

                        // Подія для пульта (Lampa використовує власну систему навігації 'hover:enter')
                        btn.on('hover:enter', function () {
                            _this.searchAndPlay(e.object);
                        });

                        // Вставляємо кнопку ПЕРШОЮ, щоб точно побачити
                        buttons.prepend(btn);
                    } else {
                        console.error('Anitube Plugin: Buttons container (.full-start__buttons) NOT found!');
                    }
                }
            });
        };

        this.searchAndPlay = function (movie) {
            var title = movie.title || movie.original_title;
            Lampa.Noty.show('Шукаємо на Anitube: ' + title);
            console.log('Anitube Search:', title);
            
            // Тут поки заглушка, щоб перевірити кнопку
        };
    }

    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
    }
})();
