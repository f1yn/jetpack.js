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
const jetpack = function(options = {}) {

	const presetDurations = {
		slow: 2000,
		medium: 900,
		fast: 400
	};

	const config = {
		duration: presetDurations.medium,
		updateURL: false,
		animation: true
	};

	const flags = {
		hasListener: false
	};

	const set = Object.freeze({
		duration(value) {
			switch (typeof value) {
				case "number":
					{
						config.duration = Math.abs(value);
					}
				case "string":
					{
						let parsed = presetDurations[value] || value;
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
		updateURL: value => (config.updateURL = typeof value === "boolean" ? value : config.updateURL),
		animation: value => (config.animation = typeof value === "boolean" ? value : config.animation)
	});

	// start setting config based on options
	set.duration(options.duration);
	set.updateURL(options.updateURL);
	set.animation(options.animation);

	/* START METHODS */
	const {
		documentElement,
		body
	} = document;

	const getScrollPosition = () => (window.pageYOffset || documentElement.scrollTop);
	const getScrollHeight = () => (body.scrollHeight || documentElement.scrollHeight);

	// transition functions for scrolls (currently only one)
	const ease = {
		InOutCubic: (t, b, c, d) => {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		}
	}

	const scroll = (delta = 0, args = {}) => {
		args.callback = (typeof args.callback === "function") ? args.callback : () => {};

		// animation formula (more to be added later)
		let startTime = null,
			startPos = getScrollPosition(),
			maxScroll = getScrollHeight() - window.innerHeight,
			scrollEndValue = (startPos + delta < maxScroll) ? delta : maxScroll - startPos;

		if (config.animation) {
			const {
				InOutCubic
			} = ease;

			const scrollFrame = timestamp => {
				startTime = startTime || timestamp;
				var elapsed = timestamp - startTime;

				documentElement.scrollTop = body.scrollTop = InOutCubic(elapsed, startPos, scrollEndValue, config.duration);
				(elapsed < config.duration) ? requestAnimationFrame(scrollFrame): args.callback();
			};
			requestAnimationFrame(scrollFrame);

		} else {
			documentElement.scrollTop = body.scrollTop = scrollEndValue;
		}
	}

	// scrolls to specific Y axis location in relation to the root scroll location
	const scrollTop = (pos = 0, args) =>
		scroll(pos - getScrollPosition(), args);

	// scrolls to element on page (pass element as first argument, second argument optional)
	const scrollToElement = (elem, args) =>
		(typeof elem === "object" && elem !== null) &&
		scroll(elem.getBoundingClientRect().top, args);

	const hookAnchors = () => {
		if (!flags.hasListener) {
			let listener = e => {
				let target = e.target,
					hRef = target.getAttribute('href');

				if (target.nodeName === 'A' && hRef.indexOf('#') < 2) {
					// fix for pages with trailing '/'
					hRef = (hRef.indexOf('/#') === 0) ? hRef.substring(1) : hRef;

					if (hRef.charAt(0) === '#') e.preventDefault();

					if (hRef.length > 1) {
						if (elem = document.getElementById(hRef.substring(1))) {
							scrollToElement(elem, {
								callback: function() {
									config.updateURL && (window.location.href = hRef)
								}
							});
						}
					} else {
						scrollToElement(body, {
							callback: function() {
								config.updateURL && (window.location.href = '#')
							}
						});
					}
				}
			};

			window.addEventListener('click', listener);
			flags.hasListener = true;
		}
	}

	return Object.freeze({
		get: Object.freeze(config), // readonly
		set, // also readonly, but setter
		hookAnchors,
		scrollToElement,
		scroll,
		scrollTop,
	});
}
/*__END_WRAP__*/

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = jetpack;
}
