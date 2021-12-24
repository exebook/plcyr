function pl_lat2cyr(txt) {
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
