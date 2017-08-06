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

    var updateURL = true,
        animationEnabled = true,
        html, body;

    var DEFAULT_DURATIONS = {
        slow: 2000,
        medium: 900,
        fast: 400
    }, globalDuration = DEFAULT_DURATIONS.medium;

    var getScrollPosition = function() {return window.pageYOffset || html.scrollTop};

    var getScrollHeight = function() {return body.scrollHeight || html.scrollHeight};

    var hasListener = false;

    /* global setters go here */

    function setDuration(duration){
        globalDuration = DEFAULT_DURATIONS.medium;

        if (duration) {
            if (!isNaN(duration)) globalDuration = Number(duration);
            else if (DEFAULT_DURATIONS.ifhasOwnProperty(optionDuration)) globalDuration = DEFAULT_DURATIONS[duration];
            else console.warn('invalid parameter: "' + duration + '" keeping default');
        }
    };

    // toggle for whether the location href should update
    function setupdateURL(value){
        if (typeof value === 'boolean') updateURL = value;
        else console.warn('invalid parameter: "' + value + '" keeping default');
    };

    // toggle for whether animations should be enabled or disabled
    function setAnimate(value){
        if (typeof value === 'boolean') animationEnabled = value;
        else console.warn('invalid parameter: "' + value + '" keeping default');
    };

    // scrolls to new position relative to the current scroll position of the root element (delta = change in Y axis)
    function scroll(delta, args){
        args = (typeof args === "object") ? args : {};
        args.callback = (typeof args.callback === "function") ? args.callback : function () {};

        // animation formula (more to be added later)
        var easeInOutCubic = function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        };

        var startTime = null,
            startPos = getScrollPosition(),
            maxScroll = getScrollHeight() - window.innerHeight,
            scrollEndValue = (startPos + delta < maxScroll) ? delta : maxScroll - startPos;

        if (animationEnabled) {
            var scrollFrame = function (timestamp) {
                startTime = startTime || timestamp;
                var elapsed = timestamp - startTime;

                html.scrollTop = body.scrollTop = easeInOutCubic(elapsed, startPos, scrollEndValue, globalDuration);
                (elapsed < globalDuration) ? requestAnimationFrame(scrollFrame) : args.callback();
            };
            requestAnimationFrame(scrollFrame);
        } else html.scrollTop = body.scrollTop = scrollEndValue;
    };

    // scrolls to specific Y axis location in relation to the root scroll location
    function scrollTop(pos, args) {
        scroll(pos - getScrollPosition(), args);
    };

    // scrolls to element on page (pass element as first argument, second argument optional)
    function scrollToElement(elem, args) {
        (typeof elem === "object") && elem && scroll(elem.getBoundingClientRect().top, args);
    };

    // binds click event for anchors with hrefs on them (global event handler)
    function hookAnchors() {
        if (!hasListener){
            var listener = function (e) {
                var target = e.target,
                    hRef = target.getAttribute('href');

                console.log(target );

                if (target.nodeName === 'A' && hRef.indexOf('#') < 2){
                    // fix for pages with trailing '/'
                    hRef = (hRef.indexOf('/#') === 0) ? hRef.substring(1) : hRef;

                    e.preventDefault();

                    if (hRef.length > 1){
                        if (elem = document.getElementById(hRef.substring(1))) {
                            scrollToElement(elem, {
                                callback: function() {updateURL && (window.location.href = hRef)}
                            });
                        }
                    } else {
                        scrollToElement(document.body, {
                            callback: function() {updateURL && (window.location.href = '#')}
                        });
                    }
                }
            };

            window.addEventListener('click', listener);
            hasListener = true;
        }
    };

    setDuration(options.duration);
    setupdateURL(options.updateURL);
    setAnimate(options.animation);

    html = document.documentElement;
    body = document.body;

    return {
        setDuration: setDuration,
        setupdateURL: setupdateURL,
        setAnimate: setAnimate,
        scrollDelta: scroll,
        scrollY: scrollTop,
        scrollToElement: scrollToElement,
        hookAnchors: hookAnchors
    }
};
