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

var jetPack = function(options){
    options = (typeof options === "object") ? options : {};

    var self = this,
        URLupdate = true,
        animationEnabled = true,
        root;

    self.callback = (typeof options.callback === "function") ? options.callback : function () {};

    var DEFAULT_DURATIONS = {
        slow: 2000,
        default: 900,
        fast: 400
    }, globalDuration = DEFAULT_DURATIONS.default;

    /* global setters go here */
    self.setDuration = function(duration){
        globalDuration = DEFAULT_DURATIONS.default;

        if (duration) {
            if (!isNaN(duration)) globalDuration = Number(duration);
            else if (DEFAULT_DURATIONS.ifhasOwnProperty(optionDuration)) globalDuration = DEFAULT_DURATIONS[duration];
            else console.warn('invalid parameter: "' + value + ' keeping default');
        }
    };

    self.setURLupdate = function(value){
        if (typeof value === 'boolean') URLupdate = value;
        else console.warn('invalid parameter: "' + value + ' keeping default');
    }

    self.setAnimate = function(value){
        if (typeof value === 'boolean') animationEnabled = value;
        else console.warn('invalid parameter: "' + value + ' keeping default');
    }


    // scrolls to new position relative to the current scroll position of the root element (delta = change in Y axis)
    self.scroll = function(delta, args){
        args = (typeof args === "object") ? args : {};
        args.callback = (typeof args.callback === "function") ? args.callback : function () {};

        // animation formula (more to be added later)
        var easeInOutCubic = function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        };

        var startTime = null,
            startPos = root.scrollTop,
            maxScroll = root.scrollHeight - window.innerHeight,
            scrollEndValue = startPos + delta < maxScroll ? delta : maxScroll - startPos;

        if (animationEnabled) {
            var scrollFrame = function (timestamp) {
                startTime = startTime || timestamp;
                var elapsed = timestamp - startTime;

                root.scrollTop = easeInOutCubic(elapsed, startPos, scrollEndValue, globalDuration);
                (elapsed < globalDuration) ? requestAnimationFrame(scrollFrame) : args.callback();
            };
            requestAnimationFrame(scrollFrame);
        } else root.scrollTop = scrollEndValue;
    }

    // scrolls to specific Y axis location in relation to the root scroll location
    self.scrollTo = function (pos, args) {
        self.scroll(pos - root.scrollTop, args);
    }

    // scrolls to element on page (pass element as first argument, second argument optional)
    self.scrollToElement = function (elem, args) {
        (typeof elem === "object") && elem && self.scroll(elem.getBoundingClientRect().top, args);
    }

    self.hookAnchors =  function () {
        if (!self.hasListener){
            var listener = function (e) {
                var target = e.target,
                    hRef;

                if (target.nodeName === 'A' && (hRef = target.getAttribute('href')).charAt(0) === '#'){
                    e.preventDefault();

                    if (hRef.length > 1){
                        if (elem = document.getElementById(hRef.substring(1))) {
                            self.scrollToElement(elem, {
                                callback: function() {URLupdate && (window.location.href = hRef)}
                            });
                        }
                    } else {
                        self.scrollToElement(document.body, {
                            callback: function() {URLupdate && (window.location.href = '#')}
                        });
                    }
                }
            };

            document.body.addEventListener('click', listener);
            self.hasListener = true;
        }
    }

    self.setDuration(options.duration);
    self.setURLupdate(options.URLupdate);
    self.setAnimate(options.animation);

    var html = document.documentElement, body = document.body,
        cacheTop = (typeof window.pageYOffset !== "undefined" ? window.pageYOffset : null) || body.scrollTop || html.scrollTop; // cache the window's current scroll position

    // force change in scroll position to compare with cache.If scroll is not zero, it is safe to subtract.
    html.scrollTop = body.scrollTop = cacheTop + (cacheTop > 0) ? -1 : 1;
    // find root by checking which scrollTop has a value larger than the cache.
    root = (html.scrollTop !== cacheTop) ? html : body;

    root.scrollTop = cacheTop; // restore the window's scroll position to cached value

};
