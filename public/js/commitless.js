// the markdown updater
$(document).ready(function() {
  $('.code-edit').attr('contenteditable', true)
  .on('focus', function() {
      var $this = $(this);
      $this.data('before', $this.html());
      return $this;
  }).on('blur keyup paste input', function() {
      var $this = $(this);
      if ($this.data('before') !== $this.html()) {
          $this.data('before', $this.html());
          $this.trigger('change');
      }
      return $this;
  }).on('change', function (e) {
    // console.log('updated');
    $('.btn.saveChanges').removeClass('hide');
  });

  $('.btn.saveChanges').click(function () {
    $('.code-edit .anchor').remove();

    var adjustHTML = '';
    $('.code-edit > div, .code-edit > p, .code-edit > pre').map(function (i, section) {
      adjustHTML += '<br/>' + $(section).html();
    });

    $.post('#save', {
      content: toMarkdown(adjustHTML, {
        gfm: true
      })
    }, function (response) {
      // error if not repo owner / authorized
    });
  });
});
