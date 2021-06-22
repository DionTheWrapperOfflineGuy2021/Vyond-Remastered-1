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
		case '/videomaker/full/': {
			let presave = query.movieId && query.movieId.startsWith('m') ? query.movieId :
				`m-${fUtil[query.noAutosave ? 'getNextFileId' : 'fillNextFileId']('movie-', '.xml')}`;
			title = 'The Video Maker from Vyond Remastered - Make a Video for YouTube!';
			attrs = { 
				data: process.env.SWF_URL + '/go_full.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': 'http://localhost/', 'storePath': process.env.STORE_URL + '/<store>', 'isEmbed': 1, 'ctc': 'go',
					'ut': 60, 'bs': 'default', 'appCode': 'go', 'page': '', 'siteId': 'go', 'lid': 13, 'isLogin': 'Y', 'retut': 1,
					'clientThemePath': process.env.CLIENT_URL + '/<client_theme>', 'themeId': 'business', 'tlang': 'en_US',
					'presaveId': presave, 'goteam_draft_only': 1, 'isWide': 0, 'nextUrl': '/yourvideos',
				},
				allowScriptAccess: 'always',
			};
			sessions.set({ movieId: presave }, req);
			break;
		}
		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(
	`<link href="https://josephcrosmanplays532.github.io/fonts/1/sailec.css" rel="stylesheet" type="text/css"><link href="https://josephcrosmanplays532.github.io/static/55910a7cd204c37c/go/css/common_combined.css.gz.css" rel="stylesheet" type="text/css"><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700"><link rel="stylesheet" href="/html/css/importer.css.gz.css"><script href="/html/themelist/themelistfiles/common_combined.js.gz.js"></script><script>document.title='${title}',flashvars=${JSON.stringify(
	params.flashvars
	)}</script><body style="margin:0px">
	${toObjectString(attrs, params)}
	</body>${stuff.pages[url.pathname] || ''}`
		);
	return true;
}
