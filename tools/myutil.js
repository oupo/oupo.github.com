var addEvent =
 window.addEventListener ? function(e, n, f) { e.addEventListener(n, f, false); }
                         : function(e, n, f) { e.attachEvent("on" + n, f); };

function submit_callback(fn) {
	return function(ev) {
		try {
			fn(get_event_target(ev));
		} catch(e) {
			if (!(e instanceof InputError)) throw e;
			alert(e.message);
		}
	}
}

function read_input(input, name, min, max) {
	var value = read_int_string(input.value);
	if (min == undefined) min = -Infinity;
	if (max == undefined) max =  Infinity;
	if (value !== null && min <= value && value <= max) {
		return value;
	} else {
		input_error(name+"に入力されている値が不正です");
	}
}

function read_input_re(input, re, name) {
	var m = re.exec(input.value);
	if (!m) input_error(name+"に入力されている値が不正です");
	return m;
}

function read_int_string(s, default_value) {
	if (/^\s*$/.test(s) && default_value !== undefined) {
		return default_value;
	}
	if (!/^\s*(?:-?\d+|0x[0-9a-f]+)\s*$/i.test(s)) {
		return null;
	}
	return Number(s);
}

function input_error(message) {
	throw new InputError(message);
}

function InputError(message) {
	this.message = message;
}



function get_checked_radio_value(radios) {
	var index = get_checked_radio_index(radios);
	if (index === null) return null;
	return radios[index].value;
}

function get_checked_radio_index(radios) {
	for (var i = 0; i < radios.length; i ++) {
		if (radios[i].checked) return i;
	}
	return null;
}

function get_event_target(event) {
	return event.target || event.srcElement;
}

function elem_has_class(e, className) {
	var s = e.className;
	if (s === className) return true;
	if (!/\s/.test(s)) return false;
	var classes = s.split(/\s+/);
	for (var i = 0, l = classes.length; i < l; i ++) {
		if (classes[i] === className) {
			return true;
		}
	}
	return false;
}

function elem_add_class(e, className) {
	if (e.className === "") {
		e.className = className;
		return;
	}
	if (!elem_has_class(e, className)) {
		e.className += " " + className;
	}
}

function elem_remove_class(e, className) {
	var s = e.className;
	if (s === className) {
		e.className = "";
		return;
	}
	if (!/\s/.test(s)) return;
	var classes = s.split(/\s+/);
	var index = -1;
	for (var i = 0, l = classes.length; i < l; i ++) {
		if (classes[i] === className) {
			index = i;
			break;
		}
	}
	if (index >= 0) {
		classes.splice(index, 1);
		e.className = classes.join(" ");
	}
}

function elem_add_or_remove_class(e, className, cond) {
	if (cond) {
		elem_add_class(e, className);
	} else {
		elem_remove_class(e, className);
	}
}

function html_to_fragment(html) {
	var div = document.createElement("div");
	div.innerHTML = html;
	var nodes = div.childNodes;
	var fragment = document.createDocumentFragment();
	for (var i = 0; i < nodes.length; i ++) {
		fragment.appendChild(nodes[i]);
	}
	return fragment;
}

function get_child_elems(elem, tagName) {
	var nodes = elem.childNodes;
	var result = [];
	var name = tagName != undefined ? tagName : "*";
	for (var i = 0; i < nodes.length; i ++) {
		var node = nodes[i];
		if (node.nodeType === 1 && (name === "*" || node.tagName.toUpperCase() === name.toUpperCase())) {
			result.push(node);
		}
	}
	return result;
}

function get_child_elem(elem, tagName) {
	return get_child_elems(elem, tagName)[0];
}

function get_elems_by_tag_and_class(root, tagName, className) {
	if (document['querySelector']) {
		return root.querySelectorAll(tagName+"."+className);
	}
	var elems = root.getElementsByTagName(tagName);
	var result = [];
	for (var i = 0; i < elems.length; i ++) {
		if (elem_has_class(elems[i], className)) {
			result.push(elems[i]);
		}
	}
	return result;
}

function get_elem_by_tag_and_class(root, tagName, className) {
	if (document['querySelector']) {
		return root.querySelector(tagName+"."+className);
	}
	var elems = root.getElementsByTagName(tagName);
	for (var i = 0; i < elems.length; i ++) {
		if (elem_has_class(elems[i], className)) {
			return elems[i];
		}
	}
}

function get_parent_elem(elem, tagName) {
	var e = elem;
	while (e && e.nodeType === 1) {
		if (e !== elem && e.tagName.toLowerCase() === tagName.toLowerCase()) {
			return e;
		}
		e = e.parentNode;
	}
	return null;
}

function format_hex(n, prec) {
	var s = n.toString(16);
	return "0x" + (str_repeat("0", prec - s.length) + s);
}

function format_dec(n, prec, c) {
	var s = String(n);
	return (str_repeat(c || "0", prec - s.length) + s);
}

function str_repeat(s, n) {
	var r = "";
	for (var i = 0; i < n; i ++) {
		r += s;
	}
	return r;
}

function str_split(s, delim) {
	var a = s.split(delim);
	if (a[a.length - 1] === "") a.pop();
	return a;
}

function func_bind_args(fn, args) {
	return function() {
		return fn.apply(this, args);
	};
}

function array_each(array, fn) {
	var len = array.length;
	for (var i = 0; i < len; i ++) {
		fn(array[i]);
	}
}

function array_map(array, fn) {
	var len = array.length;
	var result = new Array(len);
	for (var i = 0; i < len; i ++) {
		result[i] = fn(array[i]);
	}
	return result;
}

function array_eq(a, b) {
	if (a == b) return true;
	if (a.length != b.length) return false;
	var l = a.length;
	for (var i = 0; i < l; i ++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

function array_swap(a, i, j) {
	var t = a[i];
	a[i] = a[j];
	a[j] = t;
}

function array_include(ary, e) {
	return array_indexof(ary, e) >= 0;
}

function array_indexof(ary, e) {
	for (var i = 0; i < ary.length; i ++) {
		if (ary[i] === e) {
			return i;
		}
	}
	return -1;
}

function array_copy(ary) {
	return ary.concat();
}

function obj_copy(obj) {
	var result = {};
	for (var p in obj) {
		result[p] = obj[p];
	}
	return result;
}
