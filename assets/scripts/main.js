import 'stickyfill';
import 'svg4everybody';

import { Tether } from 'tether';
//global.Tether = require('tether'); //Temp until new BS4 release.
window.Tether = Tether; //Temp until new BS4 release.

// Bootstrap JS files
// import { Util } from 'bootstrap';
// import { Alert } from 'bootstrap';
// import { Button } from 'bootstrap';
// import { Carousel } from 'bootstrap';
// import { Dropdown } from 'bootstrap';
// import { Modal } from 'bootstrap';
// import { Scrollspy } from 'bootstrap';
// import { Tooltip } from 'bootstrap';
// import { Popover } from 'bootstrap';

/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * ======================================================================== */

// Use this variable to set up the common and page specific functions. If you
// rename this variable, you will also need to rename the namespace below.
var tofino = {
  // JavaScript to be fired on all pages
  common: {
    init: function() {

      //Iniitalize svg4everybody
      svg4everybody();

      //List for notication close
      $('#tofino-notification .close').on('click', function() {
        if (tofinoJS.cookieExpires) {
          Cookies.set('tofino-notification-closed', 'yes', {expires: parseInt(tofinoJS.cookieExpires)});
        } else {
          Cookies.set('tofino-notification-closed', 'yes');
        }
      });

      //Assign sticky
      var $sticky = $('.navbar-sticky-top');

      if ($sticky.length) {
        //Sticky polyfill for css position: sticky
        $sticky.Stickyfill();

        //Assign stick offset
        var stickyTop = $sticky.offset().top;

        $(window).scroll(function() {
          if ($(this).scrollTop() > stickyTop) {
            $sticky.addClass('stuck');
          } else {
            $sticky.removeClass('stuck');
          }
        });
      }
    }
  },
  // Home page
  home: {
    init: function() {
    }
  }
};
// The routing fires all common scripts, followed by the page specific scripts.
// Add additional events for more control over timing e.g. a finalize event
var UTIL = {
  fire: function(func, funcname, args) {
    var namespace = tofino;
    funcname = funcname === undefined ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {
    UTIL.fire('common');
    $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
      UTIL.fire(classnm);
    });
  }
};
$(document).ready(UTIL.loadEvents);
