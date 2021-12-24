var translationEngines = [
	'https://translate.google.com/?sl=pl&tl=ru&text=%s&op=translate',
	'https://ru.glosbe.com/pl/ru/%s',
]
var translationEngine = 0

function isExcluded(elm) {
	if (elm.tagName == "STYLE") return true
	if (elm.tagName == "SCRIPT") return true
	if (elm.tagName == "NOSCRIPT") return true
	if (elm.tagName == "IFRAME") return true
	if (elm.tagName == "OBJECT") return true
	return false
}

function traverse(elm) {
	max++
	//if (max >= 10) return
	if (elm.nodeType == Node.ELEMENT_NODE || elm.nodeType == Node.DOCUMENT_NODE) {
		if (isExcluded(elm)) return
		for (var i=0; i < elm.childNodes.length; i++) {
			traverse(elm.childNodes[i])
		}
	}

	if (elm.nodeType == Node.TEXT_NODE) {
		if (elm.nodeValue.trim() == "") return
		elm.parentNode.replaceChild(convert_node(elm), elm);
	}
}

var max = 0
console.log('start')
traverse(document)

function is_char(c) {
	if (c >= 'A' && c <= 'Z') return true
	if (c >= 'a' && c <= 'z') return true
	if ('ŁłÓóŻżŃńĆćŚśŹźĄąĘę'.indexOf(c) >= 0)  return true
	return false
}

function lex(s) {
	var R = [], i = 0
	while (i < s.length) {
		if (is_char(s[i])) {
			var w = s[i++]
			while (i < s.length && is_char(s[i])) {
				w += s[i++]
			}
			R.push({type: 0, s: w})
		}
		else {
			var w = s[i++]
			while (i < s.length && !is_char(s[i])) {
				w += s[i++]
			}
			R.push({type: 1, s: w})
		}
	}
	return R
}

function flipper(elem) {
	function flip(e) {
		if (e.style.display == 'none') {
			e.style.display = 'inline'
			e.pair.style.display = 'none'
		}
		else {
			e.style.display = 'none'
			e.pair.style.display = 'inline'
		}
	}

	return e => {
		flip(elem)
		var word = elem.innerText
		word = word.slice(1, word.length - 1)
		navigator.clipboard.writeText(word)
	}
}

function selectText(node) {
	if (document.body.createTextRange) {
		const range = document.body.createTextRange()
		range.moveToElementText(node)
		range.select()
	}
	else if (window.getSelection) {
		const selection = window.getSelection()
		const range = document.createRange()
		range.selectNodeContents(node)
		selection.removeAllRanges()
		selection.addRange(range)
	}
	else {
		console.warn("Could not select text in node: Unsupported browser.")
	}
}

function selector(elem) {
	var word = elem.innerText
	word = word.slice(1, word.length - 1)
	return e => window.open(translationEngines[translationEngine].replace('%s', word))
	return e => selectText(elem)
}

function convert_node(e0) {
	var o = []
	var e = document.createElement('span')

	var tokens = lex(e0.nodeValue)
	for (var i = 0; i < tokens.length; i++) {
		if (tokens[i].type == 0) {
			var pol = document.createElement('span')

			pol.innerText = ' ' + tokens[i].s + ' '
			pol.style.display = 'none'
			pol.style.color = 'green'
			//pol.onclick = selector(pol)
			pol.onclick = flipper(pol)

			var cyr = document.createElement('span')
			cyr.innerText = cvt_word(tokens[i].s)
			cyr.onclick = flipper(cyr)

			cyr.pair = pol
			pol.pair = cyr
			o.push(cyr)
			o.push(pol)
		}
		else {
			o.push(document.createTextNode(tokens[i].s))
		}
	}

	for (var i = 0; i < o.length; i++) e.appendChild(o[i])
	return e
}

