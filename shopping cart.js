"use strict";

function buildCart() {
  var $tableCart = $('.tablecart');
  $('.tprod-row').remove();

  $.ajax({
    url: 'http://localhost:3000/cart',
    dataType: 'json',
    success: function (cart) {
      var totalPrice = 0;
      cart.forEach(function (item) {
        var $tr = $('<tr />', {
          class: 'tprod-row'
        });
        var $tdProd = $('<td />', {
          class: 'tprod-block'
        });
        var $imgProd = $('<img />', {
          src: item.url,
          alt: item.alt,
          class: 'tprod-img'
        });
        var $divProdText = $('<div />', {
          class: 'prod-text'
        });
        var $h3 = $('<h3 />', {
          text: item.name
        });
        var $p = $('<p />');
        var $span = $('<span />', {
          text: item.color
        });
        $p.append('Color: ', $span, '<br>', 'Size: ', item.size);
        $divProdText.append($h3, $p);
        $tdProd.append($imgProd, $divProdText);
        $tr.append($tdProd);

        var $td = $('<td />', {
          class: 'tspan',
          text: '$' + item.price
        });
        $tr.append($td);

        $td = $('<td />');
        var $input = $('<input />', {
          type: 'number',
          class: 'tquantity',
          value: item.quantity,
          min: '1',
          'data-id': item.id
        });
        $td.append($input);
        $tr.append($td);

        $td = $('<td />', {
          class: 'tspan',
          text: 'FREE'
        });
        $tr.append($td);

        $td = $('<td />', {
          class: 'tspan',
          text: '$' + item.price * item.quantity
        });
        $tr.append($td);

        $td = $('<td />', {
          class: 'tRow-del',
          'data-id': item.id
        });
        var $a = $('<a />');
        var $i = $('<i />', {
          class: 'fa fa-times-circle',
          "aria-hidden": "true"
        });

        $a.append($i);
        $td.append($a);
        $tr.append($td);

        $tableCart.append($tr);
        // Вычисляем суммарную стоимость товаров в корзине
        totalPrice += item.price * item.quantity;
      });

      // Отображаем полную цену и со скидкой товаров в корзине
      $('.grand-total').text(' $' + totalPrice);
      $('.sub-total').text('Sub total $' + totalPrice);
    }
  });
}

(function ($) {
  $(function () {
    // Отрисовываем корзину
    buildCart();

    // Вешаем событие изменения json при изменении количества товаров в корзине
    $('.tablecart').on('change', '.tquantity', function () {
      var id = $(this).attr('data-id');
      var entity = $('.tablecart [data-id="' + id + '"]');
      $.ajax({
        url: 'http://localhost:3000/cart/' + id,
        type: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          quantity: +entity.val()
        }),
        success: function () {
          // Перестраиваем корзину
          buildCart();
        }
      })
    });

    // Вешаем событие при нажатии на кнопку удалить из корзины
    $('.shopcart').on('click', '.clear_cart', function () {
      var rows = document.querySelectorAll('.tquantity');
      rows.forEach(function (row) {
        var id = row.dataset.id;
        // Отправляем запрос на удаление
        $.ajax({
          url: 'http://localhost:3000/cart/' + id,
          type: 'DELETE',
          success: function () {
            // Перерисовываем корзины
            buildCart();
          }
        });
      })
    });

    // Вешаем событие при нажатии на кнопку удалить из корзины
    $('.shopcart').on('click', '.tRow-del', function () {
      // Получаем id товара, который пользователь хочет удалить
      var id = $(this).attr('data-id');
      // Отправляем запрос на удаление
      $.ajax({
        url: 'http://localhost:3000/cart/' + id,
        type: 'DELETE',
        success: function () {
          // Перерисовываем корзину
          buildCart();
        }
      })
    });
  })
})(jQuery);

//TODO исправить мелкие ошибки в построении корзины
