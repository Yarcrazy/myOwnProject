"use strict";

function buildCart() {
  var $tableCart = $('.tablecart');
  $tableCart.empty();

  $.ajax({
    url: 'http://localhost:3000/cart',
    dataType: 'json',
    success: function (cart) {
      var totalPrice = 0;
      cart.forEach(function(item) {
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
          text: '&#36;' + item.price
        });
        $tr.append($td);

        $td = $('<td />');
        var $input = $('<input />', {
          type: 'number',
          class: 'tquantity',
          value: item.quantity,
          min: '1'
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
          text: '&#36;' + item.price * item.quantity
        });
        $tr.append($td);

        $td = $('<td />');
        var $i = $('<i />', {
          class: 'fa fa-times-circle',
          "aria-hidden": "true"
        });
        $td.append($i);
        $tr.append($td);

        $tableCart.append($tr);
      });
    }
  });
}

(function($) {
  $(function () {
    // Отрисовываем корзину
    buildCart();
  })
})(jQuery);

//TODO исправить мелкие ошибки в построении корзины
//TODO навешать события удаления, как всей корзины, так и отдельно товаров
//TODO событие изменения поля input