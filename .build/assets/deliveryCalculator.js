ymaps.ready(init);

function init() {
    // Стоимость за километр.
    var DELIVERY_TARIFF = 10,
    // Минимальная стоимость.
        MINIMUM_COST = 50,
        myMap = new ymaps.Map('map', {
            center: [58.60336542074188, 49.66828333142079],
            zoom: 9,
            controls: []
        }),
    // Создадим панель маршрутизации.
        routePanelControl = new ymaps.control.RoutePanel({
            options: {
                // Добавим заголовок панели.
                showHeader: true,
                title: 'Расчёт доставки'
            }
        }),
        zoomControl = new ymaps.control.ZoomControl({
            options: {
                size: 'small',
                float: 'none',
                position: {
                    bottom: 145,
                    right: 10
                }
            }
        });
    // Пользователь сможет построить только автомобильный маршрут.
    routePanelControl.routePanel.options.set({
        types: {auto: true},
        reverseGeocoding: true

    });

    // Если вы хотите задать неизменяемую точку "откуда", раскомментируйте код ниже.
    routePanelControl.routePanel.state.set({
        fromEnabled: false,
        from: 'Киров, Московская улица, 36'
     });

    myMap.controls.add(routePanelControl).add(zoomControl);

    // Получим ссылку на маршрут.
    routePanelControl.routePanel.getRouteAsync().then(function (route) {

        // Зададим максимально допустимое число маршрутов, возвращаемых мультимаршрутизатором.
        route.model.setParams({results: 1}, true);

        // Повесим обработчик на событие построения маршрута.
        route.model.events.add('requestsuccess', function () {

            var activeRoute = route.getActiveRoute();
            if (activeRoute) {
                // Получим протяженность маршрута.
                var length = route.getActiveRoute().properties.get("distance"),
                // Вычислим стоимость доставки.
                    price = calculate(Math.round(length.value / 1000)),
                // Создадим макет содержимого балуна маршрута.
                    balloonContentLayout = ymaps.templateLayoutFactory.createClass(
                        '<span>Расстояние: ' + length.text + '.</span><br/>' +
                        '<span style="font-weight: bold; font-style: italic">Стоимость доставки: ' + price + ' р.</span>');
                // Зададим этот макет для содержимого балуна.
                route.options.set('routeBalloonContentLayout', balloonContentLayout);
                // Откроем балун.
                activeRoute.balloon.open();

                set_field_form(route.properties._data.waypoints[1].address, price);
                


            }
        });

    });
    // Функция, вычисляющая стоимость доставки.
    function calculate(routeLength) {
        let calc = Math.max(routeLength * DELIVERY_TARIFF, MINIMUM_COST);
        console.log(calc);
        return calc;

    }

    function set_field_form(a_address, a_price) {

        let el = document.querySelector("#inputaddress");
        if (el) {
            el.value = a_address;
        }
        
        el = document.querySelector("#div_inputaddress");
        if (el) {
            el.innerHTML = a_address;
        }

        el = document.querySelector("#d_sum");
        if (el) {
            el.value = a_price;
        }

        el = document.querySelector("#div_d_sum");
        if (el) {
            el.innerHTML = a_price;
        }


    }
}
