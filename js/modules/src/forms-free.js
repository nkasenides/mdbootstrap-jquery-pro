(($) => {

const inputSelector = `${['text', 'password', 'email', 'url', 'tel', 'number', 'search', 'search-md']
  .map((selector) => `input[type=${selector}]`)
  .join(', ')}, textarea`;

const textAreaSelector = '.materialize-textarea';

const updateTextFields = ($input) => {

  const $labelAndIcon  = $input.siblings('label, i');
  const hasValue       = $input.val().length;
  const hasPlaceholder = $input.attr('placeholder');
  const addOrRemove    = `${hasValue || hasPlaceholder ? 'add' : 'remove'}Class`;

  $labelAndIcon[addOrRemove]('active');

}

const validateField = ($input) => {

  if ($input.hasClass('validate')) {
    const value   = $input.val();
    const noValue = !value.length;
    const isValid = !$input[0].validity.badInput;

    if (noValue && isValid) {
      $input.removeClass('valid').removeClass('invalid');
    } else {
      const valid  = $input.is(':valid');
      const length = Number($input.attr('length')) || 0;

      if (valid && (!length || length > value.length)) {
        $input.removeClass('invalid').addClass('valid');
      } else {
        $input.removeClass('valid').addClass('invalid');
      }

    }

  }

}

const textAreaAutoResize = () => {

  const $textarea  = $(this);
  if ($textarea.val().length) {
    const $hiddenDiv = $('.hiddendiv');
    const fontFamily = $textarea.css('font-family');
    const fontSize   = $textarea.css('font-size');

    if (fontSize) {
      $hiddenDiv.css('font-size', fontSize);
    }
    if (fontFamily) {
      $hiddenDiv.css('font-family', fontFamily);
    }
    if ($textarea.attr('wrap') === 'off') {
      $hiddenDiv.css('overflow-wrap', 'normal').css('white-space', 'pre');
    }


    $hiddenDiv.text(`${$textarea.val()}\n`);
    const content = $hiddenDiv.html().replace(/\n/g, '<br>');
    $hiddenDiv.html(content);

    // When textarea is hidden, width goes crazy.
    // Approximate with half of window size
    $hiddenDiv.css('width', $textarea.is(':visible') ? $textarea.width() : $(window).width() / 2);
    $textarea.css('height', $hiddenDiv.height());
  }

}

$(inputSelector).each((index, input) => {
  const $this          = $(input);
  const $labelAndIcon  = $this.siblings('label, i');
  updateTextFields($this);
  const isValid        = input.validity.badInput;
  if (isValid) {
    $labelAndIcon.addClass('active');
  }
})

$(document).on('focus', inputSelector, (e) => {
  $(e.target).siblings('label, i').addClass('active');
})

$(document).on('blur', inputSelector, (e) => {
  const $this         = $(e.target);
  const noValue       = !$this.val();
  const invalid       = !e.target.validity.badInput;
  const noPlaceholder = $this.attr('placeholder') === undefined;

  if (noValue && invalid && noPlaceholder) {
    $this.siblings('label, i').removeClass('active');
  }

  validateField($this);
});

$(document).on('change', inputSelector, (e) => {
  const $this = $(e.target);
  updateTextFields($this);
  validateField($this);
});

$('input[autofocus]').siblings('label, i').addClass('active');

$(document).on('reset', (e) => {
  const $formReset = $(e.target);
  if ($formReset.is('form')) {

    const $formInputs = $formReset.find(inputSelector);
    $formInputs
      .removeClass('valid')
      .removeClass('invalid')
      .each((index, input) => {
        const $this          = $(input);
        const noDefaultValue = !$this.val();
        const noPlaceholder  = !$this.attr('placeholder');
        if (noDefaultValue && noPlaceholder) {
          $this.siblings('label, i').removeClass('active');
        }
      });

    $formReset.find('select.initialized').each((index, select) => {
      const $select        = $(select);
      const $visible_input = $select.siblings('input.select-dropdown');
      const default_value  = $select.children('[selected]').val();

      $select.val(default_value);
      $visible_input.val(default_value);
    });
  }
});

if($('.md-textarea-auto').length) {
  var observe;
  if (window.attachEvent) {
    observe = function (element, event, handler) {
      element.attachEvent('on'+event, handler);
    };
  }
  else {
    observe = function (element, event, handler) {
      element.addEventListener(event, handler, false);
    };
  }

  function init() {
    var text = $('.md-textarea-auto');
    text.each(function() {
      let _this = this;
      function resize () {
        _this.style.height = 'auto';
        _this.style.height = _this.scrollHeight+'px';
      }
      function delayedResize () {
        window.setTimeout(resize, 0);
      }
      observe(_this, 'change',  resize);
      observe(_this, 'cut',     delayedResize);
      observe(_this, 'paste',   delayedResize);
      observe(_this, 'drop',    delayedResize);
      observe(_this, 'keydown', delayedResize);
      resize();
    })
  }
  init();
}

if (!$('.hiddendiv').first().length) {
  $hiddenDiv = $('<div class="hiddendiv common"></div>');
  $('body').append($hiddenDiv);
}

$(textAreaSelector).each(textAreaAutoResize);
$('body').on('keyup keydown', textAreaSelector, textAreaAutoResize);

})(jQuery);
