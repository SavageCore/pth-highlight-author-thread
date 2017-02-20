// ==UserScript==
// @name         RED Highlight Created Forum Threads
// @namespace    http://savagecore.eu/
// @version      0.1.2
// @description  Highlight threads you created
// @author       SavageCore
// @include      http*://redacted.ch/forums.php?action=viewforum*
// @include      http*://redacted.ch/forums.php?page=*&action=viewforum*
// @downloadURL  https://github.com/SavageCore/pth-highlight-author-thread/raw/master/src/pth-highlight-author-thread.user.js
// @grant        GM_addStyle

// ==/UserScript==

/*	global document GM_addStyle	*/

(function () {
		'use strict';
		// Append CSS to document
		GM_addStyle('.sc_highlight_author_thread { background-color: #FF7043 !important}'); // eslint-disable-line new-cap

		// Get userid
		var userinfoElement = document.getElementsByClassName('username')[0];
		var userid = userinfoElement.href.match(/user\.php\?id=(\d+)/)[1];

		var table = document.getElementsByClassName('forum_index')[0];
		var tbody = document.querySelectorAll('.forum_index > tbody')[0];

		findThreads(table);

		// Observe the page for more rows added to table
		MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var obs = new MutationObserver(function (mutations, observer) {
				var rows = mutations[0].addedNodes;
				// Start at 1 to skip 'page-info' row inserted by Infinite Scroll
				for (var i = 1; i < rows.length; i++) {
					if (userid === rows[i].cells[3].firstChild.href.match(/user\.php\?id=(\d+)/)[1]) {
						rows[i].className = 'sc_highlight_author_thread';
					}
				}
		});

		obs.observe(tbody, {
			childList: true,
		});

	function findThreads(table) {
		// Loop all threads
		for (var i = 0; i < table.rows.length; i++) {
			var row = table.rows[i];
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
})();
