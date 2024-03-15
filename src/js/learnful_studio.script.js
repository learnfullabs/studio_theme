// import 'popper.js';
// import 'bootstrap';
import 'simplebar';
import 'simplebar/dist/simplebar.css';
import Axios from 'axios';

(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.licenseAttribution = {
    attach: function (context) {

      const LicenseList = [
        {
          "name": "CC BY",
          "url": "https://creativecommons.org/licenses/by/",
          "display_name": "Creative Commons Attribution"
        },
        {
          "name": "CC BY-SA",
          "url": "https://creativecommons.org/licenses/by-sa/",
          "display_name": "Creative Commons Attribution-ShareAlike"
        },
        {
          "name": "CC BY-NC",
          "url": "https://creativecommons.org/licenses/by-nc/",
          "display_name": "Creative Commons Attribution-NonCommercial"
        },
        {
          "name": "CC BY-NC-SA",
          "url": "https://creativecommons.org/licenses/by-nc-sa/",
          "display_name": "Creative Commons Attribution-NonCommercial-ShareAlike"
        },
        {
          "name": "CC BY-ND",
          "url": "https://creativecommons.org/licenses/by-nd/",
          "display_name": "Creative Commons Attribution-NoDerivatives"
        },
        {
          "name": "CC BY-NC-ND",
          "url": "https://creativecommons.org/licenses/by-nc-nd/",
          "display_name": "Creative Commons Attribution-NonCommercial-NoDerivatives"
        },
        {
          "name": "CC0 1.0",
          "url": "https://creativecommons.org/publicdomain/zero/1.0/",
          "display_name": "Creative Commons Public Domain Dedication"
        },
        {
          "name": "CC PDM",
          "url": "https://creativecommons.org/publicdomain/mark/1.0/",
          "display_name": "Public Domain Mark"
        },
        {
          "name": "GNU GPL",
          "url": "http://www.gnu.org/licenses/gpl-3.0-standalone.html",
          "display_name": "GNU General Public License"
        },
        {
          "name": "PD",
          "url": "",
          "display_name": "Public Domain"
        },
        {
          "name": "ODC PDDL",
          "url": "https://opendatacommons.org/licenses/pddl/1-0/",
          "display_name": "Open Data Commons Public Domain Dedication and License"
        },
        {
          "name": "U",
          "url": "",
          "display_name": "Undisclosed"
        },
        {
          "name": "C",
          "url": "",
          "display_name": "Copyright"
        }
      ];


      // let markup = `
      //   <a href="" target="_blank">${title}</a> 
      // `;

      const licenseElement = $('#license-attribution');

      licenseElement.each(function(){
        let url = licenseElement.attr('data-h5purl');
        let title = `<a href="${url}" target="_blank">${licenseElement.attr('data-h5ptitle')}</a>`;
        let authors = buildAuthorLine(licenseElement.attr('data-h5pauths'));
        let license = buildLicense(licenseElement.attr('data-h5plic'), licenseElement.attr('data-h5pver'))

        let markup = `${title}${authors}${license}`;

        licenseElement.html(markup);
      })

      function buildAuthorLine(data) {
        if ((data === '[]')) {
          return '';
        } else {
          let authors = JSON.parse(data);
          return ' by ' + authors.map(a => a.name).join(', ');
        }
      }

      function buildLicense(license, version) {
        if (license) {
          let selected_license = LicenseList.find(lic => lic.name === license);
          switch (selected_license.name) {
            case 'U':
              return ` is shared without a license`;

            case 'Copyright':
              return ` is Copyright with all rights reserved`;

            default:
              if (selected_license.url && version) {
                return ` is shared with the following license: <a href="${selected_license.url}/${version}" target="_blank" rel="nofollow">${selected_license.display_name} ${version}</a> (${selected_license.name}), except where otherwise noted.`;
              } else if (selected_license.url && !(version)) {
                return ` is shared with the following license: <a href="${selected_license.url}" target="_blank" rel="nofollow">${selected_license.display_name}</a> (${selected_license.name}), except where otherwise noted.`;
              } else {
                return ` is shared with the following license: ${selected_license.display_name} (${selected_license.name}), except where otherwise noted.`;
              }
          }
        }
      }

    }
  }

  Drupal.behaviors.h5pAccessibility = {
    attach: function (context) {

      let launcher = $('#toggle_accessibility');  
      if (launcher) {
        let type = launcher.attr('data-h5ptype');
        Axios.get(`https://studio.libretexts.org/api/h5p/accessibility?type=${type}`)
        .then(response => {
          if (response.data) {
            let data = response.data[0];
            launcher.html(data.status);
            launcher.addClass(`btn-${data.design}`);
            $('#agModalTitle').html(data.title);
            let markup = `
              <h2>Overall Usability</h2>
              <p>${data.status}: ${data.status_description}</p>
              ${data.description}
            `;
            $('#accessibilityGuideModal .modal-body').html(markup);
            $('#launchGuideBtn').attr('href', data.url);          
          }
        })
        .catch(error => console.log(error));
      }
    }
  }

  Drupal.behaviors.fetchLicense = {
    attach: function (context) {

      // var iframes = document.querySelectorAll('.h5p-iframe');
      // if (iframes) {
      //   var i = iframes[0].contentWindow.H5P.instances[0];
      //   var ms = i.getMaxScore();
      //   console.log(ms);
      // }
      
      // if (iframes.length !== 0) {
      //   var instance = iframes[0].contentWindow.H5P.instances[0];
      //   var maxScore = instance.getMaxScore ? instance.getMaxScore() : 0;
      //   console.log("this max: " + maxScore);
      // }

      // let resourceToFetch = 'http://studio.v2/api/h5p/2256';

      // Axios.get(resourceToFetch)
      //   .then(response => {
      //     console.log(response.data);
      //   })
      //   .catch(error => console.error(error));
    }
  };
  Drupal.behaviors.enableToolTips = {
    attach: function (context) {
      $('[data-toggle="tooltip"]').tooltip();
    }
  };

  Drupal.behaviors.flags = {
    attach: function (context) {
      $('.flag-bookmark.action-unflag').hover(
        function(){
          // $('a', this).removeClass('btn-light');
          // $('a', this).addClass('btn-danger');
          $('a > .material-icons', this).text('bookmark_remove');
        }, function() {
          // $('a', this).removeClass('btn-danger');
          // $('a', this).addClass('btn-light');
          $('a > .material-icons', this).text('bookmark_added');
        }
      );
      // $('body.node .flag-bookmark').ready(function(){
      //   e.stopPropagation();
      //   $('body.node .flag-bookmark.action-flag').append("<span>Add to bookmarks</span>");
      //   $('body.node .flag-bookmark.action-unflag').append("<span>Remove from bookmarks</span>");
      // });

      // $('body.node .flag-bookmark.action-flag').one(function(){
      //   $('body.node .flag-bookmark.action-flag').append("<span>Add to bookmarks</span>");
      //   $('body.node .flag-bookmark.action-unflag').append("<span>Remove from bookmarks</span>");
      // });
      
      
    }
  };

  Drupal.behaviors.h5pElements = {
    attach: function (context) {
      $(document).ready(function () {
        // Using setTimeout to run after other ready callbacks
        setTimeout(function () {
     
          // Listen for event triggered when changing "panels" in the accordion.
          $('#drupal-bootstrap4-modal').on('shown.bs.modal', function (event) {
     
            // Make sure the panel has automatic height
            // ui.newPanel.css('height', 'auto');
            // console.log(event);
            // console.log(this);
     
            // Triggering a resize event on the window will make H5Ps resize.
            // H5P.jQuery(window).trigger('resize');
            window.dispatchEvent(new Event('resize'));
            H5P.init();
          });
        }, 0);
      });     
    }
  };

  Drupal.behaviors.togglePreview = {
    attach: function (context) {
      $('a.toggle_preview').unbind().click(function(){
        let type = $(this).attr('data-toggle-type');
        let target = $(this).attr('href');
        if (type === 'H5P Resource') {
          let src = $(target).attr('data-frame-src');
          let iframe = `<iframe src="${src}" class="h5p-iframe" frameborder="0" scrolling="no"  allowfullscreen="allowfullscreen" lang="en" height="100%" width="100%"></iframe><script src="/modules/contrib/h5p/vendor/h5p/h5p-core/js/h5p-resizer.js" charset="UTF-8"></script>`;
          if ($(target + ' iframe').length) {          
          } else {
            $(target).html(iframe);
          }
        }
        $(this).toggleClass('active');
      });
    }
  }

  Drupal.behaviors.discoverSearch = {
    attach: function (context) {
      

      const form = document.getElementById('discover-search');

      let dest = '/library?';
      let subject = 'Subject=';
      let keyword = '&key=';
      let type = '&H5P+Type=';

      /**
       * http://studio.v2/library?
       * Subject=
       * &tags=
       * &auth=
       * &key=
       * &H5P+Type=
        *  &type%5BAdvanced+fill+the+blanks%5D=Advanced+fill+the+blanks
        *  &type%5BAdvent+Calendar+%28beta%29%5D=Advent+Calendar+%28beta%29
        *  &type%5BAudio+Recorder%5D=Audio+Recorder
       * &License=
       **/

      function convertData(formdata,type){
        if (formdata) {

          let arr = formdata.value.split(',');
          let encoded = '';


          if (arr[0] === 'all') {
            return '';
          }

          arr.forEach(element => {
            if (type === 'key'){
              encoded += encodeURIComponent(element);
            } else {
              let param = `&${type}[${element}]=${element}`;
              encoded += encodeURIComponent(param).replace(/%20/g, '+').replace(/%3D/g, '=').replace(/%26/g, '&');
            }
          });

          return encoded;

        }
      }


      form.addEventListener('submit', (event) => {
        event.preventDefault();

        //console.log(form.elements['select-type'].value);


        type += convertData(form.elements['select-type'],'type');
        subject += convertData(form.elements['select-subject'],'_s');
        keyword += convertData(form.elements['select-keywords'],'key');

        
        dest += subject + '&tags=&auth=' + keyword + type + '&License=';

        // console.log(form.elements['select-type'].value);
        // console.log(form.elements['select-subject'].value);

        //console.log(dest);

        window.location.href = dest;

        // let select_types = form.elements['select-type'].value;
        // let arr_types = 



        



      });


    }
  };


  Drupal.behaviors.contactForms = {
    attach: function (context) {
      $('a.use-ajax.contact-form').attr('data-dialog-type', 'bootstrap4_modal');      
    }
  };

  Drupal.behaviors.collapseDetails = {
    attach: function (context, settings) {
      window.onload = function(){
        $('details#edit-contact').removeAttr('open');
      }
      
    }
  }

  Drupal.behaviors.dashboardSearch = {
    attach: function (context, settings) {

      $('.dashboard-h5p #edit-key').attr('placeholder', 'Search by keyword. Hit [enter] to search.')
      
    }
  }

  Drupal.behaviors.responsiveElements = {
    attach: function (context) {
      
      // Toggle Views Filters Block on Mobile
      Drupal.responsiveElements.toggle_filters_library();
      
    }
  };

  Drupal.responsiveElements = {
    toggle_filters_library: function () {
      var toggleBtn = $('a#toggle-filters-mobile');
      toggleBtn.unbind().click(function (e) {
        e.preventDefault();
        if ($("#sidebar_left").hasClass('open')) {
          $("#sidebar_left").removeClass('open')
          $('body').removeClass('no_scroll');
        } else {
          $("#sidebar_left").addClass('open')
          $('body').addClass('no_scroll');
        }
        e.stopPropagation();
      });
    }
  };


  Drupal.behaviors.exposedFilters = {
    attach: function(context) {
      // Remove TID's onload.
      Drupal.exposedFilters.remove_tid();

      // Remove TID's onchange.
      jQuery('body').find('.form-autocomplete').on('autocompleteclose', function() {
        Drupal.exposedFilters.remove_tid();
      });

      // Add descriptions for certain exposed filters
      Drupal.exposedFilters.add_descriptions();

      // Make checkbox filters searchable
      Drupal.exposedFilters.search_checkboxes();

      // Make long lists of checkboxes expandable
      //Drupal.exposedFilters.expand_checkboxes();

      // Move selected checkboxes to top
      Drupal.exposedFilters.selected_options();

    }
  };

  Drupal.behaviors.copyButtons = {
    attach: function(context) {

      $(".copy-button").on("click", function(){
        let target = $(this).attr('data-target');
        let content = $(target).html();
        navigator.clipboard.writeText(content);
        button.text("Copied!");

        setTimeout(function() {
          button.text("Copy")
        }, 3000);
      });
    }
  };

  Drupal.exposedFilters = {
    remove_tid: function () {
      var field_autocomplete = jQuery('body').find('.form-autocomplete');
      field_autocomplete.each(function (event, node) {
        var val = $(this).val();
        var match = val.match(/\((.*?)\)$/);
        if (match) {
          $(this).data('real-value', val);
          $(this).val(val.replace(' ' + match[0], ''));
        }
      });
    },

    add_descriptions: function () {
      var collFilters = $('form[action="/browse/collections"]');
      var h5pFilters = $('form[action="/library"]');

      $('details[data-drupal-selector="edit-tags-collapsible"] .card-body', collFilters).once().each(function() {
        $(this).append('<p class="small text-muted">Enter multiple tags separated by commas to search for more than 1 tag.</p>');
      });

      $('details[data-drupal-selector="edit-key-collapsible"] .card-body', collFilters).once().each(function() {
        $(this).append('<p class="small text-muted">Search titles and descriptions using a keyword.</p>');
      });

      // $('details[data-drupal-selector="edit-type-collapsible"] .card-body', h5pFilters).one(function() {
      //   $(this).append('<p class="small text-muted">Search by H5P Content Type. Example: "Interactive Video". Start typing at least 3 letters for autocomplete options. You can review a list of content types available on <a href="https://h5p.org/content-types-and-applications" target="_blank">h5p.org</a>.</p>');
      // });

      // $('details[data-drupal-selector="edit-type-collapsible"] .card-body', h5pFilters).once().each(function() {
      //   $(this).append('<p class="small text-muted">Search by H5P Content Type. Example: "Interactive Video". Start typing at least 3 letters for autocomplete options. You can review a list of content types available on <a href="https://h5p.org/content-types-and-applications" target="_blank">h5p.org</a>.</p>');
      // })

      $('details[data-drupal-selector="edit-key-collapsible"] .card-body', h5pFilters).once().each(function() {
        $(this).append('<p class="small text-muted">Use a keyword to search titles, descriptions, author names, licenses, and other fields. Begin typing at least 3 letters for autocomplete options.</p>');
      });

      $('details[data-drupal-selector="edit-tags-collapsible"] .card-body', h5pFilters).once().each(function() {
        $(this).append('<p class="small text-muted">Enter multiple tags separated by commas to search for more than 1 tag.</p>');
      });
      
      $('details[data-drupal-selector="edit-auth-collapsible"] .card-body', h5pFilters).once().each(function() {
        $(this).append('<p class="small text-muted">Search by author name. Must be an exact match for results.</p>');
      });

    },

    search_checkboxes: function () {
      let form_element = $('details.form-item');
      let name;
      $(form_element).each(function(){
        name = $(this).attr('data-title');
        let checkbox_element = $('.form-checkboxes:not(.bef-checkboxes)', this);
        $(checkbox_element).each(function(el){
          let search_element = `<input type="text" class="form-control form-control-sm mb-2" name="${name}" placeholder="Search ${name}" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" data-target="bef-checkboxes">`;
          $(this).once().prepend(search_element);
        });
      });

      $.liveSearch({
        selectorContainer: '#edit-type--2 .form-checkboxes.bef-checkboxes',
        selectorElementsToSearch: '.form-check',
        selectorFixed: '.form-check.top',
        selectorInputSearch: 'input[name="H5P Type"]',
        minCharacters: 0,
        typeDelay: 0
      });

      $.liveSearch({
        selectorContainer: '#edit-subject--2 .form-checkboxes.bef-checkboxes',
        selectorElementsToSearch: '.form-check',
        selectorFixed: '.form-check.top',
        selectorInputSearch: 'input[name="Subject"]',
        minCharacters: 0,
        typeDelay: 0
      });

      $.liveSearch({
        selectorContainer: '#edit-l--2 .form-checkboxes.bef-checkboxes',
        selectorElementsToSearch: '.form-check',
        selectorFixed: '.form-check.top',
        selectorInputSearch: 'input[name="License"]',
        minCharacters: 0,
        typeDelay: 0
      });

      // $.liveSearch({
      //   selectorContainer: '#edit-sub--2 .form-checkboxes.bef-checkboxes',
      //   selectorElementsToSearch: '.form-check',
      //   selectorFixed: '.form-check.top',
      //   selectorInputSearch: 'input[name="Subjects and Topics"]',
      //   minCharacters: 0,
      //   typeDelay: 0
      // });
      
    },

    expand_checkboxes: function() {
      let checkboxes = $('.form-checkboxes.bef-checkboxes');
      $(checkboxes).each(function(){
        let count = $('input[type="checkbox"]', this).length;
        console.log(count);

        if (count > 7) {
          $('.form-check:nth-of-type(1n+10)', this).css('display','none');
        }
      })
    },

    selected_options: function() {

      $('.bef-checkboxes').each(function(){
   
        $('input[type="checkbox"]').click(function(){
          let checkbox_element = $(this).parent();
          checkbox_element.toggleClass('top');
        });
      })

      $('input[type="checkbox"]').each(function(){
        if ($(this).prop("checked") == true){
          $(this).parent().addClass('top');
        }
      });
      


    }

  };



})(jQuery, Drupal);
