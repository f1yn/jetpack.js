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

var jetpack = {
    duration: {
        slow: 2000,
        default: 900,
        fast: 400
    },
    hasListener: false, // default flag that prevents multiple document binds

    // scrolls to new position relative to the current scroll position of the root element (delta = change in Y axis)
    scroll: function (delta, args) {
        var self = this,
            root = self.root,
            duration;

        args = (typeof args === "object") ? args : {};

        args.callback = (typeof args.callback === "function") ? args.callback : function () {};

        switch (typeof (duration = args.duration)) {
            case "undefined":
                duration = self.duration.default;
                break;
            case "string":
                duration = (typeof self.duration[duration] !== "undefined") ? self.duration[duration] : self.duration.default;
                break;
            default:
                if (isNaN(duration)) duration = self.duration.default;
                break;
        }

        // animation formula (more to be added later)
        var easeInOutCubic = function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        };

        var startTime = null,
            startPos = root.scrollTop,
            maxScroll = root.scrollHeight - window.innerHeight,
            scrollEndValue = startPos + delta < maxScroll ? delta : maxScroll - startPos,
            scrollFrame = function (timestamp) {
                startTime = startTime || timestamp;
                var elapsed = timestamp - startTime;

                root.scrollTop = easeInOutCubic(elapsed, startPos, scrollEndValue, duration);
                (elapsed < duration) ? requestAnimationFrame(scrollFrame) : args.callback();
            };
        requestAnimationFrame(scrollFrame);

    },

    // scrolls to specific Y axis location in relation to the root scroll location
    scrollTo: function (pos, args) {
        this.scroll(pos - this.root.scrollTop, args);
    },

    // scrolls to element on page (pass element as first argument, second argument optional)
    scrollToElement: function (elem, args) {
        (typeof elem === "object") && elem && this.scroll(elem.getBoundingClientRect().top, args);
    },

    // add event listener to body element to detect when an relevant anchor or url change occurs, and triggers a scrollToElement event
    hookAnchors: function () {
        var self = this;

        if (!self.hasListener){

            var listener = function (e) {
                var target = e.target;
                if (target.nodeName === 'A') {
                    if (target.getAttribute('href') === '#') {
                        e.preventDefault();
                        self.scrollToElement(document.body, {
                            callback: function () {
                                window.location.href = '#'
                            }
                        });
                    } else {
                        var href, elem;
                        if (href = /[^#]+$/.exec(target.href)) {
                            e.preventDefault();
                            if (elem = document.getElementById(href[0])) {
                                self.scrollToElement(elem, {
                                    callback: function () {
                                        window.location.href = '#' + elem.id
                                    }
                                });
                            }
                        }
                    }
                }
            };

            document.body.addEventListener('click', listener);
            self.hasListener = true;
        }
    }, setup: function () {
        var html = document.documentElement, body = document.body,
            cacheTop = (typeof window.pageYOffset !== "undefined" ? window.pageYOffset : null) || body.scrollTop || html.scrollTop; // cache the window's current scroll position

        // force change in scroll position to compare with cache.If scroll is not zero, it is safe to subtract.
        html.scrollTop = body.scrollTop = cacheTop + (cacheTop > 0) ? -1 : 1;
        // find root by checking which scrollTop has a value larger than the cache.
        this.root = html.scrollTop !== cacheTop ? html : body;

        this.root.scrollTop = cacheTop; // restore the window's scroll position to cached value
    }
};

