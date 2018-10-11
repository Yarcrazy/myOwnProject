"use strict";

/**
 * Функция заполняет страницу singlePage данными из selected good из json
 */
function buildSinglePage() {
  $.ajax({
    url: 'http://localhost:3000/selectedGood/1',
    dataType: 'json',
    success: function(good) {
      // Отображаем из json картинку, alt, имя, описание и цену товара
      $('.bigphoto-prod').attr('src', good.url).attr('alt', good.alt);
      $('.prod-name').text(good.name);
      $('.short-desc').text(good.name);
      $('.desc-prod__price').text('$' + good.price);
    }
  });
}

/**
 * Функция возвращает товар, полученный из json/selectedGood
 */
function getSelectedGood() {
  $.ajax({
    url: 'http://localhost:3000/selectedGood/1',
    dataType: 'json',
    success: function(good) {
      return good;
    }
  });
}
// TODO доделать getSelectedGood(): научить возращать good

function isGoodInCart(good) {
  $.ajax({
    url: 'http://localhost:3000/cart',
    dataType: 'json',
    success: function(cart) {
      cart.forEach(function(cartOne) {
        return cartOne.id === good.good;
      })
    }
  })
}

(function($) {
  $(function() {
    buildSinglePage();
    var good = getSelectedGood();
    $('.prod-choose').on('click', '.prod-choose__add-to-cart', function() {
      if (isGoodInCart(good)) {
        $.ajax({
          url: 'http://localhost:3000/cart/' + good.good,
          type: 'PATCH',
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify({
            quantity: $('.quan').val(),
            size: $('.sel option:selected').val(),
            color: $('.color').val()
          })
        });
      } else {
        $.ajax({
          url: 'http://localhost:3000/cart',
          type: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify({
            id: good.good,
            quantity: $('.quan').val(),
            name: good.name,
            price: good.price,
            url: good.url,
            alt: good.alt,
            size: $('.sel option:selected').val(),
            color: $('.color').val()
          })
        });
      }
    })
  })
})(jQuery);