(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;
        var observer = null;

        this.init = function () {
            Lampa.Noty.show('Anitube v10: Спостерігач');

            // Слідкуємо за змінами всього тіла сторінки
            observer = new MutationObserver(function (mutations) {
                // Перевіряємо, чи ми на сторінці фільму (чи є блок опису)
                var fullStart = $('.full-start');
                
                if (fullStart.length) {
                    // Перевіряємо, чи ми вже додали кнопку
                    if ($('.view--anitube').length) return;

                    // 1. Шукаємо кнопку "Дивитись" за ТЕКСТОМ (найбільш надійно)
                    var watchBtn = fullStart.find('.selector').filter(function() {
                        return $(this).text().trim() === 'Дивитись';
                    });

                    // 2. Якщо за текстом не знайшли, шукаємо за класом Play
                    if (!watchBtn.length) {
                        watchBtn = fullStart.find('.view--play');
                    }

                    // 3. Якщо і так не знайшли, шукаємо контейнер кнопок
                    if (!watchBtn.length) {
                         watchBtn = fullStart.find('.full-start__buttons');
                         // Якщо знайшли контейнер, будемо вставляти всередину (prepend)
                         if (watchBtn.length) {
                             _this.injectButton(watchBtn, true); // true = вставка на початок
                             return;
                         }
                    }

                    // Якщо знайшли конкретну кнопку "Дивитись"
                    if (watchBtn.length) {
                        _this.injectButton(watchBtn, false); // false = вставка після кнопки
                    }
                }
            });

            // Починаємо стежити за DOM
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        };

        this.injectButton = function (target, isContainer) {
            // Щоб не отримати помилку, беремо об'єкт фільму з активності, якщо доступно
            var activity = Lampa.Activity.active();
            var movie = activity ? activity.component.object : null;

            if (!movie) return; // Без даних про фільм кнопка не потрібна

            var btn = $(
                '<div class="full-start__button selector view--anitube" style="margin-left: 10px;">' +
                '<div style="background: linear-gradient(90deg, #ff0000, #b30000); color: white; padding: 0 15px; height: 100%; display: flex; align-items: center; border-radius: 5px; font-weight: bold; box-shadow: 0 0 10px rgba(255,0,0,0.3);">' +
                'UA' +
                '</div>' +
                '</div>'
            );

            btn.on('hover:enter click', function () {
                var title = encodeURIComponent(movie.title);
                var url = 'https://anitube.in.ua/index.php?do=search&subaction=search&story=' + title;
                Lampa.Platform.openURL(url);
            });

            if (isContainer) {
                target.prepend(btn);
            } else {
                target.after(btn);
            }
            
            console.log('Anitube: Button injected!');
        };
    }

    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
    }
})();
