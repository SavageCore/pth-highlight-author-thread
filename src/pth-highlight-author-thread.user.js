// ==UserScript==
// @name         Gazelle Highlight Created Forum Threads
// @namespace    http://savagecore.eu/
// @version      0.2.4
// @description  Highlight threads you created
// @author       SavageCore
// @include      http*://redacted.ch/forums.php?action=viewforum*
// @include      http*://redacted.ch/forums.php?page=*&action=viewforum*
// @include      http*://redacted.ch/user.php?action=edit&userid=*
// @include      http*://apollo.rip/forums.php?action=viewforum*
// @include      http*://apollo.rip/forums.php?page=*&action=viewforum*
// @include      http*://apollo.rip/user.php?action=edit&userid=*
// @include      http*://notwhat.cd/forums.php?action=viewforum*
// @include      http*://notwhat.cd/forums.php?page=*&action=viewforum*
// @include      http*://notwhat.cd/user.php?action=edit&userid=*
// @downloadURL  https://github.com/SavageCore/pth-highlight-author-thread/raw/master/src/pth-highlight-author-thread.user.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @run-at			 document-idle

// ==/UserScript==

/* global document window GM */
/* eslint new-cap: "off" */

(async function () {
	'use strict';

	// Get userid
	const userinfoElement = document.getElementsByClassName('username')[0];
	const userid = userinfoElement.href.match(/user\.php\?id=(\d+)/)[1];
	// Get current hostname
	const siteHostname = window.location.host;
	// Get domain-specific settings prefix to make this script multi-site
	const settingsNamePrefix = siteHostname + '_' + userid + '_';

	// Load settings
	const settings = await getSettings();

	// Append CSS to document
	GM.addStyle('.sc_highlight_author_thread { background-color: ' + settings.colour + ' !important}');

	const table = document.getElementsByClassName('forum_index')[0];
	const tbody = document.querySelectorAll('.forum_index > tbody')[0];

	const settingsPage = window.location.href.match('user.php\\?action=edit&userid=');

	if (settingsPage) {
		// Append colour picker to settings page
		appendSettings(settings);
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
		const container = document.getElementById('site_appearance_settings').lastElementChild;
		const lastRow = container.lastElementChild;
		const settingsHTML = `<tr id="sc_highlight_author_thread_tr">\n\t<td class="label tooltip" title="Use this colour to highlight all forum threads created by you"><strong>Thread Highlight Colour</strong></td>\n<td>\n\t<input type="color" name="sc_highlight_author_thread_settings_colour" id="sc_highlight_author_thread_settings_colour" value="${settings.colour}" placeholder="#FF7043">\n</td>\n</tr>`;
		lastRow.insertAdjacentHTML('afterend', settingsHTML);
		document.querySelector('#sc_highlight_author_thread_settings_colour').addEventListener('input', evt => {
			GM.setValue(settingsNamePrefix + 'colour', evt.target.value);
		}, false);
	}

	async function getSettings() {
		const tmp = {};
		tmp.colour = await GM.getValue(settingsNamePrefix + 'colour', '#FF7043');
		return tmp;
	}
})();
