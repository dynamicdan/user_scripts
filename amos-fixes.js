// ==UserScript==
// @name    	amos fixes
// @namespace   sn.amos
// @include 	https://sim-dev.srv.allianz/*
// @version 	1
// @grant   	none
// ==/UserScript==

(function () {

	// the popup view of references hides related lists, we can fix that!
	if (location.href.indexOf('tear_off') > 0) {
    	location.href = location.href.replace('tear_off', 'killed_off');
    	return;
	}


	// allow clicking sys_created_by and sys_updated_by links for direct access to users
	function enhanceLists() {
    	// get all columns and add user links if starting with admin_
    	var els = jQuery('.list2_body td');

    	els.each(function (i, e) {
        	var $el = jQuery(e);

        	if ($el.text().indexOf('admin_') === 0) {
            	$el.append('<a target="_blank" href="/sys_user.do?sysparm_query=user_name=' + $el.text() + '"> link</a>');
        	}
    	});
	}
	enhanceLists();
    
	// adds a link to the update set on DEV
	function linkToUpdateSets() {
    	if(location.href.indexOf('/rm_story.do') >= 0) {
        	//var us = g_form.getValue('u_update_set_name') + '';
        	//var story = extractNumberFromString(us)[0]; // could also use .number
        	var story = g_form.getValue('number')+'';
        	var link = 'https://sim-dev.srv.allianz/sys_update_set_list.do?sysparm_query=nameLIKE' + story;
        	var $el = jQuery(g_form.getControl('u_update_set_name'));
        	$el.parent().append('<a target="_blank" href="' + link + '"> Update set</a>');
    	}
	}
    
	linkToUpdateSets();
    
	function extractNumberFromString(str) {
    	var regex = new RegExp("[a-z]{3,}[0-9]{4,}", "gmi"),
        	results = str.match(regex) || [];
   	 
    	return results;
	}
    
    
	function enhanceUpdateList() {
    	if(location.href.indexOf('/sys_update_xml_list.do') > 0) {
        	var els = jQuery('tr.list_row td');
       	 
        	// go through all tds in the table looking for sys_ids to make sue of (Name col)
        	els.each(function (i, e) {
            	var $td = jQuery(e),
                	txt = $td.text(),
                	sys_id = extractSysIdFromName(txt);
           	 
            	if(sys_id) {
                	var table = txt.replace('_'+sys_id, '');
                	var link = '/' + table + '.do?sys_id=' + sys_id;
                	$td.append('<a target="_blank" href="' + link + '"> Link</a>');           	 
            	}
        	});
    	}
	}
    
	enhanceUpdateList();
    
	function extractSysIdFromName(str) {
    	var regEx = new RegExp("[a-z0-9]{32,}", "gi"),
        	matches;
    	if (typeof str != 'string') {
        	return false;
    	}

    	matches = str.match(regEx);

    	if (matches && matches.length > 0) {
        	// assumes only one sys_id str
        	return matches[0];
    	}

   	return false;
	}



	// support showing a hash of a script field for instance comparison
	String.prototype.hashCode = function () {
    	var hash = 0,
        	i, chr, len;
    	if (this.length === 0) return hash;
    	for (i = 0, len = this.length; i < len; i++) {
        	chr = this.charCodeAt(i);
        	hash = ((hash << 5) - hash) + chr;
        	hash |= 0; // Convert to 32bit integer
    	}
    	return hash;
	};

	// compare cross-instance values of fields by hashing them
	function hashCheck() {
    	var fields = ['script', 'html', 'client_script', 'processing_script', 'payload'];
    	for (var i = 0; i < fields.length; i++) {
        	var f = fields[i],
            	domQuery = '#column\\.' + g_form.getTableName() + '\\.' + f,
            	appendContent = '<span>Hash: ' + (g_form.getValue(f) + '').hashCode() + '</span>';

        	jQuery(domQuery).append(appendContent);
    	}
	}
	setTimeout(hashCheck, 300);


	// easier to track browser tabs
	function tabTitleFix() {
    	var sites = {
        	'sim-dev.srv': 'DEV- ',
        	'sim-int.srv': 'INT- ',
        	'sim-sand.srv': 'SAND- ',
        	'sim-sande2.srv': 'S2- ',
        	'sim.srv': 'PROD- ',
    	};

    	for (var i in sites) {
        	if (location.href.indexOf(i) >= 0) {
            	var title = jQuery('title').text();
            	jQuery('title').text(sites[i] + title);
        	}
    	}
	}
	setTimeout(tabTitleFix, 300);


})();
