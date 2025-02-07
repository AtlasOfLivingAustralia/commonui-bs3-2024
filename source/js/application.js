/*
ALA 2024 header nav
*/
jQuery( document ).ready(function() {


    const alaHeaderMenuItems = document.querySelectorAll(".ala-header-nav-primary-item");

    let alaHeaderExpandedItem = null;

    const expandSubMenu = (item) => {
        // close all currently-open submenus
        alaHeaderMenuItems.forEach((allitem) => {
            collapseSubMenu(allitem);
        });

        const subMenu = item.querySelector("div");
        const button = item.querySelector("button");
        alaHeaderExpandedItem = item;

        subMenu.setAttribute("aria-hidden","false");
        button.setAttribute("aria-expanded","true");
        item.dataset.expanded = "true";
        //subMenu.querySelectorAll("a")[0].focus(); // Focus on the first link in the submenu
        button.focus(); // Focus on the button
    };

    const collapseSubMenu = (item) => {
        const subMenu = item.querySelector("div");
        const button = item.querySelector("button");
        alaHeaderExpandedItem = null;

        subMenu.setAttribute("aria-hidden","true");
        button.setAttribute("aria-expanded","false");
        item.dataset.expanded = "false";
        button.focus(); // Focus back on the button
    };

    alaHeaderMenuItems.forEach((item) => {
        const button = item.querySelector("button");

        button.addEventListener("click", (event) => {
            if (button.ariaExpanded === "false") {
                expandSubMenu(item);
            } else {
                collapseSubMenu(item);
            }
        });

        // item.addEventListener("mouseenter", () => {
        //     expandSubMenu(item);
        // });

        // item.addEventListener("mouseleave", () => {
        //     collapseSubMenu(item);
        // });

        // Handling keyboard navigation
        button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") { // Space or Enter key
                event.preventDefault(); // Prevent the default action to stop scrolling when pressing Space
                if (button.ariaExpanded === "false") {
                    expandSubMenu(item);
                } else {
                    collapseSubMenu(item);
                }
            }
        });

        // Handling tab key inside submenu to loop back to the button
        const subMenuLinks = item.querySelectorAll("ul a");
        if (subMenuLinks.length) {
            const lastLink = subMenuLinks[subMenuLinks.length - 1];
            lastLink.addEventListener("keydown", (event) => {
                if (event.key === "Tab" && !event.shiftKey) {
                    event.preventDefault();
                    button.focus(); // Move focus back to the button
                }
            });
        }
    });

    // dismissible acknowledgement banner
    if (storageAvailable("localStorage")) {
        var alaAckBannerDismissed = localStorage.getItem('ala-ack-banner-dismissed') || '';
        var alaAckYearAhead = new Date().setFullYear(new Date().getFullYear() + 1);
    
        if (alaAckBannerDismissed < new Date()) {
            // banner has never been dismissed, or was dismissed over a year ago
            $('.ala-acknowledgement-header-background').css("display", "block");
            localStorage.removeItem('ala-ack-banner-dismissed');
        }
    
        $('.ala-acknowledgement-header').on('closed.bs.alert', function () {
            localStorage.setItem('ala-ack-banner-dismissed',alaAckYearAhead);
        })
    } else {
        // local storage not available, fall back to non-persistent dismissible banner
        $('.ala-acknowledgement-header-background').css("display", "block");
    }

});

/*!
 * Color mode toggler
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
    'use strict'
  
    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme()
      if (storedTheme) {
        return storedTheme
      }
  
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  
    const setTheme = theme => {
      if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
      }
    }
  
    setTheme(getPreferredTheme())
  
    const showActiveTheme = (theme, focus = false) => {
      const themeSwitcher = document.querySelector('#bd-theme')
  
      if (!themeSwitcher) {
        return
      }
  
      const themeSwitcherText = document.querySelector('#bd-theme-text')
      const activeThemeIcon = document.querySelector('.theme-icon-active use')
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
      const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')
  
      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active')
        element.setAttribute('aria-pressed', 'false')
      })
  
      btnToActive.classList.add('active')
      btnToActive.setAttribute('aria-pressed', 'true')
      activeThemeIcon.setAttribute('href', svgOfActiveBtn)
      const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
      themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
  
      if (focus) {
        themeSwitcher.focus()
      }
    }
  
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = getStoredTheme()
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
      }
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(getPreferredTheme())
  
      document.querySelectorAll('[data-bs-theme-value]')
        .forEach(toggle => {
          toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute('data-bs-theme-value')
            setStoredTheme(theme)
            setTheme(theme)
            showActiveTheme(theme, true)
          })
        })
    })
})();


/*!
    Simple JavaScript Templating
    John Resig - https://johnresig.com/ - MIT Licensed
*/
(function(){
    var cache = {};

    window.tmpl = function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                // Convert the template into pure JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
})();

function focusOnClickSearchButton () {
    // setTimeout to overturn focus on trigger button called by BS collapse plugin
    setTimeout(function () {
        document.getElementById('autocompleteHeader').focus();
    }, 0);
}

jQuery( document ).ready(function() {
    // getting the usage levels of tabs on BIE taxon pages
    jQuery( ".taxon-tabs .nav-tabs a" ).click(function() {
        let bieTab = jQuery(this).attr('href');
        switch(bieTab) {
            case '#overview':
                // console.log('Species page - Overview tab');
                fathom.trackEvent('Species page - Overview tab');
                break;
            case '#gallery':
                // console.log('Species page - Gallery tab');
                fathom.trackEvent('Species page - Gallery tab');
                break;
            case '#names':
                // console.log('Species page - Names tab');
                fathom.trackEvent('Species page - Names tab');
                break;
            case '#classification':
                // console.log('Species page - Classification tab');
                fathom.trackEvent('Species page - Classification tab');
                break;
            case '#records':
                // console.log('Species page - Charts tab');
                fathom.trackEvent('Species page - Charts tab');
                break;
            case '#literature':
                // console.log('Species page - Literature tab');
                fathom.trackEvent('Species page - Literature tab');
                break;
            case '#data-partners':
                // console.log('Species page - Data partners tab');
                fathom.trackEvent('Species page - Data partners tab');
                break;
            default:
                break;
        }
    })
});

// check that storage is available, e.g. storageAvailable("localStorage")
function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
