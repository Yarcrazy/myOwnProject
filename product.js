"use strict";

/**
 * Функция заполняет контейнер prod_flex товарами
 * @param {string} amount Число товаров, которые будут заполнены
 * @param {string} page Страница товаров, которая будет отображена
 */
function buildGoods(amount, page) {
  // Находим контейнер prod_flex и очищаем его
  var $prodFlex = $('.prod_flex');
  $prodFlex.empty();

  // Отправляем ajax, получаем массив объектов-товаров длиной amount
  $.ajax({
    url: 'http://localhost:3000/goods?_limit=' + amount + '&_page=' + page,
    dataType: 'json',
    success: function (goods) {
      sortGoods(goods);
      // Перебираем объекты в массиве товаров
      goods.forEach(function(good) {
        // Создаем родительский элемент
        var $parentItem = $('<div />', {
          class: 'parent_item'
        });
        // Создаем элемент ссылки на страницу товара
        var $a = $('<a />', {
          href: '../Pages/singlePage.html',
          class: 'item',
          "data-id": good.id,
          "data-name": good.name,
          "data-price": good.price,
          "data-url": good.url,
          "data-alt": good.alt
        });

        // Создаем элемент изображения товара
        var $imgInA = $('<img />', {
          src: good.url,
          alt: good.alt,
          class: 'item_img'
        });
        // Создаем элемент описания товара
        var $desc = $('<p />', {
          class: 'i_desc',
          text: good.name
        });
        // Создаем элемент цены товара
        var $price = $('<p />', {
          class: 'i_price',
          text: '$ ' + good.price
        });
        // Добавляем элементы изображения, описания, цены к ссылке
        $a.append($imgInA, $desc, $price);

        // Создаем элемент позиционирования ссылки на добавление к корзине
        var $posAddToCart = $('<div />', {
          class: 'pos_add_to_cart'
        });
        // Создаем элемент ссылки на добавление к корзине
        var $aAddToCart = $('<a />', {
          class: 'add_to_cart',
          text: 'Add to cart',
          "data-id": good.id,
          "data-name": good.name,
          "data-price": good.price,
          "data-url": good.url,
          "data-alt": good.alt
        });
        // Создаем элемент рисунка корзины
        var $img = $('<img />', {
          src: '../Images/add_to_cart.svg',
          alt: 'Add to cart'
        });
        // Добавляем элементы ссылки на корзину
        $aAddToCart.append($img);
        $posAddToCart.append($aAddToCart);

        // Добавляем элементы ссылки на товар и корзину к родительскому элементу и сам родительский элемент к prod_flex
        $parentItem.append($a, $posAddToCart);
        $prodFlex.append($parentItem);
      })
    }
  });
}

/**
 * Функция заполняет выпадающую корзину товарами
 */
function buildCart() {
  // Находим таблицу в выпадающей корзине и очищаем ее
  var $table = $('.db-table');
  $table.empty();

  // Отправляем ajax запрос, получем массив объектов-товаров в корзине
  $.ajax({
    url: 'http://localhost:3000/cart',
    dataType: 'json',
    success: function (cart) {
      // Суммарная стоимость товаров в корзине и количество товаров в корзине
      var totalPrice = 0;
      var cartCount = 0;

      // Отрисовываем каждый товар в корзине
      cart.forEach(function (item) {
        var $tr = $('<tr />', {
          class: 'db-prod',
          'data-id': item.id,
          'data-quantity': item.quantity
        });
        var $tdImg = $('<td />', {
          class: 'db-prod-img'
        });
        var $img = $('<img  />', {
          src: item.url,
          alt: item.alt
        });
        $tdImg.append($img);

        var $td = $('<td />');
        var $span = $('<span />', {
          class: 'dbp-name',
          text: item.name
        });

        var $divRate = $('<div />', {
          class: 'dbp-rate'
        });
        var $iRate = $('<i />', {
          class: 'fa fa-star',
          'aria-hidden': 'true'
        });
        $divRate.append($iRate);

        var $divPrice = $('<div />', {
          class: 'dbp-price',
          text: item.quantity + ' x $' + item.price
        });
        $td.append($span, $divRate, $divPrice);

        var $tdDel = $('<td />', {
          class: 'dbp-del',
          'data-id': item.id,
          'data-quantity': item.quantity
        });
        var $aDel = $('<a />');
        var $iDel = $('<i />', {
          class: 'fa fa-times-circle',
          'aria-hidden': 'true'
        });
        $aDel.append($iDel);
        $tdDel.append($aDel);

        $tr.append($tdImg, $td, $tdDel);
        $table.append($tr);

        totalPrice += +item.quantity * +item.price;
        cartCount += +item.quantity;
      });

      // Отображаем общую цену товаров в корзине
      $('.total-cart-price').text('$ ' + totalPrice);

      // Реализуем счетчик количества товаров, когда 0, то не отображается
      var $basketCounter = $('#basket-counter');
      if (cartCount !== 0) {
        $basketCounter.css('display', 'block');
        $basketCounter.text(cartCount);
      } else {
        $basketCounter.css('display', 'none');
      }

      // Реализуем отображение корзины при наведении мыши при наличии в ней товаров
      var $dropBasket = $('.drop-basket');
      $('.basket-pos').mouseover(function () {
        if (cartCount !== 0) {
          $dropBasket.slideDown();
        }
      });
      $('.basket-pos').mouseleave(function () {
        if (cartCount !== 0) {
          $dropBasket.slideUp();
        }
      });
    }
  })
}

