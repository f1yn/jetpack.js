var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * jetpack (js)
 * A small javascript library that makes jumping to page locations look outrageously sexy.
 *
 * Created by Flynn Buckingham on March 27 2017.
 * Originally authored by Flynn Buckingham (flynnham@github)
 * Adapted from an awesome GitHub project (https://github.com/bendc/anchor-scroll)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * */

/*__START_WRAP__*/
var jetpack = function jetpack() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    var presetDurations = {
        slow: 2000,
        medium: 900,
        fast: 400
    };

    var config = {
        duration: presetDurations.medium,
        updateURL: false,
        animation: true
    };

    var flags = {
        hasListener: false
    };

    var set = Object.freeze({
        duration: function duration(value) {
            switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
                case "number":
                    {
                        config.duration = Math.abs(value);
                    }
                case "string":
                    {
                        var parsed = presetDurations[value] || value;
                        if (!isNaN(parsed)) {
                            config.duration = Number(parsed);
                        }
                    }
                default:
                    {
                        // do nothing
                    }
            }
        },

        updateURL: function updateURL(value) {
            return config.updateURL = typeof value === "boolean" ? value : config.updateURL;
        },
        animation: function animation(value) {
            return config.animation = typeof value === "boolean" ? value : config.animation;
        }
    });

    // start setting config based on options
    set.duration(options.duration);
    set.updateURL(options.updateURL);
    set.animation(options.animation);

    /* START METHODS */
    var _document = document,
        documentElement = _document.documentElement,
        body = _document.body;


    var getScrollPosition = function getScrollPosition() {
        return window.pageYOffset || documentElement.scrollTop;
    };
    var getScrollHeight = function getScrollHeight() {
        return body.scrollHeight || documentElement.scrollHeight;
    };

    // transition functions for scrolls (currently only one)
    var ease = {
        InOutCubic: function InOutCubic(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    };

    var scroll = function scroll() {
        var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        args.callback = typeof args.callback === "function" ? args.callback : function () {};

        // animation formula (more to be added later)
        var startTime = null,
            startPos = getScrollPosition(),
            maxScroll = getScrollHeight() - window.innerHeight,
            scrollEndValue = startPos + delta < maxScroll ? delta : maxScroll - startPos;

        if (config.animation) {
            var InOutCubic = ease.InOutCubic;


            var scrollFrame = function scrollFrame(timestamp) {
                startTime = startTime || timestamp;
                var elapsed = timestamp - startTime;

                documentElement.scrollTop = body.scrollTop = InOutCubic(elapsed, startPos, scrollEndValue, config.duration);
                elapsed < config.duration ? requestAnimationFrame(scrollFrame) : args.callback();
            };
            requestAnimationFrame(scrollFrame);
        } else {
            documentElement.scrollTop = body.scrollTop = scrollEndValue;
        }
    };

    // scrolls to specific Y axis location in relation to the root scroll location
    var scrollTop = function scrollTop() {
        var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var args = arguments[1];
        return scroll(pos - getScrollPosition(), args);
    };

    // scrolls to element on page (pass element as first argument, second argument optional)
    var scrollToElement = function scrollToElement(elem, args) {
        return (typeof elem === "undefined" ? "undefined" : _typeof(elem)) === "object" && elem !== null && scroll(elem.getBoundingClientRect().top, args);
    };

    var hookAnchors = function hookAnchors() {
        if (!flags.hasListener) {
            var listener = function listener(e) {
                var target = e.target,
                    hRef = target.getAttribute('href');

                if (target.nodeName === 'A' && hRef.indexOf('#') < 2) {
                    // fix for pages with trailing '/'
                    hRef = hRef.indexOf('/#') === 0 ? hRef.substring(1) : hRef;

                    if (hRef.charAt(0) === '#') e.preventDefault();

                    if (hRef.length > 1) {
                        if (elem = document.getElementById(hRef.substring(1))) {
                            scrollToElement(elem, {
                                callback: function callback() {
                                    config.updateURL && (window.location.href = hRef);
                                }
                            });
                        }
                    } else {
                        scrollToElement(body, {
                            callback: function callback() {
                                config.updateURL && (window.location.href = '#');
                            }
                        });
                    }
                }
            };

            window.addEventListener('click', listener);
            flags.hasListener = true;
        }
    };

    return Object.freeze({
        get: Object.freeze(config), // readonly
        set: set, // also readonly, but setter
        hookAnchors: hookAnchors,
        scrollToElement: scrollToElement,
        scroll: scroll,
        scrollTop: scrollTop
    });
};
/*__END_WRAP__*/
