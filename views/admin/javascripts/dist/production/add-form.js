!function(t, e) {
    "use strict";
    function s(t, e) {
        var s, i, r = t.toLowerCase();
        for (e = [].concat(e), s = 0; s < e.length; s += 1) if (i = e[s]) {
            if (i.test && i.test(t)) return !0;
            if (i.toLowerCase() === r) return !0;
        }
    }
    var i = e.prototype.trim, r = e.prototype.trimRight, n = e.prototype.trimLeft, o = function(t) {
        return 1 * t || 0;
    }, l = function(t, e) {
        if (e < 1) return "";
        for (var s = ""; e > 0; ) 1 & e && (s += t), e >>= 1, t += t;
        return s;
    }, h = [].slice, c = function(t) {
        return null == t ? "\\s" : t.source ? t.source : "[" + p.escapeRegExp(t) + "]";
    }, a = {
        "lt": "<",
        "gt": ">",
        "quot": '"',
        "amp": "&",
        "apos": "'"
    }, u = {};
    for (var _ in a) u[a[_]] = _;
    u["'"] = "#39";
    var d = function() {
        function t(t) {
            return Object.prototype.toString.call(t).slice(8, -1).toLowerCase();
        }
        var s = l, i = function() {
            return i.cache.hasOwnProperty(arguments[0]) || (i.cache[arguments[0]] = i.parse(arguments[0])), 
            i.format.call(null, i.cache[arguments[0]], arguments);
        };
        return i.format = function(i, r) {
            var n, o, l, h, c, a, u, _ = 1, p = i.length, f = "", g = [];
            for (o = 0; o < p; o++) if ("string" === (f = t(i[o]))) g.push(i[o]); else if ("array" === f) {
                if ((h = i[o])[2]) for (n = r[_], l = 0; l < h[2].length; l++) {
                    if (!n.hasOwnProperty(h[2][l])) throw new Error(d('[_.sprintf] property "%s" does not exist', h[2][l]));
                    n = n[h[2][l]];
                } else n = h[1] ? r[h[1]] : r[_++];
                if (/[^s]/.test(h[8]) && "number" != t(n)) throw new Error(d("[_.sprintf] expecting number but found %s", t(n)));
                switch (h[8]) {
                  case "b":
                    n = n.toString(2);
                    break;

                  case "c":
                    n = e.fromCharCode(n);
                    break;

                  case "d":
                    n = parseInt(n, 10);
                    break;

                  case "e":
                    n = h[7] ? n.toExponential(h[7]) : n.toExponential();
                    break;

                  case "f":
                    n = h[7] ? parseFloat(n).toFixed(h[7]) : parseFloat(n);
                    break;

                  case "o":
                    n = n.toString(8);
                    break;

                  case "s":
                    n = (n = e(n)) && h[7] ? n.substring(0, h[7]) : n;
                    break;

                  case "u":
                    n = Math.abs(n);
                    break;

                  case "x":
                    n = n.toString(16);
                    break;

                  case "X":
                    n = n.toString(16).toUpperCase();
                }
                n = /[def]/.test(h[8]) && h[3] && n >= 0 ? "+" + n : n, a = h[4] ? "0" == h[4] ? "0" : h[4].charAt(1) : " ", 
                u = h[6] - e(n).length, c = h[6] ? s(a, u) : "", g.push(h[5] ? n + c : c + n);
            }
            return g.join("");
        }, i.cache = {}, i.parse = function(t) {
            for (var e = t, s = [], i = [], r = 0; e; ) {
                if (null !== (s = /^[^\x25]+/.exec(e))) i.push(s[0]); else if (null !== (s = /^\x25{2}/.exec(e))) i.push("%"); else {
                    if (null === (s = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(e))) throw new Error("[_.sprintf] huh?");
                    if (s[2]) {
                        r |= 1;
                        var n = [], o = s[2], l = [];
                        if (null === (l = /^([a-z_][a-z_\d]*)/i.exec(o))) throw new Error("[_.sprintf] huh?");
                        for (n.push(l[1]); "" !== (o = o.substring(l[0].length)); ) if (null !== (l = /^\.([a-z_][a-z_\d]*)/i.exec(o))) n.push(l[1]); else {
                            if (null === (l = /^\[(\d+)\]/.exec(o))) throw new Error("[_.sprintf] huh?");
                            n.push(l[1]);
                        }
                        s[2] = n;
                    } else r |= 2;
                    if (3 === r) throw new Error("[_.sprintf] mixing positional and named placeholders is not (yet) supported");
                    i.push(s);
                }
                e = e.substring(s[0].length);
            }
            return i;
        }, i;
    }(), p = {
        "VERSION": "2.3.0",
        "isBlank": function(t) {
            return null == t && (t = ""), /^\s*$/.test(t);
        },
        "stripTags": function(t) {
            return null == t ? "" : e(t).replace(/<\/?[^>]+>/g, "");
        },
        "capitalize": function(t) {
            return (t = null == t ? "" : e(t)).charAt(0).toUpperCase() + t.slice(1);
        },
        "chop": function(t, s) {
            return null == t ? [] : (t = e(t), (s = ~~s) > 0 ? t.match(new RegExp(".{1," + s + "}", "g")) : [ t ]);
        },
        "clean": function(t) {
            return p.strip(t).replace(/\s+/g, " ");
        },
        "count": function(t, s) {
            if (null == t || null == s) return 0;
            t = e(t);
            for (var i = 0, r = 0, n = (s = e(s)).length; ;) {
                if (-1 === (r = t.indexOf(s, r))) break;
                i++, r += n;
            }
            return i;
        },
        "chars": function(t) {
            return null == t ? [] : e(t).split("");
        },
        "swapCase": function(t) {
            return null == t ? "" : e(t).replace(/\S/g, function(t) {
                return t === t.toUpperCase() ? t.toLowerCase() : t.toUpperCase();
            });
        },
        "escapeHTML": function(t) {
            return null == t ? "" : e(t).replace(/[&<>"']/g, function(t) {
                return "&" + u[t] + ";";
            });
        },
        "unescapeHTML": function(t) {
            return null == t ? "" : e(t).replace(/\&([^;]+);/g, function(t, s) {
                var i;
                return s in a ? a[s] : (i = s.match(/^#x([\da-fA-F]+)$/)) ? e.fromCharCode(parseInt(i[1], 16)) : (i = s.match(/^#(\d+)$/)) ? e.fromCharCode(~~i[1]) : t;
            });
        },
        "escapeRegExp": function(t) {
            return null == t ? "" : e(t).replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        },
        "splice": function(t, e, s, i) {
            var r = p.chars(t);
            return r.splice(~~e, ~~s, i), r.join("");
        },
        "insert": function(t, e, s) {
            return p.splice(t, e, 0, s);
        },
        "include": function(t, s) {
            return "" === s || null != t && -1 !== e(t).indexOf(s);
        },
        "join": function() {
            var t = h.call(arguments), e = t.shift();
            return null == e && (e = ""), t.join(e);
        },
        "lines": function(t) {
            return null == t ? [] : e(t).split("\n");
        },
        "reverse": function(t) {
            return p.chars(t).reverse().join("");
        },
        "startsWith": function(t, s) {
            return "" === s || null != t && null != s && (t = e(t), s = e(s), t.length >= s.length && t.slice(0, s.length) === s);
        },
        "endsWith": function(t, s) {
            return "" === s || null != t && null != s && (t = e(t), s = e(s), t.length >= s.length && t.slice(t.length - s.length) === s);
        },
        "succ": function(t) {
            return null == t ? "" : (t = e(t)).slice(0, -1) + e.fromCharCode(t.charCodeAt(t.length - 1) + 1);
        },
        "titleize": function(t) {
            return null == t ? "" : (t = e(t).toLowerCase()).replace(/(?:^|\s|-)\S/g, function(t) {
                return t.toUpperCase();
            });
        },
        "camelize": function(t) {
            return p.trim(t).replace(/[-_\s]+(.)?/g, function(t, e) {
                return e ? e.toUpperCase() : "";
            });
        },
        "underscored": function(t) {
            return p.trim(t).replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
        },
        "dasherize": function(t) {
            return p.trim(t).replace(/([A-Z])/g, "-$1").replace(/[-_\s]+/g, "-").toLowerCase();
        },
        "classify": function(t) {
            return p.titleize(e(t).replace(/[\W_]/g, " ")).replace(/\s/g, "");
        },
        "humanize": function(t) {
            return p.capitalize(p.underscored(t).replace(/_id$/, "").replace(/_/g, " "));
        },
        "trim": function(t, s) {
            return null == t ? "" : !s && i ? i.call(t) : (s = c(s), e(t).replace(new RegExp("^" + s + "+|" + s + "+$", "g"), ""));
        },
        "ltrim": function(t, s) {
            return null == t ? "" : !s && n ? n.call(t) : (s = c(s), e(t).replace(new RegExp("^" + s + "+"), ""));
        },
        "rtrim": function(t, s) {
            return null == t ? "" : !s && r ? r.call(t) : (s = c(s), e(t).replace(new RegExp(s + "+$"), ""));
        },
        "truncate": function(t, s, i) {
            return null == t ? "" : (t = e(t), i = i || "...", s = ~~s, t.length > s ? t.slice(0, s) + i : t);
        },
        "prune": function(t, s, i) {
            if (null == t) return "";
            if (t = e(t), s = ~~s, i = null != i ? e(i) : "...", t.length <= s) return t;
            var r = t.slice(0, s + 1).replace(/.(?=\W*\w*$)/g, function(t) {
                return t.toUpperCase() !== t.toLowerCase() ? "A" : " ";
            });
            return ((r = r.slice(r.length - 2).match(/\w\w/) ? r.replace(/\s*\S+$/, "") : p.rtrim(r.slice(0, r.length - 1))) + i).length > t.length ? t : t.slice(0, r.length) + i;
        },
        "words": function(t, e) {
            return p.isBlank(t) ? [] : p.trim(t, e).split(e || /\s+/);
        },
        "pad": function(t, s, i, r) {
            t = null == t ? "" : e(t), s = ~~s;
            var n = 0;
            switch (i ? i.length > 1 && (i = i.charAt(0)) : i = " ", r) {
              case "right":
                return n = s - t.length, t + l(i, n);

              case "both":
                return n = s - t.length, l(i, Math.ceil(n / 2)) + t + l(i, Math.floor(n / 2));

              default:
                return n = s - t.length, l(i, n) + t;
            }
        },
        "lpad": function(t, e, s) {
            return p.pad(t, e, s);
        },
        "rpad": function(t, e, s) {
            return p.pad(t, e, s, "right");
        },
        "lrpad": function(t, e, s) {
            return p.pad(t, e, s, "both");
        },
        "sprintf": d,
        "vsprintf": function(t, e) {
            return e.unshift(t), d.apply(null, e);
        },
        "toNumber": function(t, e) {
            return t ? (t = p.trim(t)).match(/^-?\d+(?:\.\d+)?$/) ? o(o(t).toFixed(~~e)) : NaN : 0;
        },
        "numberFormat": function(t, e, s, i) {
            if (isNaN(t) || null == t) return "";
            t = t.toFixed(~~e), i = "string" == typeof i ? i : ",";
            var r = t.split("."), n = r[0], o = r[1] ? (s || ".") + r[1] : "";
            return n.replace(/(\d)(?=(?:\d{3})+$)/g, "$1" + i) + o;
        },
        "strRight": function(t, s) {
            if (null == t) return "";
            t = e(t);
            var i = (s = null != s ? e(s) : s) ? t.indexOf(s) : -1;
            return ~i ? t.slice(i + s.length, t.length) : t;
        },
        "strRightBack": function(t, s) {
            if (null == t) return "";
            t = e(t);
            var i = (s = null != s ? e(s) : s) ? t.lastIndexOf(s) : -1;
            return ~i ? t.slice(i + s.length, t.length) : t;
        },
        "strLeft": function(t, s) {
            if (null == t) return "";
            t = e(t);
            var i = (s = null != s ? e(s) : s) ? t.indexOf(s) : -1;
            return ~i ? t.slice(0, i) : t;
        },
        "strLeftBack": function(t, e) {
            if (null == t) return "";
            t += "", e = null != e ? "" + e : e;
            var s = t.lastIndexOf(e);
            return ~s ? t.slice(0, s) : t;
        },
        "toSentence": function(t, e, s, i) {
            e = e || ", ", s = s || " and ";
            var r = t.slice(), n = r.pop();
            return t.length > 2 && i && (s = p.rtrim(e) + s), r.length ? r.join(e) + s + n : n;
        },
        "toSentenceSerial": function() {
            var t = h.call(arguments);
            return t[3] = !0, p.toSentence.apply(p, t);
        },
        "slugify": function(t) {
            if (null == t) return "";
            var s = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź", i = new RegExp(c(s), "g");
            return t = e(t).toLowerCase().replace(i, function(t) {
                var e = s.indexOf(t);
                return "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz".charAt(e) || "-";
            }), p.dasherize(t.replace(/[^\w\s-]/g, ""));
        },
        "surround": function(t, e) {
            return [ e, t, e ].join("");
        },
        "quote": function(t, e) {
            return p.surround(t, e || '"');
        },
        "unquote": function(t, e) {
            return e = e || '"', t[0] === e && t[t.length - 1] === e ? t.slice(1, t.length - 1) : t;
        },
        "exports": function() {
            var t = {};
            for (var e in this) this.hasOwnProperty(e) && !e.match(/^(?:include|contains|reverse)$/) && (t[e] = this[e]);
            return t;
        },
        "repeat": function(t, s, i) {
            if (null == t) return "";
            if (s = ~~s, null == i) return l(e(t), s);
            for (var r = []; s > 0; r[--s] = t) ;
            return r.join(i);
        },
        "naturalCmp": function(t, s) {
            if (t == s) return 0;
            if (!t) return -1;
            if (!s) return 1;
            for (var i = /(\.\d+)|(\d+)|(\D+)/g, r = e(t).toLowerCase().match(i), n = e(s).toLowerCase().match(i), o = Math.min(r.length, n.length), l = 0; l < o; l++) {
                var h = r[l], c = n[l];
                if (h !== c) {
                    var a = parseInt(h, 10);
                    if (!isNaN(a)) {
                        var u = parseInt(c, 10);
                        if (!isNaN(u) && a - u) return a - u;
                    }
                    return h < c ? -1 : 1;
                }
            }
            return r.length === n.length ? r.length - n.length : t < s ? -1 : 1;
        },
        "levenshtein": function(t, s) {
            if (null == t && null == s) return 0;
            if (null == t) return e(s).length;
            if (null == s) return e(t).length;
            t = e(t), s = e(s);
            for (var i, r, n = [], o = 0; o <= s.length; o++) for (var l = 0; l <= t.length; l++) r = o && l ? t.charAt(l - 1) === s.charAt(o - 1) ? i : Math.min(n[l], n[l - 1], i) + 1 : o + l, 
            i = n[l], n[l] = r;
            return n.pop();
        },
        "toBoolean": function(t, e, i) {
            return "number" == typeof t && (t = "" + t), "string" != typeof t ? !!t : (t = p.trim(t), 
            !!s(t, e || [ "true", "1" ]) || !s(t, i || [ "false", "0" ]) && void 0);
        }
    };
    p.strip = p.trim, p.lstrip = p.ltrim, p.rstrip = p.rtrim, p.center = p.lrpad, p.rjust = p.lpad, 
    p.ljust = p.rpad, p.contains = p.include, p.q = p.quote, p.toBool = p.toBoolean, 
    "undefined" != typeof exports && ("undefined" != typeof module && module.exports && (module.exports = p), 
    exports._s = p), "function" == typeof define && define.amd && define("underscore.string", [], function() {
        return p;
    }), t._ = t._ || {}, t._.string = t._.str = p;
}(this, String), function() {
    var t, e, s, i, r, n = {}.hasOwnProperty, o = function(t, e) {
        function s() {
            this.constructor = t;
        }
        for (var i in e) n.call(e, i) && (t[i] = e[i]);
        return s.prototype = e.prototype, t.prototype = new s(), t.__super__ = e.prototype, 
        t;
    };
    (i = function() {
        function t() {
            this.options_index = 0, this.parsed = [];
        }
        return t.prototype.add_node = function(t) {
            return "OPTGROUP" === t.nodeName.toUpperCase() ? this.add_group(t) : this.add_option(t);
        }, t.prototype.add_group = function(t) {
            var e, s, i, r, n, o;
            for (e = this.parsed.length, this.parsed.push({
                "array_index": e,
                "group": !0,
                "label": this.escapeExpression(t.label),
                "children": 0,
                "disabled": t.disabled
            }), o = [], i = 0, r = (n = t.childNodes).length; i < r; i++) s = n[i], o.push(this.add_option(s, e, t.disabled));
            return o;
        }, t.prototype.add_option = function(t, e, s) {
            if ("OPTION" === t.nodeName.toUpperCase()) return "" !== t.text ? (null != e && (this.parsed[e].children += 1), 
            this.parsed.push({
                "array_index": this.parsed.length,
                "options_index": this.options_index,
                "value": t.value,
                "text": t.text,
                "html": t.innerHTML,
                "selected": t.selected,
                "disabled": !0 === s ? s : t.disabled,
                "group_array_index": e,
                "classes": t.className,
                "style": t.style.cssText
            })) : this.parsed.push({
                "array_index": this.parsed.length,
                "options_index": this.options_index,
                "empty": !0
            }), this.options_index += 1;
        }, t.prototype.escapeExpression = function(t) {
            var e, s;
            return null == t || !1 === t ? "" : /[\&\<\>\"\'\`]/.test(t) ? (e = {
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            }, s = /&(?!\w+;)|[\<\>\"\'\`]/g, t.replace(s, function(t) {
                return e[t] || "&amp;";
            })) : t;
        }, t;
    }()).select_to_array = function(t) {
        var e, s, r, n, o;
        for (s = new i(), r = 0, n = (o = t.childNodes).length; r < n; r++) e = o[r], s.add_node(e);
        return s.parsed;
    }, e = function() {
        function t(e, s) {
            this.form_field = e, this.options = null != s ? s : {}, t.browser_is_supported() && (this.is_multiple = this.form_field.multiple, 
            this.set_default_text(), this.set_default_values(), this.setup(), this.set_up_html(), 
            this.register_observers());
        }
        return t.prototype.set_default_values = function() {
            var t = this;
            return this.click_test_action = function(e) {
                return t.test_active_click(e);
            }, this.activate_action = function(e) {
                return t.activate_field(e);
            }, this.active_field = !1, this.mouse_on_container = !1, this.results_showing = !1, 
            this.result_highlighted = null, this.allow_single_deselect = null != this.options.allow_single_deselect && null != this.form_field.options[0] && "" === this.form_field.options[0].text && this.options.allow_single_deselect, 
            this.disable_search_threshold = this.options.disable_search_threshold || 0, this.disable_search = this.options.disable_search || !1, 
            this.enable_split_word_search = null == this.options.enable_split_word_search || this.options.enable_split_word_search, 
            this.group_search = null == this.options.group_search || this.options.group_search, 
            this.search_contains = this.options.search_contains || !1, this.single_backstroke_delete = null == this.options.single_backstroke_delete || this.options.single_backstroke_delete, 
            this.max_selected_options = this.options.max_selected_options || 1 / 0, this.inherit_select_classes = this.options.inherit_select_classes || !1, 
            this.display_selected_options = null == this.options.display_selected_options || this.options.display_selected_options, 
            this.display_disabled_options = null == this.options.display_disabled_options || this.options.display_disabled_options;
        }, t.prototype.set_default_text = function() {
            return this.form_field.getAttribute("data-placeholder") ? this.default_text = this.form_field.getAttribute("data-placeholder") : this.is_multiple ? this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || t.default_multiple_text : this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || t.default_single_text, 
            this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || t.default_no_result_text;
        }, t.prototype.mouse_enter = function() {
            return this.mouse_on_container = !0;
        }, t.prototype.mouse_leave = function() {
            return this.mouse_on_container = !1;
        }, t.prototype.input_focus = function(t) {
            var e = this;
            if (this.is_multiple) {
                if (!this.active_field) return setTimeout(function() {
                    return e.container_mousedown();
                }, 50);
            } else if (!this.active_field) return this.activate_field();
        }, t.prototype.input_blur = function(t) {
            var e = this;
            if (!this.mouse_on_container) return this.active_field = !1, setTimeout(function() {
                return e.blur_test();
            }, 100);
        }, t.prototype.results_option_build = function(t) {
            var e, s, i, r, n;
            for (e = "", i = 0, r = (n = this.results_data).length; i < r; i++) (s = n[i]).group ? e += this.result_add_group(s) : e += this.result_add_option(s), 
            (null != t ? t.first : void 0) && (s.selected && this.is_multiple ? this.choice_build(s) : s.selected && !this.is_multiple && this.single_set_selected_text(s.text));
            return e;
        }, t.prototype.result_add_option = function(t) {
            var e, s;
            return t.search_match && this.include_option_in_results(t) ? (e = [], t.disabled || t.selected && this.is_multiple || e.push("active-result"), 
            !t.disabled || t.selected && this.is_multiple || e.push("disabled-result"), t.selected && e.push("result-selected"), 
            null != t.group_array_index && e.push("group-option"), "" !== t.classes && e.push(t.classes), 
            s = document.createElement("li"), s.className = e.join(" "), s.style.cssText = t.style, 
            s.setAttribute("data-option-array-index", t.array_index), s.innerHTML = t.search_text, 
            this.outerHTML(s)) : "";
        }, t.prototype.result_add_group = function(t) {
            var e;
            return (t.search_match || t.group_match) && t.active_options > 0 ? (e = document.createElement("li"), 
            e.className = "group-result", e.innerHTML = t.search_text, this.outerHTML(e)) : "";
        }, t.prototype.results_update_field = function() {
            if (this.set_default_text(), this.is_multiple || this.results_reset_cleanup(), this.result_clear_highlight(), 
            this.results_build(), this.results_showing) return this.winnow_results();
        }, t.prototype.reset_single_select_options = function() {
            var t, e, s, i, r;
            for (r = [], e = 0, s = (i = this.results_data).length; e < s; e++) (t = i[e]).selected ? r.push(t.selected = !1) : r.push(void 0);
            return r;
        }, t.prototype.results_toggle = function() {
            return this.results_showing ? this.results_hide() : this.results_show();
        }, t.prototype.results_search = function(t) {
            return this.results_showing ? this.winnow_results() : this.results_show();
        }, t.prototype.winnow_results = function() {
            var t, e, s, i, r, n, o, l, h, c, a, u, _;
            for (this.no_results_clear(), r = 0, t = (o = this.get_search_text()).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 
            i = this.search_contains ? "" : "^", s = new RegExp(i + t, "i"), c = new RegExp(t, "i"), 
            a = 0, u = (_ = this.results_data).length; a < u; a++) (e = _[a]).search_match = !1, 
            n = null, this.include_option_in_results(e) && (e.group && (e.group_match = !1, 
            e.active_options = 0), null != e.group_array_index && this.results_data[e.group_array_index] && (0 === (n = this.results_data[e.group_array_index]).active_options && n.search_match && (r += 1), 
            n.active_options += 1), e.group && !this.group_search || (e.search_text = e.group ? e.label : e.html, 
            e.search_match = this.search_string_match(e.search_text, s), e.search_match && !e.group && (r += 1), 
            e.search_match ? (o.length && (l = e.search_text.search(c), h = e.search_text.substr(0, l + o.length) + "</em>" + e.search_text.substr(l + o.length), 
            e.search_text = h.substr(0, l) + "<em>" + h.substr(l)), null != n && (n.group_match = !0)) : null != e.group_array_index && this.results_data[e.group_array_index].search_match && (e.search_match = !0)));
            return this.result_clear_highlight(), r < 1 && o.length ? (this.update_results_content(""), 
            this.no_results(o)) : (this.update_results_content(this.results_option_build()), 
            this.winnow_results_set_highlight());
        }, t.prototype.search_string_match = function(t, e) {
            var s, i, r, n;
            if (e.test(t)) return !0;
            if (this.enable_split_word_search && (t.indexOf(" ") >= 0 || 0 === t.indexOf("[")) && (i = t.replace(/\[|\]/g, "").split(" ")).length) for (r = 0, 
            n = i.length; r < n; r++) if (s = i[r], e.test(s)) return !0;
        }, t.prototype.choices_count = function() {
            var t, e, s;
            if (null != this.selected_option_count) return this.selected_option_count;
            for (this.selected_option_count = 0, t = 0, e = (s = this.form_field.options).length; t < e; t++) s[t].selected && (this.selected_option_count += 1);
            return this.selected_option_count;
        }, t.prototype.choices_click = function(t) {
            if (t.preventDefault(), !this.results_showing && !this.is_disabled) return this.results_show();
        }, t.prototype.keyup_checker = function(t) {
            var e, s;
            switch (e = null != (s = t.which) ? s : t.keyCode, this.search_field_scale(), e) {
              case 8:
                if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) return this.keydown_backstroke();
                if (!this.pending_backstroke) return this.result_clear_highlight(), this.results_search();
                break;

              case 13:
                if (t.preventDefault(), this.results_showing) return this.result_select(t);
                break;

              case 27:
                return this.results_showing && this.results_hide(), !0;

              case 9:
              case 38:
              case 40:
              case 16:
              case 91:
              case 17:
                break;

              default:
                return this.results_search();
            }
        }, t.prototype.clipboard_event_checker = function(t) {
            var e = this;
            return setTimeout(function() {
                return e.results_search();
            }, 50);
        }, t.prototype.container_width = function() {
            return null != this.options.width ? this.options.width : this.form_field.offsetWidth + "px";
        }, t.prototype.include_option_in_results = function(t) {
            return !(this.is_multiple && !this.display_selected_options && t.selected) && (!(!this.display_disabled_options && t.disabled) && !t.empty);
        }, t.prototype.search_results_touchstart = function(t) {
            return this.touch_started = !0, this.search_results_mouseover(t);
        }, t.prototype.search_results_touchmove = function(t) {
            return this.touch_started = !1, this.search_results_mouseout(t);
        }, t.prototype.search_results_touchend = function(t) {
            if (this.touch_started) return this.search_results_mouseup(t);
        }, t.prototype.outerHTML = function(t) {
            var e;
            return t.outerHTML ? t.outerHTML : ((e = document.createElement("div")).appendChild(t), 
            e.innerHTML);
        }, t.browser_is_supported = function() {
            return "Microsoft Internet Explorer" === window.navigator.appName ? document.documentMode >= 8 : !/iP(od|hone)/i.test(window.navigator.userAgent) && (!/Android/i.test(window.navigator.userAgent) || !/Mobile/i.test(window.navigator.userAgent));
        }, t.default_multiple_text = "Select Some Options", t.default_single_text = "Select an Option", 
        t.default_no_result_text = "No results match", t;
    }(), (t = jQuery).fn.extend({
        "chosen": function(i) {
            return e.browser_is_supported() ? this.each(function(e) {
                var r, n;
                n = (r = t(this)).data("chosen"), "destroy" === i && n ? n.destroy() : n || r.data("chosen", new s(this, i));
            }) : this;
        }
    }), s = function(s) {
        function n() {
            return r = n.__super__.constructor.apply(this, arguments);
        }
        return o(n, e), n.prototype.setup = function() {
            return this.form_field_jq = t(this.form_field), this.current_selectedIndex = this.form_field.selectedIndex, 
            this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
        }, n.prototype.set_up_html = function() {
            var e, s;
            return (e = [ "chosen-container" ]).push("chosen-container-" + (this.is_multiple ? "multi" : "single")), 
            this.inherit_select_classes && this.form_field.className && e.push(this.form_field.className), 
            this.is_rtl && e.push("chosen-rtl"), s = {
                "class": e.join(" "),
                "style": "width: " + this.container_width() + ";",
                "title": this.form_field.title
            }, this.form_field.id.length && (s.id = this.form_field.id.replace(/[^\w]/g, "_") + "_chosen"), 
            this.container = t("<div />", s), this.is_multiple ? this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>') : this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'), 
            this.form_field_jq.hide().after(this.container), this.dropdown = this.container.find("div.chosen-drop").first(), 
            this.search_field = this.container.find("input").first(), this.search_results = this.container.find("ul.chosen-results").first(), 
            this.search_field_scale(), this.search_no_results = this.container.find("li.no-results").first(), 
            this.is_multiple ? (this.search_choices = this.container.find("ul.chosen-choices").first(), 
            this.search_container = this.container.find("li.search-field").first()) : (this.search_container = this.container.find("div.chosen-search").first(), 
            this.selected_item = this.container.find(".chosen-single").first()), this.results_build(), 
            this.set_tab_index(), this.set_label_behavior(), this.form_field_jq.trigger("chosen:ready", {
                "chosen": this
            });
        }, n.prototype.register_observers = function() {
            var t = this;
            return this.container.bind("mousedown.chosen", function(e) {
                t.container_mousedown(e);
            }), this.container.bind("mouseup.chosen", function(e) {
                t.container_mouseup(e);
            }), this.container.bind("mouseenter.chosen", function(e) {
                t.mouse_enter(e);
            }), this.container.bind("mouseleave.chosen", function(e) {
                t.mouse_leave(e);
            }), this.search_results.bind("mouseup.chosen", function(e) {
                t.search_results_mouseup(e);
            }), this.search_results.bind("mouseover.chosen", function(e) {
                t.search_results_mouseover(e);
            }), this.search_results.bind("mouseout.chosen", function(e) {
                t.search_results_mouseout(e);
            }), this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen", function(e) {
                t.search_results_mousewheel(e);
            }), this.search_results.bind("touchstart.chosen", function(e) {
                t.search_results_touchstart(e);
            }), this.search_results.bind("touchmove.chosen", function(e) {
                t.search_results_touchmove(e);
            }), this.search_results.bind("touchend.chosen", function(e) {
                t.search_results_touchend(e);
            }), this.form_field_jq.bind("chosen:updated.chosen", function(e) {
                t.results_update_field(e);
            }), this.form_field_jq.bind("chosen:activate.chosen", function(e) {
                t.activate_field(e);
            }), this.form_field_jq.bind("chosen:open.chosen", function(e) {
                t.container_mousedown(e);
            }), this.form_field_jq.bind("chosen:close.chosen", function(e) {
                t.input_blur(e);
            }), this.search_field.bind("blur.chosen", function(e) {
                t.input_blur(e);
            }), this.search_field.bind("keyup.chosen", function(e) {
                t.keyup_checker(e);
            }), this.search_field.bind("keydown.chosen", function(e) {
                t.keydown_checker(e);
            }), this.search_field.bind("focus.chosen", function(e) {
                t.input_focus(e);
            }), this.search_field.bind("cut.chosen", function(e) {
                t.clipboard_event_checker(e);
            }), this.search_field.bind("paste.chosen", function(e) {
                t.clipboard_event_checker(e);
            }), this.is_multiple ? this.search_choices.bind("click.chosen", function(e) {
                t.choices_click(e);
            }) : this.container.bind("click.chosen", function(t) {
                t.preventDefault();
            });
        }, n.prototype.destroy = function() {
            return t(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action), 
            this.search_field[0].tabIndex && (this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex), 
            this.container.remove(), this.form_field_jq.removeData("chosen"), this.form_field_jq.show();
        }, n.prototype.search_field_disabled = function() {
            return this.is_disabled = this.form_field_jq[0].disabled, this.is_disabled ? (this.container.addClass("chosen-disabled"), 
            this.search_field[0].disabled = !0, this.is_multiple || this.selected_item.unbind("focus.chosen", this.activate_action), 
            this.close_field()) : (this.container.removeClass("chosen-disabled"), this.search_field[0].disabled = !1, 
            this.is_multiple ? void 0 : this.selected_item.bind("focus.chosen", this.activate_action));
        }, n.prototype.container_mousedown = function(e) {
            if (!this.is_disabled && (e && "mousedown" === e.type && !this.results_showing && e.preventDefault(), 
            null == e || !t(e.target).hasClass("search-choice-close"))) return this.active_field ? this.is_multiple || !e || t(e.target)[0] !== this.selected_item[0] && !t(e.target).parents("a.chosen-single").length || (e.preventDefault(), 
            this.results_toggle()) : (this.is_multiple && this.search_field.val(""), t(this.container[0].ownerDocument).bind("click.chosen", this.click_test_action), 
            this.results_show()), this.activate_field();
        }, n.prototype.container_mouseup = function(t) {
            if ("ABBR" === t.target.nodeName && !this.is_disabled) return this.results_reset(t);
        }, n.prototype.search_results_mousewheel = function(t) {
            var e;
            if (t.originalEvent && (e = -t.originalEvent.wheelDelta || t.originalEvent.detail), 
            null != e) return t.preventDefault(), "DOMMouseScroll" === t.type && (e *= 40), 
            this.search_results.scrollTop(e + this.search_results.scrollTop());
        }, n.prototype.blur_test = function(t) {
            if (!this.active_field && this.container.hasClass("chosen-container-active")) return this.close_field();
        }, n.prototype.close_field = function() {
            return t(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action), 
            this.active_field = !1, this.results_hide(), this.container.removeClass("chosen-container-active"), 
            this.clear_backstroke(), this.show_search_field_default(), this.search_field_scale();
        }, n.prototype.activate_field = function() {
            return this.container.addClass("chosen-container-active"), this.active_field = !0, 
            this.search_field.val(this.search_field.val()), this.search_field.focus();
        }, n.prototype.test_active_click = function(e) {
            var s;
            return (s = t(e.target).closest(".chosen-container")).length && this.container[0] === s[0] ? this.active_field = !0 : this.close_field();
        }, n.prototype.results_build = function() {
            return this.parsing = !0, this.selected_option_count = null, this.results_data = i.select_to_array(this.form_field), 
            this.is_multiple ? this.search_choices.find("li.search-choice").remove() : this.is_multiple || (this.single_set_selected_text(), 
            this.disable_search || this.form_field.options.length <= this.disable_search_threshold ? (this.search_field[0].readOnly = !0, 
            this.container.addClass("chosen-container-single-nosearch")) : (this.search_field[0].readOnly = !1, 
            this.container.removeClass("chosen-container-single-nosearch"))), this.update_results_content(this.results_option_build({
                "first": !0
            })), this.search_field_disabled(), this.show_search_field_default(), this.search_field_scale(), 
            this.parsing = !1;
        }, n.prototype.result_do_highlight = function(t) {
            var e, s, i, r, n;
            if (t.length) {
                if (this.result_clear_highlight(), this.result_highlight = t, this.result_highlight.addClass("highlighted"), 
                i = parseInt(this.search_results.css("maxHeight"), 10), n = this.search_results.scrollTop(), 
                r = i + n, s = this.result_highlight.position().top + this.search_results.scrollTop(), 
                (e = s + this.result_highlight.outerHeight()) >= r) return this.search_results.scrollTop(e - i > 0 ? e - i : 0);
                if (s < n) return this.search_results.scrollTop(s);
            }
        }, n.prototype.result_clear_highlight = function() {
            return this.result_highlight && this.result_highlight.removeClass("highlighted"), 
            this.result_highlight = null;
        }, n.prototype.results_show = function() {
            return this.is_multiple && this.max_selected_options <= this.choices_count() ? (this.form_field_jq.trigger("chosen:maxselected", {
                "chosen": this
            }), !1) : (this.container.addClass("chosen-with-drop"), this.results_showing = !0, 
            this.search_field.focus(), this.search_field.val(this.search_field.val()), this.winnow_results(), 
            this.form_field_jq.trigger("chosen:showing_dropdown", {
                "chosen": this
            }));
        }, n.prototype.update_results_content = function(t) {
            return this.search_results.html(t);
        }, n.prototype.results_hide = function() {
            return this.results_showing && (this.result_clear_highlight(), this.container.removeClass("chosen-with-drop"), 
            this.form_field_jq.trigger("chosen:hiding_dropdown", {
                "chosen": this
            })), this.results_showing = !1;
        }, n.prototype.set_tab_index = function(t) {
            var e;
            if (this.form_field.tabIndex) return e = this.form_field.tabIndex, this.form_field.tabIndex = -1, 
            this.search_field[0].tabIndex = e;
        }, n.prototype.set_label_behavior = function() {
            var e = this;
            if (this.form_field_label = this.form_field_jq.parents("label"), !this.form_field_label.length && this.form_field.id.length && (this.form_field_label = t("label[for='" + this.form_field.id + "']")), 
            this.form_field_label.length > 0) return this.form_field_label.bind("click.chosen", function(t) {
                return e.is_multiple ? e.container_mousedown(t) : e.activate_field();
            });
        }, n.prototype.show_search_field_default = function() {
            return this.is_multiple && this.choices_count() < 1 && !this.active_field ? (this.search_field.val(this.default_text), 
            this.search_field.addClass("default")) : (this.search_field.val(""), this.search_field.removeClass("default"));
        }, n.prototype.search_results_mouseup = function(e) {
            var s;
            if ((s = t(e.target).hasClass("active-result") ? t(e.target) : t(e.target).parents(".active-result").first()).length) return this.result_highlight = s, 
            this.result_select(e), this.search_field.focus();
        }, n.prototype.search_results_mouseover = function(e) {
            var s;
            if (s = t(e.target).hasClass("active-result") ? t(e.target) : t(e.target).parents(".active-result").first()) return this.result_do_highlight(s);
        }, n.prototype.search_results_mouseout = function(e) {
            if (t(e.target).hasClass("active-result")) return this.result_clear_highlight();
        }, n.prototype.choice_build = function(e) {
            var s, i, r = this;
            return s = t("<li />", {
                "class": "search-choice"
            }).html("<span>" + e.html + "</span>"), e.disabled ? s.addClass("search-choice-disabled") : ((i = t("<a />", {
                "class": "search-choice-close",
                "data-option-array-index": e.array_index
            })).bind("click.chosen", function(t) {
                return r.choice_destroy_link_click(t);
            }), s.append(i)), this.search_container.before(s);
        }, n.prototype.choice_destroy_link_click = function(e) {
            if (e.preventDefault(), e.stopPropagation(), !this.is_disabled) return this.choice_destroy(t(e.target));
        }, n.prototype.choice_destroy = function(t) {
            if (this.result_deselect(t[0].getAttribute("data-option-array-index"))) return this.show_search_field_default(), 
            this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1 && this.results_hide(), 
            t.parents("li").first().remove(), this.search_field_scale();
        }, n.prototype.results_reset = function() {
            if (this.reset_single_select_options(), this.form_field.options[0].selected = !0, 
            this.single_set_selected_text(), this.show_search_field_default(), this.results_reset_cleanup(), 
            this.form_field_jq.trigger("change"), this.active_field) return this.results_hide();
        }, n.prototype.results_reset_cleanup = function() {
            return this.current_selectedIndex = this.form_field.selectedIndex, this.selected_item.find("abbr").remove();
        }, n.prototype.result_select = function(t) {
            var e, s;
            if (this.result_highlight) return e = this.result_highlight, this.result_clear_highlight(), 
            this.is_multiple && this.max_selected_options <= this.choices_count() ? (this.form_field_jq.trigger("chosen:maxselected", {
                "chosen": this
            }), !1) : (this.is_multiple ? e.removeClass("active-result") : this.reset_single_select_options(), 
            s = this.results_data[e[0].getAttribute("data-option-array-index")], s.selected = !0, 
            this.form_field.options[s.options_index].selected = !0, this.selected_option_count = null, 
            this.is_multiple ? this.choice_build(s) : this.single_set_selected_text(s.text), 
            (t.metaKey || t.ctrlKey) && this.is_multiple || this.results_hide(), this.search_field.val(""), 
            (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) && this.form_field_jq.trigger("change", {
                "selected": this.form_field.options[s.options_index].value
            }), this.current_selectedIndex = this.form_field.selectedIndex, this.search_field_scale());
        }, n.prototype.single_set_selected_text = function(t) {
            return null == t && (t = this.default_text), t === this.default_text ? this.selected_item.addClass("chosen-default") : (this.single_deselect_control_build(), 
            this.selected_item.removeClass("chosen-default")), this.selected_item.find("span").text(t);
        }, n.prototype.result_deselect = function(t) {
            var e;
            return e = this.results_data[t], !this.form_field.options[e.options_index].disabled && (e.selected = !1, 
            this.form_field.options[e.options_index].selected = !1, this.selected_option_count = null, 
            this.result_clear_highlight(), this.results_showing && this.winnow_results(), this.form_field_jq.trigger("change", {
                "deselected": this.form_field.options[e.options_index].value
            }), this.search_field_scale(), !0);
        }, n.prototype.single_deselect_control_build = function() {
            if (this.allow_single_deselect) return this.selected_item.find("abbr").length || this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'), 
            this.selected_item.addClass("chosen-single-with-deselect");
        }, n.prototype.get_search_text = function() {
            return this.search_field.val() === this.default_text ? "" : t("<div/>").text(t.trim(this.search_field.val())).html();
        }, n.prototype.winnow_results_set_highlight = function() {
            var t, e;
            if (e = this.is_multiple ? [] : this.search_results.find(".result-selected.active-result"), 
            null != (t = e.length ? e.first() : this.search_results.find(".active-result").first())) return this.result_do_highlight(t);
        }, n.prototype.no_results = function(e) {
            var s;
            return (s = t('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>')).find("span").first().html(e), 
            this.search_results.append(s), this.form_field_jq.trigger("chosen:no_results", {
                "chosen": this
            });
        }, n.prototype.no_results_clear = function() {
            return this.search_results.find(".no-results").remove();
        }, n.prototype.keydown_arrow = function() {
            var t;
            return this.results_showing && this.result_highlight ? (t = this.result_highlight.nextAll("li.active-result").first()) ? this.result_do_highlight(t) : void 0 : this.results_show();
        }, n.prototype.keyup_arrow = function() {
            var t;
            return this.results_showing || this.is_multiple ? this.result_highlight ? (t = this.result_highlight.prevAll("li.active-result")).length ? this.result_do_highlight(t.first()) : (this.choices_count() > 0 && this.results_hide(), 
            this.result_clear_highlight()) : void 0 : this.results_show();
        }, n.prototype.keydown_backstroke = function() {
            var t;
            return this.pending_backstroke ? (this.choice_destroy(this.pending_backstroke.find("a").first()), 
            this.clear_backstroke()) : (t = this.search_container.siblings("li.search-choice").last()).length && !t.hasClass("search-choice-disabled") ? (this.pending_backstroke = t, 
            this.single_backstroke_delete ? this.keydown_backstroke() : this.pending_backstroke.addClass("search-choice-focus")) : void 0;
        }, n.prototype.clear_backstroke = function() {
            return this.pending_backstroke && this.pending_backstroke.removeClass("search-choice-focus"), 
            this.pending_backstroke = null;
        }, n.prototype.keydown_checker = function(t) {
            var e, s;
            switch (e = null != (s = t.which) ? s : t.keyCode, this.search_field_scale(), 8 !== e && this.pending_backstroke && this.clear_backstroke(), 
            e) {
              case 8:
                this.backstroke_length = this.search_field.val().length;
                break;

              case 9:
                this.results_showing && !this.is_multiple && this.result_select(t), this.mouse_on_container = !1;
                break;

              case 13:
                t.preventDefault();
                break;

              case 38:
                t.preventDefault(), this.keyup_arrow();
                break;

              case 40:
                t.preventDefault(), this.keydown_arrow();
            }
        }, n.prototype.search_field_scale = function() {
            var e, s, i, r, n, o, l, h;
            if (this.is_multiple) {
                for (0, o = 0, r = "position:absolute; left: -1000px; top: -1000px; display:none;", 
                l = 0, h = (n = [ "font-size", "font-style", "font-weight", "font-family", "line-height", "text-transform", "letter-spacing" ]).length; l < h; l++) r += (i = n[l]) + ":" + this.search_field.css(i) + ";";
                return (e = t("<div />", {
                    "style": r
                })).text(this.search_field.val()), t("body").append(e), o = e.width() + 25, e.remove(), 
                s = this.container.outerWidth(), o > s - 10 && (o = s - 10), this.search_field.css({
                    "width": o + "px"
                });
            }
        }, n;
    }();
}.call(this), jQuery(function(t) {
    t(".chosen").chosen(), CKEDITOR.replace("narrative", {
        "allowedContent": !0
    });
}), jQuery(function(t) {
    var e = t('input[name="title"]'), s = t('input[name="slug"]'), i = !1;
    s.change(function() {
        i = !0;
    }), e.keyup(function() {
        i || s.val(_.string.slugify(e.val()));
    });
});