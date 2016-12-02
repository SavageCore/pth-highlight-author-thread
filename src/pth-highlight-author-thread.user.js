// ==UserScript==
// @name         passtheheadphones.me - Highlight Created Forum Threads
// @namespace    http://savagecore.eu/
// @version      0.1.0
// @description  Highlight threads you created
// @author       SavageCore
// @include      http*://passtheheadphones.me/forums.php?action=viewforum*
// @downloadURL  https://github.com/SavageCore/pth-highlight-author-thread/raw/master/src/pth-highlight-author-thread.user.js

// ==/UserScript==

/*	global document	*/

(function () {
	'use strict';
		// Append CSS to document
	addCSS('.sc_highlight_author_thread { background-color: #FF7043 !important}');

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

	function addCSS(style) {
		var css = document.createElement('style');
		document.getElementsByTagName('head')[0].appendChild(css);
		css.type = 'text/css';
		css.innerHTML = style;
	}
})();
