(function ($, Drupal) {

  Drupal.behaviors.h5pTitles = {
    attach: function (context) {

      let repositoryEntryTitle = $('h3[data-h5p-title] a');
      let h5pNodeTitle = $('body.page-node-type-h5p #page-title');
      let metadataTiele = $('#resource-title > p');
      
      if (repositoryEntryTitle) {
        repositoryEntryTitle.each(function(){
          this.innerHTML = decodeTitle($(this).text());
        });
      }
      if (h5pNodeTitle) {
        h5pNodeTitle.each(function(){
          this.innerHTML = decodeTitle($(this).text());
        });
      }
      if (metadataTiele) {
        metadataTiele.each(function(){
          this.innerHTML = decodeTitle($(this).text());
        });
      }

      function decodeTitle(encodedTitle) {
        let decodedTitle = htmlDecode(encodedTitle);
        return decodedTitle;
      }
    }
  }

})(jQuery, Drupal);