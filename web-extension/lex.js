function lex(s) {
	function is_char(c) {
		if (c >= 'A' && c <= 'Z') return true
		if (c >= 'a' && c <= 'z') return true
		return false
	}

	var R = [], i = 0
	while (i < s.length) {
		if (is_char(s[i])) {
			var w = s[i++]
			while (i < s.length && is_char(s[i])) {
				w += s[i++]
			}
			R.push({ type: 0, s: w })
		}
		else {
			var w = s[i++]
			while (i < s.length && !is_char(s[i])) {
				w += s[i++]
			}
			R.push({ type: 1, s: w })
		}
	}
	return R
}

