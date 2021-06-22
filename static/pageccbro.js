const sessions = require('../data/sessions');
const fUtil = require('../fileUtil');
const stuff = require('./info');

function toAttrString(table) {
	return typeof (table) == 'object' ? Object.keys(table).filter(key => table[key] !== null).map(key =>
		`${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`).join('&') : table.replace(/"/g, "\\\"");
}
function toParamString(table) {
	return Object.keys(table).map(key =>
		`<param name="${key}" value="${toAttrString(table[key])}">`
	).join(' ');
}
function toObjectString(attrs, params, navbar) {
	return `<object id="obj" ${Object.keys(attrs).map(key =>
		`${key}="${attrs[key].replace(/"/g, "\\\"")}"`
	).join(' ')}>${toParamString(params)}</object>`;
}

module.exports = function (req, res, url) {
	if (req.method != 'GET') return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case '/charactercreator/': {
			title = 'Make a Character - Vyond Remastered';
			attrs = {	
				data: process.env.SWF_URL + '/cc_browser.swf', // data: 'cc.swf',
				type: 'application/x-shockwave-flash', id: 'char_creator', width: '960', height: '1200',
			};
			params = {
				flashvars: {
					'apiserver': 'http://localhost/', 'storePath': process.env.STORE_URL + '/<store>',
					'clientThemePath': process.env.CLIENT_URL + '/<client_theme>',
					'themeId': 'business', 'ut': 60, 'appCode': 'go', 'page': '', 'siteId': 'go',
					'm_mode': 'school', 'isLogin': 'Y', 'isEmbed': 1, 'ctc': 'go', 'tlang': 'en_US',
				},
				allowScriptAccess: 'always',
				movie: process.env.SWF_URL + '/cc.swf', // 'http://localhost/cc.swf'
			};
			break;
		}
		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(
	`<link href="https://josephcrosmanplays532.github.io/fonts/1/sailec.css" rel="stylesheet" type="text/css"><link href="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/css/common_combined.css.gz.css" rel="stylesheet" type="text/css"><link rel="stylesheet" href="/html/css/cc.css.gz.css"><script href="/html/themelist/themelistfiles/common_combined.js.gz.js"></script><script>document.title='${title}',flashvars=${JSON.stringify(
	params.flashvars
	)}</script><script src="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/js/common_combined.js.gz.js"></script><body style="margin:0px">
<div class="site-header">
    <div class="navbar site-nav site-nav--legacy" role="navigation">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="/yourvideos" title="Vyond Remastered">
                      <img alt="Vyond Remastered" src="/html/logo.png">
                  </a>
            </div>

            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="nav navbar-nav navbar-right">
<li class="dropdown">
    <a class="dropdown-toggle" href="https://support.vyond.com/?_ga=2.118183692.44759581.1608756444-2109047380.1607812465" data-toggle="dropdown" aria-expanded="false">Help<span class="dropdown-caret"></span></a>
    <ul class="dropdown-menu dropdown-menu-help">
        <li>
            <a href="https://discord.gg/YYFenX5Fep">Help Center</a>
        </li>
    </ul>
</li>
<li>
                        <a class="hidden-sm hidden-md hidden-lg" href="/videomaker">Make a Video</a>
                        <span class="site-nav-btn hidden-xs"><a class="btn btn-orange" href="/videomaker">Make a Video</a></span>
                    </li>

<script>
    $('.dropdown-menu-help').click(function(e) {
        e.stopPropagation();
    });
</script>

<li class="dropdown">
    <a class="dropdown-toggle" href="/account" data-toggle="dropdown" aria-expanded="false">
        <span class="hidden-sm hidden-md hidden-lg">Your Account</span>
        <div class="site-nav__profile-image">
            <div class="badge-circle">U</div>
        </div><span class="dropdown-caret"></span>
    </a>
    <ul class="dropdown-menu dropdown-menu-user">
        <li class="dropdown-user-profile">
            <div class="dropdown-user-profile__display-name">
                You            </div>
            
        </li>
        <li class="divider"></li>
        <li><a href="/account">Account Settings</a></li>
        
        <li class="divider"></li>
        <li><a class="logout-link gtm-logout" href="/logoff">Logout</a></li>
    </ul>
</li>

<script>
    $('.dropdown-menu-user').click(function(e) {
        e.stopPropagation();
    });
</script>
                </ul>
            </div>
    </div>
</div>
<div class="container container-cc">


        <ul class="breadcrumb">
            <li><a href="/videomaker">Make a video</a></li>
            <li class="active">Your Characters</li>
        </ul>

        <p>Browse characters already available in that theme and use them as a starting point to create new custom characters.</p>

<div id="ccbrowser-container" align="center">
${toObjectString(attrs, params)}
</div>
<footer class="site-footer">
    <div class="container">
        © 2021 Vyond Remastered.
    </div>
</footer>
	</body>${stuff.pages[url.pathname] || ''}`
		);
	return true;
}