/**
 * Функция сортирует элементы массива товаров в зависимости от значения элемента select Sort by
 * @param goods {array} массив товаров, полученный из json
 */
function sortGoods(goods) {
  var sort = $('#name option:selected').val();
  switch (sort) {
    case 'name':
      goods.sort(function(a, b) {
        return a.name > b.name;
      });
      break;
    case 'price increase':
      goods.sort(function(a, b) {
        return +a.price > +b.price;
      });
      break;
    case 'price reduction':
      goods.sort(function(a, b) {
        return +a.price < +b.price;
      });
      break;
  }
}
// TODO улучшить сортировку, потому что массив более 10 элементов не сортируется

(function($) {
  $(function() {
    // amount - переменная, значение которой берется из элемента, в котором пользователь выбирает сколько товаров
    // отобразить
    var amount = $('#show option:selected').text();
    // Создаем переменную текущей страницы блока товаров
    var page = $('.pag').attr('data-selected');
    // Отрисовываем товары
    buildGoods(amount, page);
    // Отрисовываем корзину
    buildCart();

    // Вешаем событие при нажатии на кнопку Добавить в корзину
    $('.prod_flex').on('click', '.add_to_cart', function() {
      // Определяем id товара, который пользователь хочет купить
      var id = $(this).attr('data-id');

      // Пробуем найти такой товар в корзине
      var entity = $('.db-table [data-id="' + id + '"]');
      if (entity.length) {
        // Товар в корзине есть, отправляем запрос на увеличение количества
        $.ajax({
          url: 'http://localhost:3000/cart/' + id,
          type: 'PATCH',
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify({
            quantity: +$(entity).attr('data-quantity') + 1
          }),
          success: function () {
            // Перестраиваем корзину
            buildCart();
          }
        })
      } else {
        // Товара в корзине нет - создаем в количестве 1
        $.ajax({
          url: 'http://localhost:3000/cart',
          type: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify({
            id: id,
            quantity: 1,
            name: $(this).attr('data-name'),
            price: $(this).attr('data-price'),
            url: $(this).attr('data-url'),
            alt: $(this).attr('data-alt')
          }),
          success: function () {
            // Перерисовываем корзину
            buildCart();
          }
        })
      }
    });

    // Вешаем событие при нажатии на кнопку удалить из корзины
    $('.db-table').on('click', '.dbp-del', function() {
      // Получаем id и quantity товара, который пользователь хочет удалить
      var id = $(this).attr('data-id');
      var quantity = +$(this).attr('data-quantity');
      // Получаем DOM кнопки, чтобы использовать в ajax запросе
      var entity = $(this);
      // Если количество 1, то удаляем json свойство, если нет то изменяем
      if (quantity === 1) {
        // Отправляем запрос на удаление
        $.ajax({
          url: 'http://localhost:3000/cart/' + id,
          type: 'DELETE',
          success: function () {
            // Перерисовываем корзины
            buildCart();
          }
        })
      } else {
        $.ajax({
          // Запрос на изменение
          url: 'http://localhost:3000/cart/' + id,
          type: 'PATCH',
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify({
            quantity: +entity.attr('data-quantity') - 1
          }),
          success: function () {
            // Перерисовываем корзины
            buildCart();
          }
        })
      }
    });

    // Вешаем событие при изменении количества отображаемых товаров пользователем
    $('.sort_block').on('change', '#show', function() {
      amount = $('#show option:selected').text();
      buildGoods(amount, page);
    });

    // Вешаем событие при изменении типа сортировки пользователем
    $('.sort_block').on('change', '#name', function() {
      buildGoods(amount, page);
    });

    // Вешаем событие при нажатии на кнопку View all
    $('.pag_block').on('click', '.view_all', function() {
      buildGoods('', '');
    });

    // Вешаем событие при нажатии на цифру страницы
    $('.pag').on('click', 'a', function() {
      $('.pag').attr('data-selected', this.text);
      buildGoods(amount, this.text);
    });

    // Вешаем событие перехода на страницу товара при нажатии на ссылку товара
    $('.prod_flex').on('click', '.item', function () {

      // Добавляем выбранный товар в selected good json
      $.ajax({
        url: 'http://localhost:3000/selectedGood/1',
        type: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          good: $(this).attr('data-id'),
          name: $(this).attr('data-name'),
          price: $(this).attr('data-price'),
          url: $(this).attr('data-url'),
          alt: $(this).attr('data-alt')
        })
      });
    });
  })
})(jQuery);