function cvt_word(txt) {
	var basic_p = 'ABDFGHKLMNOPTUWYZabdfghklmnoptuwyz'
		+ 'ÓóŻżŃńĆćŚśŹźĄąĘęVv'
	var basic_r = 'АБДФГХКЛМНОПТУВЫЗабдфгхклмноптувыз'
		+ 'ӦӧЖжЊњҸҹĊċӜӝÅåӬӭВв' //ÄÅäåȮȯӦӧ
	var cons_p = 'BCDFGHJKLMNPRSTWZbcdfghjklmnprstwzŁłŻżŃńĆćŚśŹź'
	var o = ''
	var skip = false

	for (var index = 0; index < txt.length; index++) {

		if (skip) {
			skip = false
			continue
		}
		var item = txt[index]
		var j = basic_p.indexOf(item)
		var next = txt[index + 1]

		if (next == null) next = ''
		if (j >= 0) {
			o += basic_r[j]
		}
		else if (item == 'Ł') { o += 'Л̥' } // Љљ
		else if (item == 'ł') { o += 'л̥' }
		else if (item == 'E') { o += 'Е̥' } // Ээ
		else if (item == 'e') { o += 'е̥' }
		else if (item == 'C') {
			if (next == 'Z' || next == 'z') { o += 'Ӵ'; skip = true }
			else if (next == 'H' || next == 'h') { o += 'Х'; skip = true }
			else o += 'Ц'
		}
		else if (item == 'c') {
			if (next == 'Z' || next == 'z') { o += 'ӵ'; skip = true }
			else if (next == 'H' || next == 'h') { o += 'х'; skip = true }
			else o += 'ц'
		}

		else if (item == 'S') {
			if (next == 'Z' || next == 'z') { o += 'Ш'; skip = true }
			else o += 'С'
		}
		else if (item == 's') {
			if (next == 'Z' || next == 'z') { o += 'ш'; skip = true }
			else o += 'с'
		}

		else if (item == 'R') { //Ṗṗ
			if (next == 'Z' || next == 'z') { o += 'Ṗ'; skip = true }
			else o += 'Р'
		}
		else if (item == 'r') { //ṗҏ
			if (next == 'Z' || next == 'z') { o += 'ṗ'; skip = true }
			else o += 'р'
		}

		else if (item == 'I') {
			if (next == 'A' || next == 'a') { o += 'Я'; skip = true }
			else if (next == 'E' || next == 'e') { o += 'Е'; skip = true }
			else if (next == 'Ą' || next == 'ą') { o += 'Я'; skip = true }
			else if (next == 'Ę' || next == 'ę') { o += 'Ē'; skip = true }
			else if (next == 'Ó' || next == 'ó') { o += 'Ӱ'; skip = true }
			else if (next == 'U' || next == 'u') { o += 'Ю'; skip = true }
			else o += 'И'
		}
		else if (item == 'i') {
			if (next == 'A' || next == 'a') { o += 'я'; skip = true }
			else if (next == 'E' || next == 'e') { o += 'е'; skip = true }
			else if (next == 'Ą' || next == 'ą') { o += 'я'; skip = true }
			else if (next == 'Ę' || next == 'ę') { o += 'ē'; skip = true }
			else if (next == 'Ó' || next == 'ó') { o += 'ӱ'; skip = true }
			else if (next == 'U' || next == 'u') { o += 'ю'; skip = true }
			else o += 'и'
		}

		else if (item == 'J') {
			if (next == 'A' || next == 'a') { o += 'Я'; skip = true }
			else if (next == 'E' || next == 'e') { o += 'Е'; skip = true }
			else if (next == 'Ą' || next == 'ą') { o += 'Я'; skip = true }
			else if (next == 'Ę' || next == 'ę') { o += 'Ē'; skip = true }
			else if (next == 'Ó' || next == 'ó') { o += 'Ӱ'; skip = true }
			else if (next == 'U' || next == 'u') { o += 'Ю'; skip = true }
			else o += 'Й'
		}
		else if (item == 'j') {
			if (next == 'A' || next == 'a') { o += 'я'; skip = true }
			else if (next == 'E' || next == 'e') { o += 'е'; skip = true }
			else if (next == 'Ą' || next == 'ą') { o += 'я'; skip = true }
			else if (next == 'Ę' || next == 'ę') { o += 'ē'; skip = true }
			else if (next == 'Ó' || next == 'ó') { o += 'ӱ'; skip = true }
			else if (next == 'U' || next == 'u') { o += 'ю'; skip = true }
			else o += 'й'
		}

		else o += item;
	}

	return o
}

