"use strict";

/**
 * Функция заполняет контейнер prod_flex товарами
 * @param {number} amount Число товаров, которые будут заполнены
 */
function buildGoods(amount) {
  // Находим контейнер prod_flex и очищаем его
  var $prodFlex = $('.prod_flex');
  $prodFlex.empty();

  // Отправляем ajax, получаем массив объектов-товаров длиной amount
  $.ajax({
    url: 'http://localhost:3000/goods?_limit=' + amount,
    dataType: 'json',
    success: function(goods) {
      // Перебираем объекты в массиве товаров
      goods.forEach(function(good) {
        // Создаем родительский элемент
        var $parentItem = $('<div />', {
          class: 'parent_item'
        });
        // Создаем элемент ссылки на страницу товара
        var $a = $('<a />', {
          href: 'Pages/singlePage.html',
          class: 'item'
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
          src: 'Images/add_to_cart.svg',
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
    success: function(cart) {
      // Суммарная стоимость товаров в корзине и количество товаров в корзине
      var totalPrice = 0;
      var cartCount = 0;

      // Отрисовываем каждый товар в корзине
      cart.forEach(function(item) {
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
      $('.basket-pos').mouseover(function() {
        if (cartCount !== 0) {
          $dropBasket.slideDown();
        }
      });
      $('.basket-pos').mouseleave(function() {
        if (cartCount !== 0) {
          $dropBasket.slideUp();
        }
      });
    }
  })
}

(function($) {
  $(function() {
    // Заполняем блок товаров конкретным количеством для главной страницы featured items
    buildGoods(8);
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
          success: function() {
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
          success: function() {
            // Перерисовываем корзины
            buildCart();
          }
        })
      }
    });
  })
})(jQuery);
//TODO gulp!!!! далее по плану
//TODO сделать нормальные "звезды" в drop корзине
//TODO по-человечески выровнять корзину