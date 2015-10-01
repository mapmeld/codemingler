// the markdown updater
$(document).ready(function() {
  function addCookie(cookieName, cookieValue) {
    cookieValue = encodeURIComponent(cookieValue);
    var myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    document.cookie = cookieName +"=" + cookieValue + ";expires=" + myDate + ";domain=.codemingler.com;path=/";
  }

  if (docCookies.getItem("fileLocation") && docCookies.getItem("fileContent") && docCookies.getItem("fileLocation") === "README.md") {
    $('.code-edit').html(decodeURIComponent(docCookies.getItem("fileContent")));
    addCookie("fileLocation", "");
    addCookie("fileContent", "");
    $('.btn.saveChanges').removeClass('hide');
  }

  var fileLocation = "";
  var isReadme = false;
  if ($(".bread a").length) {
    // directory
    fileLocation = $(".bread a").last().attr("href").split("/").slice(5) + "/";
  } else if ($(".panel-header strong").text().toLowerCase() === "readme.md") {
    // README inside a directory
    isReadme = true;
  }
  if ($(".bread").not(".title").length) {
    fileLocation += $(".bread").last().text();
    if (isReadme) {
      fileLocation += "/README.md";
    }
  } else {
    fileLocation = "README.md";
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
    if (!adjustHTML.length) {
      adjustHTML = $('.code-edit').text();
    }

    if($("#repo-header-fork-btn").attr("href")) {
      // fork someone else's repo
      addCookie("fileLocation", fileLocation);
      addCookie("fileContent", adjustHTML);
      window.location.href = $("#repo-header-fork-btn").attr("href");
      return;
    }

    var fileDir = fileLocation.substring(0, fileLocation.lastIndexOf("/") + 1);
    var fileName = fileLocation.split("/")[fileLocation.split("/").length - 1];

    // save to own repo
    $.post('#save', {
      content: toMarkdown(adjustHTML, {
        gfm: true
      }),
      fileDir: fileDir,
      fileName: fileName
    }, function (response) {
      // error if not repo owner / authorized
      if (response === "OK") {
        window.location.reload();
      }
    });
  });
});
