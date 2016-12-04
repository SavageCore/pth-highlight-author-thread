// ==UserScript==
// @name         PTH Highlight Created Forum Threads
// @namespace    http://savagecore.eu/
// @version      0.1.1
// @description  Highlight threads you created
// @author       SavageCore
// @include      http*://passtheheadphones.me/forums.php?action=viewforum*
// @include      http*://passtheheadphones.me/forums.php?page=*&action=viewforum*
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

		// Loop all threads
	var table = document.getElementsByClassName('forum_index')[0];
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
})();
