(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;

        this.init = function () {
            // 1. Перевірка доступу до API Lampa
            console.log('Anitube: Init start');
            
            // Якщо це спрацює, ви побачите повідомлення прямо в інтерфейсі Lampa
            if (typeof Lampa !== 'undefined' && Lampa.Noty) {
                Lampa.Noty.show('Anitube плагін підключено!'); 
            } else {
                console.error('Anitube: Lampa object not found!');
                return;
            }

            // 2. Слухаємо подію відкриття картки
            if (Lampa.Listener && Lampa.Listener.follow) {
                Lampa.Listener.follow('full', function (e) {
                    // Цей лог має з'явитися, як тільки ви натиснете на будь-який фільм
                    console.log('Anitube: Event FULL triggered. Type:', e.type);

                    if (e.type == 'complite') {
                        console.log('Anitube: Card rendered. Searching for buttons...');
                        
                        // Спроба знайти різні варіанти контейнерів (для різних скінів)
                        var container = $('.full-start__buttons'); // Стандарт
                        if (container.length === 0) container = $('.full-start .buttons'); // Альтернатива
                        if (container.length === 0) container = $('.full-buttons'); // Ще варіант

                        console.log('Anitube: Container found?', container.length > 0, container);

                        if (container.length) {
                            var btn = $(
                                '<div class="full-start__button selector view--anitube" style="border: 1px solid red;">' + // Червона рамка для помітності
                                '<span style="padding: 0 10px;">ANITUBE TEST</span>' +
                                '</div>'
                            );

                            btn.on('hover:enter click', function () {
                                Lampa.Noty.show('Кнопка працює!');
                            });

                            container.prepend(btn);
                            console.log('Anitube: Button appended!');
                        }
                    }
                });
            } else {
                console.error('Anitube: Lampa.Listener not available');
            }
        };
    }

    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
    }
})();
