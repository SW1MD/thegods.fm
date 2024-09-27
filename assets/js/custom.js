/* 
* Template Name    : Treelink, the best "link in bio" responsive template.
* Author           : Jorge Perez
* Version          : 2.0.1
* Updated          : June 2023
* File Description : Main JavaScript file ----------------------------------- */

!function($) {
    "use strict";

    class Treelink {
        constructor() {}
        
        initPreLoader() {
            $('#status').fadeOut();
            $('#preloader').delay(350).fadeOut('slow');
            $('body').delay(350).css({'overflow': 'visible'});
        }
        
        initStickyMenu() {
            var navbar = document.querySelector('nav');
            window.onscroll = function() {
                if (window.pageYOffset > 30) {
                    navbar.classList.add('stickyadd');
                } else {
                    navbar.classList.remove('stickyadd');
                }
            };
        }
        
        initScrollspy() {
            var scrollSpy = new bootstrap.ScrollSpy(document.body, {
                target: '#main_nav',
                offset: 70
            });
        }
        
        initBackToTop() {
            $(window).on('scroll', function() {
                if ($(this).scrollTop() > 100) {
                    $('.back_top').fadeIn();
                } else {
                    $('.back_top').fadeOut();
                }
            });
            $('.back_top').click(function() {
                $("html, body").animate({scrollTop: 0}, 1000);
                return false;
            });
        }
        
        init() {
            this.initPreLoader();
            this.initStickyMenu();
            this.initScrollspy();
            this.initBackToTop();
        }
    }
    
    $.Treelink = new Treelink, $.Treelink.Constructor = Treelink
}(window.jQuery),
function($) {
    "use strict";
    $.Treelink.init();
}(window.jQuery);