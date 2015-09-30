// the markdown updater
$(document).ready(function() {
  console.log(docCookies.keys());

  if (docCookies.getItem("fileLocation") && docCookies.getItem("fileContent") && docCookies.getItem("fileLocation") === "README.md") {
    $('.code-edit').html(decodeURIComponent(docCookies.getItem("fileContent")));
    docCookies.removeItem("fileLocation");
    docCookies.removeItem("fileContent");
  }

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
      adjustHTML += '<br/><br/>' + $(section).html();
    });

    if($("#repo-header-fork-btn").attr("href")) {
      // fork someone else's repo
      var two_hours = new Date((new Date() * 1) + 48 * 60 * 60 * 1000);
      docCookies.setItem("fileLocation", encodeURIComponent("README.md"), two_hours);
      docCookies.setItem("fileContent", encodeURIComponent(adjustHTML), two_hours);
      window.location.href = $("#repo-header-fork-btn").attr("href");
      return;
    }

    // save to own repo
    $.post('#save', {
      content: toMarkdown(adjustHTML, {
        gfm: true
      })
    }, function (response) {
      // error if not repo owner / authorized
      if (response === "OK") {
        window.location.reload();
      }
    });
  });
});
