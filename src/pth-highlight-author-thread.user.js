// ==UserScript==
// @name         RED Highlight Created Forum Threads
// @namespace    http://savagecore.eu/
// @version      0.1.3
// @description  Highlight threads you created
// @author       SavageCore
// @include      http*://redacted.ch/forums.php?action=viewforum*
// @include      http*://redacted.ch/forums.php?page=*&action=viewforum*
// @include      http*://redacted.ch/user.php?action=edit&userid=*
// @downloadURL  https://github.com/SavageCore/pth-highlight-author-thread/raw/master/src/pth-highlight-author-thread.user.js
// @require      http://bgrins.github.com/spectrum/spectrum.js
// @resource     spectrumCSS http://bgrins.github.com/spectrum/spectrum.css
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText

// ==/UserScript==

/* global document window GM_addStyle GM_getValue GM_setValue GM_getResourceText unsafeWindow */
/* eslint new-cap: "off" */

(function () {
	'use strict';

	// Load settings
	const settings = getSettings();

		// Append CSS to document
	GM_addStyle('.sc_highlight_author_thread { background-color: ' + settings.colour + ' !important}');

		// Get userid
	const userinfoElement = document.getElementsByClassName('username')[0];
	const userid = userinfoElement.href.match(/user\.php\?id=(\d+)/)[1];

	const table = document.getElementsByClassName('forum_index')[0];
	const tbody = document.querySelectorAll('.forum_index > tbody')[0];

	const settingsPage = window.location.href.match('user.php\\?action=edit&userid=');

	if (settingsPage) {
		// Append colour picker to settings page
		appendSettings();
	} else {
		findThreads(table);
		// Observe the page for more rows added to table
		const obs = new MutationObserver(mutations => { // eslint-disable-line no-undef
			const rows = mutations[0].addedNodes;
				// Start at 1 to skip 'page-info' row inserted by Infinite Scroll
			for (let i = 1; i < rows.length; i++) {
				if (userid === rows[i].cells[3].firstChild.href.match(/user\.php\?id=(\d+)/)[1]) {
					rows[i].className = 'sc_highlight_author_thread';
				}
			}
		});

		obs.observe(tbody, {
			childList: true
		});
	}

	function findThreads(table) {
		// Loop all threads
		for (let i = 0; i < table.rows.length; i++) {
			const row = table.rows[i];
			// Skip heading rows
			if (row.className === 'colhead') {
				continue;
			}
			// Match Author column <a> against userid and replace classname
			if (userid === row.cells[3].firstChild.href.match(/user\.php\?id=(\d+)/)[1]) {
				row.className = 'sc_highlight_author_thread';
			}
		}
	}

	function appendSettings() {
		const $ = unsafeWindow.jQuery;
		// Load remote spectrum css
		const spectrumCSS = GM_getResourceText('spectrumCSS');
		GM_addStyle(spectrumCSS);

		const container = document.getElementById('site_appearance_settings').lastElementChild;
		const lastRow = container.lastElementChild;
		const settingsHTML = '<tr id="sc_highlight_author_thread_tr">\n\t<td class="label tooltip"><strong>Thread Highlight Colour</strong></td>\n<td>\n\t<input type="color" name="sc_highlight_author_thread_settings_colour" id="sc_highlight_author_thread_settings_colour" value="" placeholder="#FFFFFF">\n</td>\n</tr>';
		lastRow.insertAdjacentHTML('afterend', settingsHTML);

		$('#sc_highlight_author_thread_settings_colour').spectrum({
			preferredFormat: 'hex',
			color: settings.colour,
			showInput: true,
			showPalette: true,
			change(color) {
				color.toHexString();
				GM_setValue('colour', color.toHexString());
			}
		});
	}

	function getSettings() {
		const colour = GM_getValue('colour', '');
		if (colour) {
			return {
				colour
			};
		}
		return {
			colour: '#FF7043'
		};
	}
})();
