(function () {
    'use strict';

    function AnitubePlugin() {
        var _this = this;
        var observer = null;

        this.init = function () {
            Lampa.Noty.show('Anitube v11: Завантажено');

            // Використовуємо MutationObserver, бо це найнадійніший спосіб спіймати момент появи кнопок
            observer = new MutationObserver(function (mutations) {
                
                // 1. Перевірка: чи ми вже додали кнопку? (щоб не плодити дублікати)
                if ($('.view--anitube').length > 0) return;

                // 2. Шукаємо елементи за точними класами з вашого скріншоту
                var playBtn = $('.button--play');
                var container = $('.full-start-new__buttons');

                if (playBtn.length) {
                    // Створюємо кнопку
                    var btn = $(
                        '<div class="full-start__button selector view--anitube" style="margin-left: 10px; cursor: pointer;">' +
                        '<div style="background: linear-gradient(90deg, #d32f2f, #b71c1c); color: white; padding: 0 15px; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: bold; font-size: 1.1em; min-width: 80px;">' +
                        'UA' +
                        '</div>' +
                        '</div>'
                    );

                    // Додаємо подію кліку
                    btn.on('hover:enter click', function () {
                        // Отримуємо дані про фільм безпечно
                        var activity = Lampa.Activity.active();
                        if (activity && activity.component && activity.component.object) {
                            _this.searchAndPlay(activity.component.object);
                        } else {
                            Lampa.Noty.show('Помилка отримання назви фільму');
                        }
                    });

                    // Вставляємо ПІСЛЯ кнопки Play (Insert After)
                    playBtn.after(btn);
                    
                    console.log('Anitube: Button injected successfully!');
                } 
                else if (container.length) {
                    // Запасний варіант: якщо кнопку Play не знайдено, але контейнер є
                    var btnSimple = $('<div class="full-start__button selector view--anitube">ANITUBE</div>');
                    container.append(btnSimple);
                }
            });

            // Починаємо стежити за змінами на сторінці
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        };

        this.searchAndPlay = function (movie) {
            var title = movie.title;
            // Кодуємо назву для URL
            var searchUrl = 'https://anitube.in.ua/index.php?do=search&subaction=search&story=' + encodeURIComponent(title);
            
            Lampa.Noty.show('Відкриваємо Anitube: ' + title);
            Lampa.Platform.openURL(searchUrl);
        };
    }

    if (!window.plugin_anitube) {
        window.plugin_anitube = new AnitubePlugin();
        window.plugin_anitube.init();
    }
})();
