!function(e, t) {
    "use strict";
    "object" == typeof exports ? module.exports = t(require("./punycode"), require("./IPv6"), require("./SecondLevelDomains")) : "function" == typeof define && define.amd ? define([ "./punycode", "./IPv6", "./SecondLevelDomains" ], t) : e.URI = t(e.punycode, e.IPv6, e.SecondLevelDomains, e);
}(this, function(e, t, n, r) {
    "use strict";
    function i(e, t) {
        return this instanceof i ? (void 0 === e && (e = "undefined" != typeof location ? location.href + "" : ""), 
        this.href(e), void 0 !== t ? this.absoluteTo(t) : this) : new i(e, t);
    }
    function o(e) {
        return e.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
    }
    function s(e) {
        return void 0 === e ? "Undefined" : String(Object.prototype.toString.call(e)).slice(8, -1);
    }
    function a(e) {
        return "Array" === s(e);
    }
    function u(e, t) {
        var n, r, i = {};
        if (a(t)) for (n = 0, r = t.length; n < r; n++) i[t[n]] = !0; else i[t] = !0;
        for (n = 0, r = e.length; n < r; n++) void 0 !== i[e[n]] && (e.splice(n, 1), r--, 
        n--);
        return e;
    }
    function c(e, t) {
        var n, r;
        if (a(t)) {
            for (n = 0, r = t.length; n < r; n++) if (!c(e, t[n])) return !1;
            return !0;
        }
        var i = s(t);
        for (n = 0, r = e.length; n < r; n++) if ("RegExp" === i) {
            if ("string" == typeof e[n] && e[n].match(t)) return !0;
        } else if (e[n] === t) return !0;
        return !1;
    }
    function l(e, t) {
        if (!a(e) || !a(t)) return !1;
        if (e.length !== t.length) return !1;
        e.sort(), t.sort();
        for (var n = 0, r = e.length; n < r; n++) if (e[n] !== t[n]) return !1;
        return !0;
    }
    function p(e) {
        return escape(e);
    }
    function f(e) {
        return encodeURIComponent(e).replace(/[!'()*]/g, p).replace(/\*/g, "%2A");
    }
    var h = r && r.URI;
    i.version = "1.13.2";
    var d = i.prototype, m = Object.prototype.hasOwnProperty;
    i._parts = function() {
        return {
            "protocol": null,
            "username": null,
            "password": null,
            "hostname": null,
            "urn": null,
            "port": null,
            "path": null,
            "query": null,
            "fragment": null,
            "duplicateQueryParameters": i.duplicateQueryParameters,
            "escapeQuerySpace": i.escapeQuerySpace
        };
    }, i.duplicateQueryParameters = !1, i.escapeQuerySpace = !0, i.protocol_expression = /^[a-z][a-z0-9.+-]*$/i, 
    i.idn_expression = /[^a-z0-9\.-]/i, i.punycode_expression = /(xn--)/i, i.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, 
    i.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/, 
    i.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi, 
    i.findUri = {
        "start": /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
        "end": /[\s\r\n]|$/,
        "trim": /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/
    }, i.defaultPorts = {
        "http": "80",
        "https": "443",
        "ftp": "21",
        "gopher": "70",
        "ws": "80",
        "wss": "443"
    }, i.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/, i.domAttributes = {
        "a": "href",
        "blockquote": "cite",
        "link": "href",
        "base": "href",
        "script": "src",
        "form": "action",
        "img": "src",
        "area": "href",
        "iframe": "src",
        "embed": "src",
        "source": "src",
        "track": "src",
        "input": "src"
    }, i.getDomAttribute = function(e) {
        if (e && e.nodeName) {
            var t = e.nodeName.toLowerCase();
            if ("input" !== t || "image" === e.type) return i.domAttributes[t];
        }
    }, i.encode = f, i.decode = decodeURIComponent, i.iso8859 = function() {
        i.encode = escape, i.decode = unescape;
    }, i.unicode = function() {
        i.encode = f, i.decode = decodeURIComponent;
    }, i.characters = {
        "pathname": {
            "encode": {
                "expression": /%(24|26|2B|2C|3B|3D|3A|40)/gi,
                "map": {
                    "%24": "$",
                    "%26": "&",
                    "%2B": "+",
                    "%2C": ",",
                    "%3B": ";",
                    "%3D": "=",
                    "%3A": ":",
                    "%40": "@"
                }
            },
            "decode": {
                "expression": /[\/\?#]/g,
                "map": {
                    "/": "%2F",
                    "?": "%3F",
                    "#": "%23"
                }
            }
        },
        "reserved": {
            "encode": {
                "expression": /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/gi,
                "map": {
                    "%3A": ":",
                    "%2F": "/",
                    "%3F": "?",
                    "%23": "#",
                    "%5B": "[",
                    "%5D": "]",
                    "%40": "@",
                    "%21": "!",
                    "%24": "$",
                    "%26": "&",
                    "%27": "'",
                    "%28": "(",
                    "%29": ")",
                    "%2A": "*",
                    "%2B": "+",
                    "%2C": ",",
                    "%3B": ";",
                    "%3D": "="
                }
            }
        }
    }, i.encodeQuery = function(e, t) {
        var n = i.encode(e + "");
        return void 0 === t && (t = i.escapeQuerySpace), t ? n.replace(/%20/g, "+") : n;
    }, i.decodeQuery = function(e, t) {
        e += "", void 0 === t && (t = i.escapeQuerySpace);
        try {
            return i.decode(t ? e.replace(/\+/g, "%20") : e);
        } catch (t) {
            return e;
        }
    }, i.recodePath = function(e) {
        for (var t = (e + "").split("/"), n = 0, r = t.length; n < r; n++) t[n] = i.encodePathSegment(i.decode(t[n]));
        return t.join("/");
    }, i.decodePath = function(e) {
        for (var t = (e + "").split("/"), n = 0, r = t.length; n < r; n++) t[n] = i.decodePathSegment(t[n]);
        return t.join("/");
    };
    var y, g = {
        "encode": "encode",
        "decode": "decode"
    }, v = function(e, t) {
        return function(n) {
            return i[t](n + "").replace(i.characters[e][t].expression, function(n) {
                return i.characters[e][t].map[n];
            });
        };
    };
    for (y in g) i[y + "PathSegment"] = v("pathname", g[y]);
    i.encodeReserved = v("reserved", "encode"), i.parse = function(e, t) {
        var n;
        return t || (t = {}), (n = e.indexOf("#")) > -1 && (t.fragment = e.substring(n + 1) || null, 
        e = e.substring(0, n)), (n = e.indexOf("?")) > -1 && (t.query = e.substring(n + 1) || null, 
        e = e.substring(0, n)), "//" === e.substring(0, 2) ? (t.protocol = null, e = e.substring(2), 
        e = i.parseAuthority(e, t)) : (n = e.indexOf(":")) > -1 && (t.protocol = e.substring(0, n) || null, 
        t.protocol && !t.protocol.match(i.protocol_expression) ? t.protocol = void 0 : "file" === t.protocol ? e = e.substring(n + 3) : "//" === e.substring(n + 1, n + 3) ? (e = e.substring(n + 3), 
        e = i.parseAuthority(e, t)) : (e = e.substring(n + 1), t.urn = !0)), t.path = e, 
        t;
    }, i.parseHost = function(e, t) {
        var n, r, i = e.indexOf("/");
        return -1 === i && (i = e.length), "[" === e.charAt(0) ? (n = e.indexOf("]"), t.hostname = e.substring(1, n) || null, 
        t.port = e.substring(n + 2, i) || null, "/" === t.port && (t.port = null)) : e.indexOf(":") !== e.lastIndexOf(":") ? (t.hostname = e.substring(0, i) || null, 
        t.port = null) : (r = e.substring(0, i).split(":"), t.hostname = r[0] || null, t.port = r[1] || null), 
        t.hostname && "/" !== e.substring(i).charAt(0) && (i++, e = "/" + e), e.substring(i) || "/";
    }, i.parseAuthority = function(e, t) {
        return e = i.parseUserinfo(e, t), i.parseHost(e, t);
    }, i.parseUserinfo = function(e, t) {
        var n, r = e.indexOf("/"), o = r > -1 ? e.lastIndexOf("@", r) : e.indexOf("@");
        return o > -1 && (-1 === r || o < r) ? (n = e.substring(0, o).split(":"), t.username = n[0] ? i.decode(n[0]) : null, 
        n.shift(), t.password = n[0] ? i.decode(n.join(":")) : null, e = e.substring(o + 1)) : (t.username = null, 
        t.password = null), e;
    }, i.parseQuery = function(e, t) {
        if (!e) return {};
        if (!(e = e.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, ""))) return {};
        for (var n, r, o, s = {}, a = e.split("&"), u = a.length, c = 0; c < u; c++) n = a[c].split("="), 
        r = i.decodeQuery(n.shift(), t), o = n.length ? i.decodeQuery(n.join("="), t) : null, 
        s[r] ? ("string" == typeof s[r] && (s[r] = [ s[r] ]), s[r].push(o)) : s[r] = o;
        return s;
    }, i.build = function(e) {
        var t = "";
        return e.protocol && (t += e.protocol + ":"), e.urn || !t && !e.hostname || (t += "//"), 
        t += i.buildAuthority(e) || "", "string" == typeof e.path && ("/" !== e.path.charAt(0) && "string" == typeof e.hostname && (t += "/"), 
        t += e.path), "string" == typeof e.query && e.query && (t += "?" + e.query), "string" == typeof e.fragment && e.fragment && (t += "#" + e.fragment), 
        t;
    }, i.buildHost = function(e) {
        var t = "";
        return e.hostname ? (i.ip6_expression.test(e.hostname) ? t += "[" + e.hostname + "]" : t += e.hostname, 
        e.port && (t += ":" + e.port), t) : "";
    }, i.buildAuthority = function(e) {
        return i.buildUserinfo(e) + i.buildHost(e);
    }, i.buildUserinfo = function(e) {
        var t = "";
        return e.username && (t += i.encode(e.username), e.password && (t += ":" + i.encode(e.password)), 
        t += "@"), t;
    }, i.buildQuery = function(e, t, n) {
        var r, o, s, u, c = "";
        for (o in e) if (m.call(e, o) && o) if (a(e[o])) for (r = {}, s = 0, u = e[o].length; s < u; s++) void 0 !== e[o][s] && void 0 === r[e[o][s] + ""] && (c += "&" + i.buildQueryParameter(o, e[o][s], n), 
        !0 !== t && (r[e[o][s] + ""] = !0)); else void 0 !== e[o] && (c += "&" + i.buildQueryParameter(o, e[o], n));
        return c.substring(1);
    }, i.buildQueryParameter = function(e, t, n) {
        return i.encodeQuery(e, n) + (null !== t ? "=" + i.encodeQuery(t, n) : "");
    }, i.addQuery = function(e, t, n) {
        if ("object" == typeof t) for (var r in t) m.call(t, r) && i.addQuery(e, r, t[r]); else {
            if ("string" != typeof t) throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
            if (void 0 === e[t]) return void (e[t] = n);
            "string" == typeof e[t] && (e[t] = [ e[t] ]), a(n) || (n = [ n ]), e[t] = e[t].concat(n);
        }
    }, i.removeQuery = function(e, t, n) {
        var r, o, s;
        if (a(t)) for (r = 0, o = t.length; r < o; r++) e[t[r]] = void 0; else if ("object" == typeof t) for (s in t) m.call(t, s) && i.removeQuery(e, s, t[s]); else {
            if ("string" != typeof t) throw new TypeError("URI.addQuery() accepts an object, string as the first parameter");
            void 0 !== n ? e[t] === n ? e[t] = void 0 : a(e[t]) && (e[t] = u(e[t], n)) : e[t] = void 0;
        }
    }, i.hasQuery = function(e, t, n, r) {
        if ("object" == typeof t) {
            for (var o in t) if (m.call(t, o) && !i.hasQuery(e, o, t[o])) return !1;
            return !0;
        }
        if ("string" != typeof t) throw new TypeError("URI.hasQuery() accepts an object, string as the name parameter");
        switch (s(n)) {
          case "Undefined":
            return t in e;

          case "Boolean":
            return n === Boolean(a(e[t]) ? e[t].length : e[t]);

          case "Function":
            return !!n(e[t], t, e);

          case "Array":
            return !!a(e[t]) && (r ? c : l)(e[t], n);

          case "RegExp":
            return a(e[t]) ? !!r && c(e[t], n) : Boolean(e[t] && e[t].match(n));

          case "Number":
            n = String(n);

          case "String":
            return a(e[t]) ? !!r && c(e[t], n) : e[t] === n;

          default:
            throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
        }
    }, i.commonPath = function(e, t) {
        var n, r = Math.min(e.length, t.length);
        for (n = 0; n < r; n++) if (e.charAt(n) !== t.charAt(n)) {
            n--;
            break;
        }
        return n < 1 ? e.charAt(0) === t.charAt(0) && "/" === e.charAt(0) ? "/" : "" : ("/" === e.charAt(n) && "/" === t.charAt(n) || (n = e.substring(0, n).lastIndexOf("/")), 
        e.substring(0, n + 1));
    }, i.withinString = function(e, t, n) {
        n || (n = {});
        var r = n.start || i.findUri.start, o = n.end || i.findUri.end, s = n.trim || i.findUri.trim, a = /[a-z0-9-]=["']?$/i;
        for (r.lastIndex = 0; ;) {
            var u = r.exec(e);
            if (!u) break;
            var c = u.index;
            if (n.ignoreHtml) {
                var l = e.slice(Math.max(c - 3, 0), c);
                if (l && a.test(l)) continue;
            }
            var p = c + e.slice(c).search(o), f = e.slice(c, p).replace(s, "");
            if (!n.ignore || !n.ignore.test(f)) {
                var h = t(f, c, p = c + f.length, e);
                e = e.slice(0, c) + h + e.slice(p), r.lastIndex = c + h.length;
            }
        }
        return r.lastIndex = 0, e;
    }, i.ensureValidHostname = function(t) {
        if (t.match(i.invalid_hostname_characters)) {
            if (!e) throw new TypeError('Hostname "' + t + '" contains characters other than [A-Z0-9.-] and Punycode.js is not available');
            if (e.toASCII(t).match(i.invalid_hostname_characters)) throw new TypeError('Hostname "' + t + '" contains characters other than [A-Z0-9.-]');
        }
    }, i.noConflict = function(e) {
        if (e) {
            var t = {
                "URI": this.noConflict()
            };
            return r.URITemplate && "function" == typeof r.URITemplate.noConflict && (t.URITemplate = r.URITemplate.noConflict()), 
            r.IPv6 && "function" == typeof r.IPv6.noConflict && (t.IPv6 = r.IPv6.noConflict()), 
            r.SecondLevelDomains && "function" == typeof r.SecondLevelDomains.noConflict && (t.SecondLevelDomains = r.SecondLevelDomains.noConflict()), 
            t;
        }
        return r.URI === this && (r.URI = h), this;
    }, d.build = function(e) {
        return !0 === e ? this._deferred_build = !0 : (void 0 === e || this._deferred_build) && (this._string = i.build(this._parts), 
        this._deferred_build = !1), this;
    }, d.clone = function() {
        return new i(this);
    }, d.valueOf = d.toString = function() {
        return this.build(!1)._string;
    }, g = {
        "protocol": "protocol",
        "username": "username",
        "password": "password",
        "hostname": "hostname",
        "port": "port"
    }, v = function(e) {
        return function(t, n) {
            return void 0 === t ? this._parts[e] || "" : (this._parts[e] = t || null, this.build(!n), 
            this);
        };
    };
    for (y in g) d[y] = v(g[y]);
    g = {
        "query": "?",
        "fragment": "#"
    }, v = function(e, t) {
        return function(n, r) {
            return void 0 === n ? this._parts[e] || "" : (null !== n && (n += "").charAt(0) === t && (n = n.substring(1)), 
            this._parts[e] = n, this.build(!r), this);
        };
    };
    for (y in g) d[y] = v(y, g[y]);
    g = {
        "search": [ "?", "query" ],
        "hash": [ "#", "fragment" ]
    }, v = function(e, t) {
        return function(n, r) {
            var i = this[e](n, r);
            return "string" == typeof i && i.length ? t + i : i;
        };
    };
    for (y in g) d[y] = v(g[y][1], g[y][0]);
    d.pathname = function(e, t) {
        if (void 0 === e || !0 === e) {
            var n = this._parts.path || (this._parts.hostname ? "/" : "");
            return e ? i.decodePath(n) : n;
        }
        return this._parts.path = e ? i.recodePath(e) : "/", this.build(!t), this;
    }, d.path = d.pathname, d.href = function(e, t) {
        var n;
        if (void 0 === e) return this.toString();
        this._string = "", this._parts = i._parts();
        var r = e instanceof i, o = "object" == typeof e && (e.hostname || e.path || e.pathname);
        if (e.nodeName && (e = e[i.getDomAttribute(e)] || "", o = !1), !r && o && void 0 !== e.pathname && (e = e.toString()), 
        "string" == typeof e) this._parts = i.parse(e, this._parts); else {
            if (!r && !o) throw new TypeError("invalid input");
            var s = r ? e._parts : e;
            for (n in s) m.call(this._parts, n) && (this._parts[n] = s[n]);
        }
        return this.build(!t), this;
    }, d.is = function(e) {
        var t = !1, r = !1, o = !1, s = !1, a = !1, u = !1, c = !1, l = !this._parts.urn;
        switch (this._parts.hostname && (l = !1, r = i.ip4_expression.test(this._parts.hostname), 
        o = i.ip6_expression.test(this._parts.hostname), a = (s = !(t = r || o)) && n && n.has(this._parts.hostname), 
        u = s && i.idn_expression.test(this._parts.hostname), c = s && i.punycode_expression.test(this._parts.hostname)), 
        e.toLowerCase()) {
          case "relative":
            return l;

          case "absolute":
            return !l;

          case "domain":
          case "name":
            return s;

          case "sld":
            return a;

          case "ip":
            return t;

          case "ip4":
          case "ipv4":
          case "inet4":
            return r;

          case "ip6":
          case "ipv6":
          case "inet6":
            return o;

          case "idn":
            return u;

          case "url":
            return !this._parts.urn;

          case "urn":
            return !!this._parts.urn;

          case "punycode":
            return c;
        }
        return null;
    };
    var x = d.protocol, b = d.port, w = d.hostname;
    d.protocol = function(e, t) {
        if (void 0 !== e && e && !(e = e.replace(/:(\/\/)?$/, "")).match(i.protocol_expression)) throw new TypeError('Protocol "' + e + "\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");
        return x.call(this, e, t);
    }, d.scheme = d.protocol, d.port = function(e, t) {
        if (this._parts.urn) return void 0 === e ? "" : this;
        if (void 0 !== e && (0 === e && (e = null), e && (":" === (e += "").charAt(0) && (e = e.substring(1)), 
        e.match(/[^0-9]/)))) throw new TypeError('Port "' + e + '" contains characters other than [0-9]');
        return b.call(this, e, t);
    }, d.hostname = function(e, t) {
        if (this._parts.urn) return void 0 === e ? "" : this;
        if (void 0 !== e) {
            var n = {};
            i.parseHost(e, n), e = n.hostname;
        }
        return w.call(this, e, t);
    }, d.host = function(e, t) {
        return this._parts.urn ? void 0 === e ? "" : this : void 0 === e ? this._parts.hostname ? i.buildHost(this._parts) : "" : (i.parseHost(e, this._parts), 
        this.build(!t), this);
    }, d.authority = function(e, t) {
        return this._parts.urn ? void 0 === e ? "" : this : void 0 === e ? this._parts.hostname ? i.buildAuthority(this._parts) : "" : (i.parseAuthority(e, this._parts), 
        this.build(!t), this);
    }, d.userinfo = function(e, t) {
        if (this._parts.urn) return void 0 === e ? "" : this;
        if (void 0 === e) {
            if (!this._parts.username) return "";
            var n = i.buildUserinfo(this._parts);
            return n.substring(0, n.length - 1);
        }
        return "@" !== e[e.length - 1] && (e += "@"), i.parseUserinfo(e, this._parts), this.build(!t), 
        this;
    }, d.resource = function(e, t) {
        var n;
        return void 0 === e ? this.path() + this.search() + this.hash() : (n = i.parse(e), 
        this._parts.path = n.path, this._parts.query = n.query, this._parts.fragment = n.fragment, 
        this.build(!t), this);
    }, d.subdomain = function(e, t) {
        if (this._parts.urn) return void 0 === e ? "" : this;
        if (void 0 === e) {
            if (!this._parts.hostname || this.is("IP")) return "";
            var n = this._parts.hostname.length - this.domain().length - 1;
            return this._parts.hostname.substring(0, n) || "";
        }
        var r = this._parts.hostname.length - this.domain().length, s = this._parts.hostname.substring(0, r), a = new RegExp("^" + o(s));
        return e && "." !== e.charAt(e.length - 1) && (e += "."), e && i.ensureValidHostname(e), 
        this._parts.hostname = this._parts.hostname.replace(a, e), this.build(!t), this;
    }, d.domain = function(e, t) {
        if (this._parts.urn) return void 0 === e ? "" : this;
        if ("boolean" == typeof e && (t = e, e = void 0), void 0 === e) {
            if (!this._parts.hostname || this.is("IP")) return "";
            var n = this._parts.hostname.match(/\./g);
            if (n && n.length < 2) return this._parts.hostname;
            var r = this._parts.hostname.length - this.tld(t).length - 1;
            return r = this._parts.hostname.lastIndexOf(".", r - 1) + 1, this._parts.hostname.substring(r) || "";
        }
        if (!e) throw new TypeError("cannot set domain empty");
        if (i.ensureValidHostname(e), !this._parts.hostname || this.is("IP")) this._parts.hostname = e; else {
            var s = new RegExp(o(this.domain()) + "$");
            this._parts.hostname = this._parts.hostname.replace(s, e);
        }
        return this.build(!t), this;
    }, d.tld = function(e, t) {
        if (this._parts.urn) return void 0 === e ? "" : this;
        if ("boolean" == typeof e && (t = e, e = void 0), void 0 === e) {
            if (!this._parts.hostname || this.is("IP")) return "";
            var r = this._parts.hostname.lastIndexOf("."), i = this._parts.hostname.substring(r + 1);
            return !0 !== t && n && n.list[i.toLowerCase()] ? n.get(this._parts.hostname) || i : i;
        }
        var s;
        if (!e) throw new TypeError("cannot set TLD empty");
        if (e.match(/[^a-zA-Z0-9-]/)) {
            if (!n || !n.is(e)) throw new TypeError('TLD "' + e + '" contains characters other than [A-Z0-9]');
            s = new RegExp(o(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(s, e);
        } else {
            if (!this._parts.hostname || this.is("IP")) throw new ReferenceError("cannot set TLD on non-domain host");
            s = new RegExp(o(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(s, e);
        }
        return this.build(!t), this;
    }, d.directory = function(e, t) {
        if (this._parts.urn) return void 0 === e ? "" : this;
        if (void 0 === e || !0 === e) {
            if (!this._parts.path && !this._parts.hostname) return "";
            if ("/" === this._parts.path) return "/";
            var n = this._parts.path.length - this.filename().length - 1, r = this._parts.path.substring(0, n) || (this._parts.hostname ? "/" : "");
            return e ? i.decodePath(r) : r;
        }
        var s = this._parts.path.length - this.filename().length, a = this._parts.path.substring(0, s), u = new RegExp("^" + o(a));
        return this.is("relative") || (e || (e = "/"), "/" !== e.charAt(0) && (e = "/" + e)), 
        e && "/" !== e.charAt(e.length - 1) && (e += "/"), e = i.recodePath(e), this._parts.path = this._parts.path.replace(u, e), 
        this.build(!t), this;
    }, d.filename = function(e, t) {
        if (this._parts.urn) return void 0 === e ? "" : this;
        if (void 0 === e || !0 === e) {
            if (!this._parts.path || "/" === this._parts.path) return "";
            var n = this._parts.path.lastIndexOf("/"), r = this._parts.path.substring(n + 1);
            return e ? i.decodePathSegment(r) : r;
        }
        var s = !1;
        "/" === e.charAt(0) && (e = e.substring(1)), e.match(/\.?\//) && (s = !0);
        var a = new RegExp(o(this.filename()) + "$");
        return e = i.recodePath(e), this._parts.path = this._parts.path.replace(a, e), s ? this.normalizePath(t) : this.build(!t), 
        this;
    }, d.suffix = function(e, t) {
        if (this._parts.urn) return void 0 === e ? "" : this;
        if (void 0 === e || !0 === e) {
            if (!this._parts.path || "/" === this._parts.path) return "";
            var n, r, s = this.filename(), a = s.lastIndexOf(".");
            return -1 === a ? "" : (n = s.substring(a + 1), r = /^[a-z0-9%]+$/i.test(n) ? n : "", 
            e ? i.decodePathSegment(r) : r);
        }
        "." === e.charAt(0) && (e = e.substring(1));
        var u, c = this.suffix();
        if (c) u = e ? new RegExp(o(c) + "$") : new RegExp(o("." + c) + "$"); else {
            if (!e) return this;
            this._parts.path += "." + i.recodePath(e);
        }
        return u && (e = i.recodePath(e), this._parts.path = this._parts.path.replace(u, e)), 
        this.build(!t), this;
    }, d.segment = function(e, t, n) {
        var r = this._parts.urn ? ":" : "/", i = this.path(), o = "/" === i.substring(0, 1), s = i.split(r);
        if (void 0 !== e && "number" != typeof e && (n = t, t = e, e = void 0), void 0 !== e && "number" != typeof e) throw new Error('Bad segment "' + e + '", must be 0-based integer');
        if (o && s.shift(), e < 0 && (e = Math.max(s.length + e, 0)), void 0 === t) return void 0 === e ? s : s[e];
        if (null === e || void 0 === s[e]) if (a(t)) {
            s = [];
            for (var u = 0, c = t.length; u < c; u++) (t[u].length || s.length && s[s.length - 1].length) && (s.length && !s[s.length - 1].length && s.pop(), 
            s.push(t[u]));
        } else (t || "string" == typeof t) && ("" === s[s.length - 1] ? s[s.length - 1] = t : s.push(t)); else t || "string" == typeof t && t.length ? s[e] = t : s.splice(e, 1);
        return o && s.unshift(""), this.path(s.join(r), n);
    }, d.segmentCoded = function(e, t, n) {
        var r, o, s;
        if ("number" != typeof e && (n = t, t = e, e = void 0), void 0 === t) {
            if (r = this.segment(e, t, n), a(r)) for (o = 0, s = r.length; o < s; o++) r[o] = i.decode(r[o]); else r = void 0 !== r ? i.decode(r) : void 0;
            return r;
        }
        if (a(t)) for (o = 0, s = t.length; o < s; o++) t[o] = i.decode(t[o]); else t = "string" == typeof t ? i.encode(t) : t;
        return this.segment(e, t, n);
    };
    var E = d.query;
    return d.query = function(e, t) {
        if (!0 === e) return i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        if ("function" == typeof e) {
            var n = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace), r = e.call(this, n);
            return this._parts.query = i.buildQuery(r || n, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), 
            this.build(!t), this;
        }
        return void 0 !== e && "string" != typeof e ? (this._parts.query = i.buildQuery(e, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), 
        this.build(!t), this) : E.call(this, e, t);
    }, d.setQuery = function(e, t, n) {
        var r = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        if ("object" == typeof e) for (var o in e) m.call(e, o) && (r[o] = e[o]); else {
            if ("string" != typeof e) throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
            r[e] = void 0 !== t ? t : null;
        }
        return this._parts.query = i.buildQuery(r, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), 
        "string" != typeof e && (n = t), this.build(!n), this;
    }, d.addQuery = function(e, t, n) {
        var r = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        return i.addQuery(r, e, void 0 === t ? null : t), this._parts.query = i.buildQuery(r, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), 
        "string" != typeof e && (n = t), this.build(!n), this;
    }, d.removeQuery = function(e, t, n) {
        var r = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        return i.removeQuery(r, e, t), this._parts.query = i.buildQuery(r, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), 
        "string" != typeof e && (n = t), this.build(!n), this;
    }, d.hasQuery = function(e, t, n) {
        var r = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        return i.hasQuery(r, e, t, n);
    }, d.setSearch = d.setQuery, d.addSearch = d.addQuery, d.removeSearch = d.removeQuery, 
    d.hasSearch = d.hasQuery, d.normalize = function() {
        return this._parts.urn ? this.normalizeProtocol(!1).normalizeQuery(!1).normalizeFragment(!1).build() : this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build();
    }, d.normalizeProtocol = function(e) {
        return "string" == typeof this._parts.protocol && (this._parts.protocol = this._parts.protocol.toLowerCase(), 
        this.build(!e)), this;
    }, d.normalizeHostname = function(n) {
        return this._parts.hostname && (this.is("IDN") && e ? this._parts.hostname = e.toASCII(this._parts.hostname) : this.is("IPv6") && t && (this._parts.hostname = t.best(this._parts.hostname)), 
        this._parts.hostname = this._parts.hostname.toLowerCase(), this.build(!n)), this;
    }, d.normalizePort = function(e) {
        return "string" == typeof this._parts.protocol && this._parts.port === i.defaultPorts[this._parts.protocol] && (this._parts.port = null, 
        this.build(!e)), this;
    }, d.normalizePath = function(e) {
        if (this._parts.urn) return this;
        if (!this._parts.path || "/" === this._parts.path) return this;
        var t, n, r, o = this._parts.path, s = "";
        for ("/" !== o.charAt(0) && (t = !0, o = "/" + o), o = o.replace(/(\/(\.\/)+)|(\/\.$)/g, "/").replace(/\/{2,}/g, "/"), 
        t && (s = o.substring(1).match(/^(\.\.\/)+/) || "") && (s = s[0]); ;) {
            if (-1 === (n = o.indexOf("/.."))) break;
            0 !== n ? (-1 === (r = o.substring(0, n).lastIndexOf("/")) && (r = n), o = o.substring(0, r) + o.substring(n + 3)) : o = o.substring(3);
        }
        return t && this.is("relative") && (o = s + o.substring(1)), o = i.recodePath(o), 
        this._parts.path = o, this.build(!e), this;
    }, d.normalizePathname = d.normalizePath, d.normalizeQuery = function(e) {
        return "string" == typeof this._parts.query && (this._parts.query.length ? this.query(i.parseQuery(this._parts.query, this._parts.escapeQuerySpace)) : this._parts.query = null, 
        this.build(!e)), this;
    }, d.normalizeFragment = function(e) {
        return this._parts.fragment || (this._parts.fragment = null, this.build(!e)), this;
    }, d.normalizeSearch = d.normalizeQuery, d.normalizeHash = d.normalizeFragment, 
    d.iso8859 = function() {
        var e = i.encode, t = i.decode;
        return i.encode = escape, i.decode = decodeURIComponent, this.normalize(), i.encode = e, 
        i.decode = t, this;
    }, d.unicode = function() {
        var e = i.encode, t = i.decode;
        return i.encode = f, i.decode = unescape, this.normalize(), i.encode = e, i.decode = t, 
        this;
    }, d.readable = function() {
        var t = this.clone();
        t.username("").password("").normalize();
        var n = "";
        if (t._parts.protocol && (n += t._parts.protocol + "://"), t._parts.hostname && (t.is("punycode") && e ? (n += e.toUnicode(t._parts.hostname), 
        t._parts.port && (n += ":" + t._parts.port)) : n += t.host()), t._parts.hostname && t._parts.path && "/" !== t._parts.path.charAt(0) && (n += "/"), 
        n += t.path(!0), t._parts.query) {
            for (var r = "", o = 0, s = t._parts.query.split("&"), a = s.length; o < a; o++) {
                var u = (s[o] || "").split("=");
                r += "&" + i.decodeQuery(u[0], this._parts.escapeQuerySpace).replace(/&/g, "%26"), 
                void 0 !== u[1] && (r += "=" + i.decodeQuery(u[1], this._parts.escapeQuerySpace).replace(/&/g, "%26"));
            }
            n += "?" + r.substring(1);
        }
        return n += i.decodeQuery(t.hash(), !0);
    }, d.absoluteTo = function(e) {
        var t, n, r, o = this.clone(), s = [ "protocol", "username", "password", "hostname", "port" ];
        if (this._parts.urn) throw new Error("URNs do not have any generally defined hierarchical components");
        if (e instanceof i || (e = new i(e)), o._parts.protocol || (o._parts.protocol = e._parts.protocol), 
        this._parts.hostname) return o;
        for (n = 0; r = s[n]; n++) o._parts[r] = e._parts[r];
        return o._parts.path ? ".." === o._parts.path.substring(-2) && (o._parts.path += "/") : (o._parts.path = e._parts.path, 
        o._parts.query || (o._parts.query = e._parts.query)), "/" !== o.path().charAt(0) && (t = e.directory(), 
        o._parts.path = (t ? t + "/" : "") + o._parts.path, o.normalizePath()), o.build(), 
        o;
    }, d.relativeTo = function(e) {
        var t, n, r, o, s, a = this.clone().normalize();
        if (a._parts.urn) throw new Error("URNs do not have any generally defined hierarchical components");
        if (e = new i(e).normalize(), t = a._parts, n = e._parts, o = a.path(), s = e.path(), 
        "/" !== o.charAt(0)) throw new Error("URI is already relative");
        if ("/" !== s.charAt(0)) throw new Error("Cannot calculate a URI relative to another relative URI");
        if (t.protocol === n.protocol && (t.protocol = null), t.username !== n.username || t.password !== n.password) return a.build();
        if (null !== t.protocol || null !== t.username || null !== t.password) return a.build();
        if (t.hostname !== n.hostname || t.port !== n.port) return a.build();
        if (t.hostname = null, t.port = null, o === s) return t.path = "", a.build();
        if (!(r = i.commonPath(a.path(), e.path()))) return a.build();
        var u = n.path.substring(r.length).replace(/[^\/]*$/, "").replace(/.*?\//g, "../");
        return t.path = u + t.path.substring(r.length), a.build();
    }, d.equals = function(e) {
        var t, n, r, o = this.clone(), s = new i(e), u = {}, c = {}, p = {};
        if (o.normalize(), s.normalize(), o.toString() === s.toString()) return !0;
        if (t = o.query(), n = s.query(), o.query(""), s.query(""), o.toString() !== s.toString()) return !1;
        if (t.length !== n.length) return !1;
        u = i.parseQuery(t, this._parts.escapeQuerySpace), c = i.parseQuery(n, this._parts.escapeQuerySpace);
        for (r in u) if (m.call(u, r)) {
            if (a(u[r])) {
                if (!l(u[r], c[r])) return !1;
            } else if (u[r] !== c[r]) return !1;
            p[r] = !0;
        }
        for (r in c) if (m.call(c, r) && !p[r]) return !1;
        return !0;
    }, d.duplicateQueryParameters = function(e) {
        return this._parts.duplicateQueryParameters = !!e, this;
    }, d.escapeQuerySpace = function(e) {
        return this._parts.escapeQuerySpace = !!e, this;
    }, i;
}), function(e, t, n) {
    "use strict";
    t.spiedEventsKey = function(e, t) {
        return [ n(e).selector, t ].toString();
    }, t.getFixtures = function() {
        return t.currentFixtures_ = t.currentFixtures_ || new t.Fixtures();
    }, t.getStyleFixtures = function() {
        return t.currentStyleFixtures_ = t.currentStyleFixtures_ || new t.StyleFixtures();
    }, t.Fixtures = function() {
        this.containerId = "jasmine-fixtures", this.fixturesCache_ = {}, this.fixturesPath = "spec/javascripts/fixtures";
    }, t.Fixtures.prototype.set = function(e) {
        return this.cleanUp(), this.createContainer_(e);
    }, t.Fixtures.prototype.appendSet = function(e) {
        this.addToContainer_(e);
    }, t.Fixtures.prototype.preload = function() {
        this.read.apply(this, arguments);
    }, t.Fixtures.prototype.load = function() {
        this.cleanUp(), this.createContainer_(this.read.apply(this, arguments));
    }, t.Fixtures.prototype.appendLoad = function() {
        this.addToContainer_(this.read.apply(this, arguments));
    }, t.Fixtures.prototype.read = function() {
        for (var e = [], t = arguments, n = t.length, r = 0; r < n; r++) e.push(this.getFixtureHtml_(t[r]));
        return e.join("");
    }, t.Fixtures.prototype.clearCache = function() {
        this.fixturesCache_ = {};
    }, t.Fixtures.prototype.cleanUp = function() {
        n("#" + this.containerId).remove();
    }, t.Fixtures.prototype.sandbox = function(e) {
        var t = e || {};
        return n('<div id="sandbox" />').attr(t);
    }, t.Fixtures.prototype.createContainer_ = function(e) {
        var t = n("<div>").attr("id", this.containerId).html(e);
        return n(document.body).append(t), t;
    }, t.Fixtures.prototype.addToContainer_ = function(e) {
        n(document.body).find("#" + this.containerId).append(e).length || this.createContainer_(e);
    }, t.Fixtures.prototype.getFixtureHtml_ = function(e) {
        return void 0 === this.fixturesCache_[e] && this.loadFixtureIntoCache_(e), this.fixturesCache_[e];
    }, t.Fixtures.prototype.loadFixtureIntoCache_ = function(e) {
        var t = this, r = this.makeFixtureUrl_(e), i = "";
        n.ajax({
            "async": !1,
            "cache": !1,
            "url": r,
            "dataType": "html",
            "success": function(e, t, n) {
                i = n.responseText;
            }
        }).fail(function(e, t, n) {
            throw new Error("Fixture could not be loaded: " + r + " (status: " + t + ", message: " + n.message + ")");
        });
        (n(n.parseHTML(i, !0)).find("script[src]") || []).each(function() {
            n.ajax({
                "async": !1,
                "cache": !1,
                "dataType": "script",
                "url": n(this).attr("src"),
                "success": function(e, t, n) {
                    i += "<script>" + n.responseText + "<\/script>";
                },
                "error": function(e, t, n) {
                    throw new Error("Script could not be loaded: " + r + " (status: " + t + ", message: " + n.message + ")");
                }
            });
        }), t.fixturesCache_[e] = i;
    }, t.Fixtures.prototype.makeFixtureUrl_ = function(e) {
        return this.fixturesPath.match("/$") ? this.fixturesPath + e : this.fixturesPath + "/" + e;
    }, t.Fixtures.prototype.proxyCallTo_ = function(e, t) {
        return this[e].apply(this, t);
    }, t.StyleFixtures = function() {
        this.fixturesCache_ = {}, this.fixturesNodes_ = [], this.fixturesPath = "spec/javascripts/fixtures";
    }, t.StyleFixtures.prototype.set = function(e) {
        this.cleanUp(), this.createStyle_(e);
    }, t.StyleFixtures.prototype.appendSet = function(e) {
        this.createStyle_(e);
    }, t.StyleFixtures.prototype.preload = function() {
        this.read_.apply(this, arguments);
    }, t.StyleFixtures.prototype.load = function() {
        this.cleanUp(), this.createStyle_(this.read_.apply(this, arguments));
    }, t.StyleFixtures.prototype.appendLoad = function() {
        this.createStyle_(this.read_.apply(this, arguments));
    }, t.StyleFixtures.prototype.cleanUp = function() {
        for (;this.fixturesNodes_.length; ) this.fixturesNodes_.pop().remove();
    }, t.StyleFixtures.prototype.createStyle_ = function(e) {
        var t = n("<div></div>").html(e).text(), r = n("<style>" + t + "</style>");
        this.fixturesNodes_.push(r), n("head").append(r);
    }, t.StyleFixtures.prototype.clearCache = t.Fixtures.prototype.clearCache, t.StyleFixtures.prototype.read_ = t.Fixtures.prototype.read, 
    t.StyleFixtures.prototype.getFixtureHtml_ = t.Fixtures.prototype.getFixtureHtml_, 
    t.StyleFixtures.prototype.loadFixtureIntoCache_ = t.Fixtures.prototype.loadFixtureIntoCache_, 
    t.StyleFixtures.prototype.makeFixtureUrl_ = t.Fixtures.prototype.makeFixtureUrl_, 
    t.StyleFixtures.prototype.proxyCallTo_ = t.Fixtures.prototype.proxyCallTo_, t.getJSONFixtures = function() {
        return t.currentJSONFixtures_ = t.currentJSONFixtures_ || new t.JSONFixtures();
    }, t.JSONFixtures = function() {
        this.fixturesCache_ = {}, this.fixturesPath = "spec/javascripts/fixtures/json";
    }, t.JSONFixtures.prototype.load = function() {
        return this.read.apply(this, arguments), this.fixturesCache_;
    }, t.JSONFixtures.prototype.read = function() {
        for (var e = arguments, t = e.length, n = 0; n < t; n++) this.getFixtureData_(e[n]);
        return this.fixturesCache_;
    }, t.JSONFixtures.prototype.clearCache = function() {
        this.fixturesCache_ = {};
    }, t.JSONFixtures.prototype.getFixtureData_ = function(e) {
        return this.fixturesCache_[e] || this.loadFixtureIntoCache_(e), this.fixturesCache_[e];
    }, t.JSONFixtures.prototype.loadFixtureIntoCache_ = function(e) {
        var t = this, r = this.fixturesPath.match("/$") ? this.fixturesPath + e : this.fixturesPath + "/" + e;
        n.ajax({
            "async": !1,
            "cache": !1,
            "dataType": "json",
            "url": r,
            "success": function(n) {
                t.fixturesCache_[e] = n;
            },
            "error": function(e, t, n) {
                throw new Error("JSONFixture could not be loaded: " + r + " (status: " + t + ", message: " + n.message + ")");
            }
        });
    }, t.JSONFixtures.prototype.proxyCallTo_ = function(e, t) {
        return this[e].apply(this, t);
    }, t.jQuery = function() {}, t.jQuery.browserTagCaseIndependentHtml = function(e) {
        return n("<div/>").append(e).html();
    }, t.jQuery.elementToString = function(e) {
        return n(e).map(function() {
            return this.outerHTML;
        }).toArray().join(", ");
    };
    var r = {
        "spiedEvents": {},
        "handlers": []
    };
    t.jQuery.events = {
        "spyOn": function(e, i) {
            var o = function(n) {
                r.spiedEvents[t.spiedEventsKey(e, i)] = t.util.argsToArray(arguments);
            };
            return n(e).on(i, o), r.handlers.push(o), {
                "selector": e,
                "eventName": i,
                "handler": o,
                "reset": function() {
                    delete r.spiedEvents[t.spiedEventsKey(e, i)];
                }
            };
        },
        "args": function(e, n) {
            var i = r.spiedEvents[t.spiedEventsKey(e, n)];
            if (!i) throw "There is no spy for " + n + " on " + e.toString() + ". Make sure to create a spy using spyOnEvent.";
            return i;
        },
        "wasTriggered": function(e, n) {
            return !!r.spiedEvents[t.spiedEventsKey(e, n)];
        },
        "wasTriggeredWith": function(e, n, r, i, o) {
            var s = t.jQuery.events.args(e, n).slice(1);
            return "[object Array]" !== Object.prototype.toString.call(r) && (s = s[0]), i.equals(s, r, o);
        },
        "wasPrevented": function(e, n) {
            var i = r.spiedEvents[t.spiedEventsKey(e, n)], o = i ? i[0] : void 0;
            return o && o.isDefaultPrevented();
        },
        "wasStopped": function(e, n) {
            var i = r.spiedEvents[t.spiedEventsKey(e, n)], o = i ? i[0] : void 0;
            return o && o.isPropagationStopped();
        },
        "cleanUp": function() {
            r.spiedEvents = {}, r.handlers = [];
        }
    };
    var i = function(e, t) {
        return void 0 === t ? void 0 !== e : e === t;
    };
    beforeEach(function() {
        t.addMatchers({
            "toHaveClass": function() {
                return {
                    "compare": function(e, t) {
                        return {
                            "pass": n(e).hasClass(t)
                        };
                    }
                };
            },
            "toHaveCss": function() {
                return {
                    "compare": function(e, t) {
                        for (var r in t) {
                            var i = t[r];
                            if (("auto" !== i || "auto" !== n(e).get(0).style[r]) && n(e).css(r) !== i) return {
                                "pass": !1
                            };
                        }
                        return {
                            "pass": !0
                        };
                    }
                };
            },
            "toBeVisible": function() {
                return {
                    "compare": function(e) {
                        return {
                            "pass": n(e).is(":visible")
                        };
                    }
                };
            },
            "toBeHidden": function() {
                return {
                    "compare": function(e) {
                        return {
                            "pass": n(e).is(":hidden")
                        };
                    }
                };
            },
            "toBeSelected": function() {
                return {
                    "compare": function(e) {
                        return {
                            "pass": n(e).is(":selected")
                        };
                    }
                };
            },
            "toBeChecked": function() {
                return {
                    "compare": function(e) {
                        return {
                            "pass": n(e).is(":checked")
                        };
                    }
                };
            },
            "toBeEmpty": function() {
                return {
                    "compare": function(e) {
                        return {
                            "pass": n(e).is(":empty")
                        };
                    }
                };
            },
            "toBeInDOM": function() {
                return {
                    "compare": function(e) {
                        return {
                            "pass": n.contains(document.documentElement, n(e)[0])
                        };
                    }
                };
            },
            "toExist": function() {
                return {
                    "compare": function(e) {
                        return {
                            "pass": n(e).length
                        };
                    }
                };
            },
            "toHaveLength": function() {
                return {
                    "compare": function(e, t) {
                        return {
                            "pass": n(e).length === t
                        };
                    }
                };
            },
            "toHaveAttr": function() {
                return {
                    "compare": function(e, t, r) {
                        return {
                            "pass": i(n(e).attr(t), r)
                        };
                    }
                };
            },
            "toHaveProp": function() {
                return {
                    "compare": function(e, t, r) {
                        return {
                            "pass": i(n(e).prop(t), r)
                        };
                    }
                };
            },
            "toHaveId": function() {
                return {
                    "compare": function(e, t) {
                        return {
                            "pass": n(e).attr("id") == t
                        };
                    }
                };
            },
            "toHaveHtml": function() {
                return {
                    "compare": function(e, r) {
                        return {
                            "pass": n(e).html() == t.jQuery.browserTagCaseIndependentHtml(r)
                        };
                    }
                };
            },
            "toContainHtml": function() {
                return {
                    "compare": function(e, r) {
                        var i = n(e).html(), o = t.jQuery.browserTagCaseIndependentHtml(r);
                        return {
                            "pass": i.indexOf(o) >= 0
                        };
                    }
                };
            },
            "toHaveText": function() {
                return {
                    "compare": function(e, t) {
                        var r = n(e).text(), i = n.trim(r);
                        return t && n.isFunction(t.test) ? {
                            "pass": t.test(r) || t.test(i)
                        } : {
                            "pass": r == t || i == t
                        };
                    }
                };
            },
            "toContainText": function() {
                return {
                    "compare": function(e, t) {
                        var r = n.trim(n(e).text());
                        return t && n.isFunction(t.test) ? {
                            "pass": t.test(r)
                        } : {
                            "pass": -1 != r.indexOf(t)
                        };
                    }
                };
            },
            "toHaveValue": function() {
                return {
                    "compare": function(e, t) {
                        return {
                            "pass": n(e).val() === t
                        };
                    }
                };
            },
            "toHaveData": function() {
                return {
                    "compare": function(e, t, r) {
                        return {
                            "pass": i(n(e).data(t), r)
                        };
                    }
                };
            },
            "toContainElement": function() {
                return {
                    "compare": function(e, t) {
                        return {
                            "pass": n(e).find(t).length
                        };
                    }
                };
            },
            "toBeMatchedBy": function() {
                return {
                    "compare": function(e, t) {
                        return {
                            "pass": n(e).filter(t).length
                        };
                    }
                };
            },
            "toBeDisabled": function() {
                return {
                    "compare": function(e, t) {
                        return {
                            "pass": n(e).is(":disabled")
                        };
                    }
                };
            },
            "toBeFocused": function(e) {
                return {
                    "compare": function(e, t) {
                        return {
                            "pass": n(e)[0] === n(e)[0].ownerDocument.activeElement
                        };
                    }
                };
            },
            "toHandle": function() {
                return {
                    "compare": function(e, t) {
                        if (!e || 0 === e.length) return {
                            "pass": !1
                        };
                        var r = n._data(n(e).get(0), "events");
                        if (!r || !t || "string" != typeof t) return {
                            "pass": !1
                        };
                        var i = t.split("."), o = i.shift(), s = i.slice(0).sort(), a = new RegExp("(^|\\.)" + s.join("\\.(?:.*\\.)?") + "(\\.|$)");
                        if (!r[o] || !i.length) return {
                            "pass": r[o] && r[o].length > 0
                        };
                        for (var u = 0; u < r[o].length; u++) {
                            var c = r[o][u].namespace;
                            if (a.test(c)) return {
                                "pass": !0
                            };
                        }
                        return {
                            "pass": !1
                        };
                    }
                };
            },
            "toHandleWith": function() {
                return {
                    "compare": function(e, t, r) {
                        if (!e || 0 === e.length) return {
                            "pass": !1
                        };
                        for (var i = t.split(".")[0], o = n._data(n(e).get(0), "events")[i], s = 0; s < o.length; s++) if (o[s].handler == r) return {
                            "pass": !0
                        };
                        return {
                            "pass": !1
                        };
                    }
                };
            },
            "toHaveBeenTriggeredOn": function() {
                return {
                    "compare": function(e, r) {
                        var i = {
                            "pass": t.jQuery.events.wasTriggered(r, e)
                        };
                        return i.message = i.pass ? "Expected event " + n(e) + " not to have been triggered on " + r : "Expected event " + n(e) + " to have been triggered on " + r, 
                        i;
                    }
                };
            },
            "toHaveBeenTriggered": function() {
                return {
                    "compare": function(e) {
                        var n = e.eventName, r = e.selector, i = {
                            "pass": t.jQuery.events.wasTriggered(r, n)
                        };
                        return i.message = i.pass ? "Expected event " + n + " not to have been triggered on " + r : "Expected event " + n + " to have been triggered on " + r, 
                        i;
                    }
                };
            },
            "toHaveBeenTriggeredOnAndWith": function(e, n) {
                return {
                    "compare": function(r, i, o) {
                        var s = t.jQuery.events.wasTriggered(i, r), a = {
                            "pass": s && t.jQuery.events.wasTriggeredWith(i, r, o, e, n)
                        };
                        if (s) {
                            var u = t.jQuery.events.args(i, r, o)[1];
                            a.message = a.pass ? "Expected event " + r + " not to have been triggered with " + t.pp(o) + " but it was triggered with " + t.pp(u) : "Expected event " + r + " to have been triggered with " + t.pp(o) + "  but it was triggered with " + t.pp(u);
                        } else a.message = a.pass ? "Expected event " + r + " not to have been triggered on " + i : "Expected event " + r + " to have been triggered on " + i;
                        return a;
                    }
                };
            },
            "toHaveBeenPreventedOn": function() {
                return {
                    "compare": function(e, n) {
                        var r = {
                            "pass": t.jQuery.events.wasPrevented(n, e)
                        };
                        return r.message = r.pass ? "Expected event " + e + " not to have been prevented on " + n : "Expected event " + e + " to have been prevented on " + n, 
                        r;
                    }
                };
            },
            "toHaveBeenPrevented": function() {
                return {
                    "compare": function(e) {
                        var n = e.eventName, r = e.selector, i = {
                            "pass": t.jQuery.events.wasPrevented(r, n)
                        };
                        return i.message = i.pass ? "Expected event " + n + " not to have been prevented on " + r : "Expected event " + n + " to have been prevented on " + r, 
                        i;
                    }
                };
            },
            "toHaveBeenStoppedOn": function() {
                return {
                    "compare": function(e, n) {
                        var r = {
                            "pass": t.jQuery.events.wasStopped(n, e)
                        };
                        return r.message = r.pass ? "Expected event " + e + " not to have been stopped on " + n : "Expected event " + e + " to have been stopped on " + n, 
                        r;
                    }
                };
            },
            "toHaveBeenStopped": function() {
                return {
                    "compare": function(e) {
                        var n = e.eventName, r = e.selector, i = {
                            "pass": t.jQuery.events.wasStopped(r, n)
                        };
                        return i.message = i.pass ? "Expected event " + n + " not to have been stopped on " + r : "Expected event " + n + " to have been stopped on " + r, 
                        i;
                    }
                };
            }
        }), t.getEnv().addCustomEqualityTester(function(e, r) {
            if (e && r) {
                if (e instanceof n || t.isDomNode(e)) {
                    var i = n(e);
                    return r instanceof n ? i.length == r.length && e.is(r) : i.is(r);
                }
                if (r instanceof n || t.isDomNode(r)) {
                    var o = n(r);
                    return e instanceof n ? e.length == o.length && o.is(e) : n(r).is(e);
                }
            }
        }), t.getEnv().addCustomEqualityTester(function(e, t) {
            if (e instanceof n && t instanceof n && e.size() == t.size()) return e.is(t);
        });
    }), afterEach(function() {
        t.getFixtures().cleanUp(), t.getStyleFixtures().cleanUp(), t.jQuery.events.cleanUp();
    }), e.readFixtures = function() {
        return t.getFixtures().proxyCallTo_("read", arguments);
    }, e.preloadFixtures = function() {
        t.getFixtures().proxyCallTo_("preload", arguments);
    }, e.loadFixtures = function() {
        t.getFixtures().proxyCallTo_("load", arguments);
    }, e.appendLoadFixtures = function() {
        t.getFixtures().proxyCallTo_("appendLoad", arguments);
    }, e.setFixtures = function(e) {
        return t.getFixtures().proxyCallTo_("set", arguments);
    }, e.appendSetFixtures = function() {
        t.getFixtures().proxyCallTo_("appendSet", arguments);
    }, e.sandbox = function(e) {
        return t.getFixtures().sandbox(e);
    }, e.spyOnEvent = function(e, n) {
        return t.jQuery.events.spyOn(e, n);
    }, e.preloadStyleFixtures = function() {
        t.getStyleFixtures().proxyCallTo_("preload", arguments);
    }, e.loadStyleFixtures = function() {
        t.getStyleFixtures().proxyCallTo_("load", arguments);
    }, e.appendLoadStyleFixtures = function() {
        t.getStyleFixtures().proxyCallTo_("appendLoad", arguments);
    }, e.setStyleFixtures = function(e) {
        t.getStyleFixtures().proxyCallTo_("set", arguments);
    }, e.appendSetStyleFixtures = function(e) {
        t.getStyleFixtures().proxyCallTo_("appendSet", arguments);
    }, e.loadJSONFixtures = function() {
        return t.getJSONFixtures().proxyCallTo_("load", arguments);
    }, e.getJSONFixture = function(e) {
        return t.getJSONFixtures().proxyCallTo_("read", arguments)[e];
    };
}(window, window.jasmine, window.jQuery), this.AsyncSpec = function(e) {
    function t(e) {
        return function() {
            var t = !1, n = function() {
                t = !0;
            };
            runs(function() {
                e(n);
            }), waitsFor(function() {
                return t;
            });
        };
    }
    function n(e) {
        this.spec = e;
    }
    return n.prototype.beforeEach = function(e) {
        this.spec.beforeEach(t(e));
    }, n.prototype.afterEach = function(e) {
        this.spec.afterEach(t(e));
    }, n.prototype.it = function(n, r) {
        e.it(n, t(r));
    }, n;
}(this), function(e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define("sinon", [], function() {
        return e.sinon = t();
    }) : "object" == typeof exports ? module.exports = t() : e.sinon = t();
}(this, function() {
    "use strict";
    function getGlobal() {
        return "undefined" != typeof window ? window : global;
    }
    var samsam, formatio, lolex;
    !function() {
        function define(e, t, n) {
            "samsam" == e ? samsam = t() : "function" == typeof t && 0 === e.length ? lolex = t() : "function" == typeof n && (formatio = n(samsam));
        }
        define.amd = {}, ("function" == typeof define && define.amd && function(e) {
            define("samsam", e);
        } || "object" == typeof module && function(e) {
            module.exports = e();
        } || function(e) {
            this.samsam = e();
        })(function() {
            function e(e) {
                var t = e;
                return "number" == typeof e && e !== t;
            }
            function t(e) {
                return f.toString.call(e).split(/[ \]]/)[1];
            }
            function n(e) {
                if ("Arguments" === t(e)) return !0;
                if ("object" != typeof e || "number" != typeof e.length || "Array" === t(e)) return !1;
                if ("function" == typeof e.callee) return !0;
                try {
                    e[e.length] = 6, delete e[e.length];
                } catch (e) {
                    return !0;
                }
                return !1;
            }
            function r(e) {
                if (!e || 1 !== e.nodeType || !h) return !1;
                try {
                    e.appendChild(h), e.removeChild(h);
                } catch (e) {
                    return !1;
                }
                return !0;
            }
            function i(e) {
                var t, n = [];
                for (t in e) f.hasOwnProperty.call(e, t) && n.push(t);
                return n;
            }
            function o(e) {
                return "function" == typeof e.getTime && e.getTime() == e.valueOf();
            }
            function s(e) {
                return 0 === e && 1 / e == -1 / 0;
            }
            function a(t, n) {
                if (t === n || e(t) && e(n)) return 0 !== t || s(t) === s(n);
            }
            function u(e) {
                if ("undefined" != typeof Set && e instanceof Set) return !0;
            }
            function c(e, t, n) {
                for (var r = Array.from(e), i = Array.from(t), o = 0; o < r.length; o++) {
                    for (var s = !1, a = 0; a < i.length; a++) if (n(i[a], r[o])) {
                        s = !0;
                        break;
                    }
                    if (!s) return !1;
                }
                return !0;
            }
            function l(e, t, n) {
                if (0 === t.length) return !0;
                var r, i, o, s;
                for (r = 0, i = e.length; r < i; ++r) if (n(e[r], t[0])) {
                    for (o = 0, s = t.length; o < s; ++o) {
                        if (r + o >= i) return !1;
                        if (!n(e[r + o], t[o])) return !1;
                    }
                    return !0;
                }
                return !1;
            }
            function p(e, n) {
                if (n && "function" == typeof n.test) return n.test(e);
                if ("function" == typeof n) return !0 === n(e);
                if ("string" == typeof n) return n = n.toLowerCase(), ("string" == typeof e || !!e) && String(e).toLowerCase().indexOf(n) >= 0;
                if ("number" == typeof n) return n === e;
                if ("boolean" == typeof n) return n === e;
                if (void 0 === n) return void 0 === e;
                if (null === n) return null === e;
                if (u(e)) return c(n, e, p);
                if ("Array" === t(e) && "Array" === t(n)) return l(e, n, p);
                if (n && "object" == typeof n) {
                    if (n === e) return !0;
                    var r;
                    for (r in n) {
                        var i = e[r];
                        if (void 0 === i && "function" == typeof e.getAttribute && (i = e.getAttribute(r)), 
                        null === n[r] || void 0 === n[r]) {
                            if (i !== n[r]) return !1;
                        } else if (void 0 === i || !p(i, n[r])) return !1;
                    }
                    return !0;
                }
                throw new Error("Matcher was not a string, a number, a function, a boolean or an object");
            }
            var f = Object.prototype, h = "undefined" != typeof document && document.createElement("div");
            return {
                "isArguments": n,
                "isElement": r,
                "isDate": o,
                "isNegZero": s,
                "identical": a,
                "deepEqual": function(s, l) {
                    function p(e) {
                        return !("object" != typeof e || null === e || e instanceof Boolean || e instanceof Date || e instanceof Number || e instanceof RegExp || e instanceof String);
                    }
                    function h(e, t) {
                        var n;
                        for (n = 0; n < e.length; n++) if (e[n] === t) return n;
                        return -1;
                    }
                    var d = [], m = [], y = [], g = [], v = {};
                    return function s(l, x, b, w) {
                        var E = typeof l, C = typeof x;
                        if (l === x || e(l) || e(x) || null == l || null == x || "object" !== E || "object" !== C) return a(l, x);
                        if (r(l) || r(x)) return !1;
                        var _ = o(l), T = o(x);
                        if ((_ || T) && (!_ || !T || l.getTime() !== x.getTime())) return !1;
                        if (l instanceof RegExp && x instanceof RegExp && l.toString() !== x.toString()) return !1;
                        var A = t(l), S = t(x), k = i(l), O = i(x);
                        if (n(l) || n(x)) {
                            if (l.length !== x.length) return !1;
                        } else if (E !== C || A !== S || k.length !== O.length) return !1;
                        if (u(l) || u(x)) return !(!u(l) || !u(x) || l.size !== x.size) && c(l, x, s);
                        var q, j, F, R, P, N, I, L, D, H, M;
                        for (j = 0, F = k.length; j < F; j++) {
                            if (q = k[j], !f.hasOwnProperty.call(x, q)) return !1;
                            if (R = l[q], P = x[q], N = p(R), I = p(P), L = N ? h(d, R) : -1, D = I ? h(m, P) : -1, 
                            H = -1 !== L ? y[L] : b + "[" + JSON.stringify(q) + "]", M = -1 !== D ? g[D] : w + "[" + JSON.stringify(q) + "]", 
                            v[H + M]) return !0;
                            if (-1 === L && N && (d.push(R), y.push(H)), -1 === D && I && (m.push(P), g.push(M)), 
                            N && I && (v[H + M] = !0), !s(R, P, H, M)) return !1;
                        }
                        return !0;
                    }(s, l, "$1", "$2");
                },
                "match": p,
                "keys": i
            };
        }), ("function" == typeof define && define.amd && function(e) {
            define("formatio", [ "samsam" ], e);
        } || "object" == typeof module && function(e) {
            module.exports = e(require("samsam"));
        } || function(e) {
            this.formatio = e(this.samsam);
        })(function(e) {
            function t(e) {
                if (!e) return "";
                if (e.displayName) return e.displayName;
                if (e.name) return e.name;
                var t = e.toString().match(/function\s+([^\(]+)/m);
                return t && t[1] || "";
            }
            function n(e, n) {
                var r, i, o = t(n && n.constructor), a = e.excludeConstructors || s.excludeConstructors || [];
                for (r = 0, i = a.length; r < i; ++r) {
                    if ("string" == typeof a[r] && a[r] === o) return "";
                    if (a[r].test && a[r].test(o)) return "";
                }
                return o;
            }
            function r(e, t) {
                if ("object" != typeof e) return !1;
                var n, r;
                for (n = 0, r = t.length; n < r; ++n) if (t[n] === e) return !0;
                return !1;
            }
            function i(t, n, o, s) {
                if ("string" == typeof n) {
                    var u = t.quoteStrings, c = "boolean" != typeof u || u;
                    return o || c ? '"' + n + '"' : n;
                }
                if ("function" == typeof n && !(n instanceof RegExp)) return i.func(n);
                if (o = o || [], r(n, o)) return "[Circular]";
                if ("[object Array]" === Object.prototype.toString.call(n)) return i.array.call(t, n, o);
                if (!n) return String(1 / n == -1 / 0 ? "-0" : n);
                if (e.isElement(n)) return i.element(n);
                if ("function" == typeof n.toString && n.toString !== Object.prototype.toString) return n.toString();
                var l, p;
                for (l = 0, p = a.length; l < p; l++) if (n === a[l].object) return a[l].value;
                return i.object.call(t, n, o, s);
            }
            function o(e) {
                for (var t in e) this[t] = e[t];
            }
            var s = {
                "excludeConstructors": [ "Object", /^.$/ ],
                "quoteStrings": !0,
                "limitChildrenCount": 0
            }, a = (Object.prototype.hasOwnProperty, []);
            return "undefined" != typeof global && a.push({
                "object": global,
                "value": "[object global]"
            }), "undefined" != typeof document && a.push({
                "object": document,
                "value": "[object HTMLDocument]"
            }), "undefined" != typeof window && a.push({
                "object": window,
                "value": "[object Window]"
            }), i.func = function(e) {
                return "function " + t(e) + "() {}";
            }, i.array = function(e, t) {
                (t = t || []).push(e);
                var n, r, o = [];
                for (r = this.limitChildrenCount > 0 ? Math.min(this.limitChildrenCount, e.length) : e.length, 
                n = 0; n < r; ++n) o.push(i(this, e[n], t));
                return r < e.length && o.push("[... " + (e.length - r) + " more elements]"), "[" + o.join(", ") + "]";
            }, i.object = function(t, o, s) {
                (o = o || []).push(t), s = s || 0;
                var a, u, c, l, p, f, h = [], d = e.keys(t).sort(), m = 3;
                for (f = this.limitChildrenCount > 0 ? Math.min(this.limitChildrenCount, d.length) : d.length, 
                l = 0; l < f; ++l) u = r(c = t[a = d[l]], o) ? "[Circular]" : i(this, c, o, s + 2), 
                m += (u = (/\s/.test(a) ? '"' + a + '"' : a) + ": " + u).length, h.push(u);
                var y = n(this, t), g = y ? "[" + y + "] " : "", v = "";
                for (l = 0, p = s; l < p; ++l) v += " ";
                return f < d.length && h.push("[... " + (d.length - f) + " more elements]"), m + s > 80 ? g + "{\n  " + v + h.join(",\n  " + v) + "\n" + v + "}" : g + "{ " + h.join(", ") + " }";
            }, i.element = function(e) {
                var t, n, r, i, o, s = e.tagName.toLowerCase(), a = e.attributes, u = [];
                for (r = 0, i = a.length; r < i; ++r) n = (t = a.item(r)).nodeName.toLowerCase().replace("html:", ""), 
                o = t.nodeValue, "contenteditable" === n && "inherit" === o || o && u.push(n + '="' + o + '"');
                var c = "<" + s + (u.length > 0 ? " " : ""), l = e.innerHTML;
                return l.length > 20 && (l = l.substr(0, 20) + "[...]"), (c + u.join(" ") + ">" + l + "</" + s + ">").replace(/ contentEditable="inherit"/, "");
            }, o.prototype = {
                "functionName": t,
                "configure": function(e) {
                    return new o(e);
                },
                "constructorName": function(e) {
                    return n(this, e);
                },
                "ascii": function(e, t, n) {
                    return i(this, e, t, n);
                }
            };
        }), function(e) {
            if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
                ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).lolex = e();
            }
        }(function() {
            var define, module, exports;
            return function e(t, n, r) {
                function i(s, a) {
                    if (!n[s]) {
                        if (!t[s]) {
                            var u = "function" == typeof require && require;
                            if (!a && u) return u(s, !0);
                            if (o) return o(s, !0);
                            var c = new Error("Cannot find module '" + s + "'");
                            throw c.code = "MODULE_NOT_FOUND", c;
                        }
                        var l = n[s] = {
                            "exports": {}
                        };
                        t[s][0].call(l.exports, function(e) {
                            var n = t[s][1][e];
                            return i(n || e);
                        }, l, l.exports, e, t, n, r);
                    }
                    return n[s].exports;
                }
                for (var o = "function" == typeof require && require, s = 0; s < r.length; s++) i(r[s]);
                return i;
            }({
                "1": [ function(require, module, exports) {
                    (function(global) {
                        !function(global) {
                            function parseTime(e) {
                                if (!e) return 0;
                                var t, n = e.split(":"), r = n.length, i = r, o = 0;
                                if (r > 3 || !/^(\d\d:){0,2}\d\d?$/.test(e)) throw new Error("tick only understands numbers, 'm:s' and 'h:m:s'. Each part must be two digits");
                                for (;i--; ) {
                                    if ((t = parseInt(n[i], 10)) >= 60) throw new Error("Invalid time " + e);
                                    o += t * Math.pow(60, r - i - 1);
                                }
                                return 1e3 * o;
                            }
                            function fixedFloor(e) {
                                return e >= 0 ? Math.floor(e) : Math.ceil(e);
                            }
                            function fixedModulo(e, t) {
                                return (e % t + t) % t;
                            }
                            function getEpoch(e) {
                                if (!e) return 0;
                                if ("function" == typeof e.getTime) return e.getTime();
                                if ("number" == typeof e) return e;
                                throw new TypeError("now should be milliseconds since UNIX epoch");
                            }
                            function inRange(e, t, n) {
                                return n && n.callAt >= e && n.callAt <= t;
                            }
                            function mirrorDateProperties(e, t) {
                                var n;
                                for (n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
                                return t.now ? e.now = function() {
                                    return e.clock.now;
                                } : delete e.now, t.toSource ? e.toSource = function() {
                                    return t.toSource();
                                } : delete e.toSource, e.toString = function() {
                                    return t.toString();
                                }, e.prototype = t.prototype, e.parse = t.parse, e.UTC = t.UTC, e.prototype.toUTCString = t.prototype.toUTCString, 
                                e;
                            }
                            function createDate() {
                                function e(t, n, r, i, o, s, a) {
                                    switch (arguments.length) {
                                      case 0:
                                        return new NativeDate(e.clock.now);

                                      case 1:
                                        return new NativeDate(t);

                                      case 2:
                                        return new NativeDate(t, n);

                                      case 3:
                                        return new NativeDate(t, n, r);

                                      case 4:
                                        return new NativeDate(t, n, r, i);

                                      case 5:
                                        return new NativeDate(t, n, r, i, o);

                                      case 6:
                                        return new NativeDate(t, n, r, i, o, s);

                                      default:
                                        return new NativeDate(t, n, r, i, o, s, a);
                                    }
                                }
                                return mirrorDateProperties(e, NativeDate);
                            }
                            function addTimer(e, t) {
                                if (void 0 === t.func) throw new Error("Callback must be provided to timer calls");
                                return e.timers || (e.timers = {}), t.id = uniqueTimerId++, t.createdAt = e.now, 
                                t.callAt = e.now + (parseInt(t.delay) || (e.duringTick ? 1 : 0)), e.timers[t.id] = t, 
                                addTimerReturnsObject ? {
                                    "id": t.id,
                                    "ref": NOOP,
                                    "unref": NOOP
                                } : t.id;
                            }
                            function compareTimers(e, t) {
                                return e.callAt < t.callAt ? -1 : e.callAt > t.callAt ? 1 : e.immediate && !t.immediate ? -1 : !e.immediate && t.immediate ? 1 : e.createdAt < t.createdAt ? -1 : e.createdAt > t.createdAt ? 1 : e.id < t.id ? -1 : e.id > t.id ? 1 : void 0;
                            }
                            function firstTimerInRange(e, t, n) {
                                var r, i = e.timers, o = null;
                                for (r in i) i.hasOwnProperty(r) && (!inRange(t, n, i[r]) || o && 1 !== compareTimers(o, i[r]) || (o = i[r]));
                                return o;
                            }
                            function firstTimer(e) {
                                var t, n = e.timers, r = null;
                                for (t in n) n.hasOwnProperty(t) && (r && 1 !== compareTimers(r, n[t]) || (r = n[t]));
                                return r;
                            }
                            function lastTimer(e) {
                                var t, n = e.timers, r = null;
                                for (t in n) n.hasOwnProperty(t) && (r && -1 !== compareTimers(r, n[t]) || (r = n[t]));
                                return r;
                            }
                            function callTimer(clock, timer) {
                                var exception;
                                "number" == typeof timer.interval ? clock.timers[timer.id].callAt += timer.interval : delete clock.timers[timer.id];
                                try {
                                    "function" == typeof timer.func ? timer.func.apply(null, timer.args) : eval(timer.func);
                                } catch (e) {
                                    exception = e;
                                }
                                if (clock.timers[timer.id]) {
                                    if (exception) throw exception;
                                } else if (exception) throw exception;
                            }
                            function timerType(e) {
                                return e.immediate ? "Immediate" : void 0 !== e.interval ? "Interval" : "Timeout";
                            }
                            function clearTimer(e, t, n) {
                                if (t && (e.timers || (e.timers = []), "object" == typeof t && (t = t.id), e.timers.hasOwnProperty(t))) {
                                    var r = e.timers[t];
                                    if (timerType(r) !== n) throw new Error("Cannot clear timer: timer created with set" + timerType(r) + "() but cleared with clear" + n + "()");
                                    delete e.timers[t];
                                }
                            }
                            function uninstall(e, t) {
                                var n, r, i;
                                for (r = 0, i = e.methods.length; r < i; r++) if ("hrtime" === (n = e.methods[r]) && t.process) t.process.hrtime = e._hrtime; else if (t[n] && t[n].hadOwnProperty) t[n] = e["_" + n]; else try {
                                    delete t[n];
                                } catch (e) {}
                                e.methods = [];
                            }
                            function hijackMethod(e, t, n) {
                                var r;
                                if (n[t].hadOwnProperty = Object.prototype.hasOwnProperty.call(e, t), n["_" + t] = e[t], 
                                "Date" === t) {
                                    var i = mirrorDateProperties(n[t], e[t]);
                                    e[t] = i;
                                } else {
                                    e[t] = function() {
                                        return n[t].apply(n, arguments);
                                    };
                                    for (r in n[t]) n[t].hasOwnProperty(r) && (e[t][r] = n[t][r]);
                                }
                                e[t].clock = n;
                            }
                            function createClock(e, t) {
                                t = t || 1e3;
                                var n = {
                                    "now": getEpoch(e),
                                    "hrNow": 0,
                                    "timeouts": {},
                                    "Date": createDate(),
                                    "loopLimit": t
                                };
                                return n.Date.clock = n, n.setTimeout = function(e, t) {
                                    return addTimer(n, {
                                        "func": e,
                                        "args": Array.prototype.slice.call(arguments, 2),
                                        "delay": t
                                    });
                                }, n.clearTimeout = function(e) {
                                    return clearTimer(n, e, "Timeout");
                                }, n.setInterval = function(e, t) {
                                    return addTimer(n, {
                                        "func": e,
                                        "args": Array.prototype.slice.call(arguments, 2),
                                        "delay": t,
                                        "interval": t
                                    });
                                }, n.clearInterval = function(e) {
                                    return clearTimer(n, e, "Interval");
                                }, n.setImmediate = function(e) {
                                    return addTimer(n, {
                                        "func": e,
                                        "args": Array.prototype.slice.call(arguments, 1),
                                        "immediate": !0
                                    });
                                }, n.clearImmediate = function(e) {
                                    return clearTimer(n, e, "Immediate");
                                }, n.tick = function(e) {
                                    function t(e) {
                                        n.hrNow += e - n.now;
                                    }
                                    e = "number" == typeof e ? e : parseTime(e);
                                    var r, i = n.now, o = n.now + e, s = n.now, a = firstTimerInRange(n, i, o);
                                    n.duringTick = !0;
                                    for (var u; a && i <= o; ) {
                                        if (n.timers[a.id]) {
                                            t(a.callAt), i = a.callAt, n.now = a.callAt;
                                            try {
                                                r = n.now, callTimer(n, a), r !== n.now && (i += n.now - r, o += n.now - r, s += n.now - r);
                                            } catch (e) {
                                                u = u || e;
                                            }
                                        }
                                        a = firstTimerInRange(n, s, o), s = i;
                                    }
                                    if (n.duringTick = !1, t(o), n.now = o, u) throw u;
                                    return n.now;
                                }, n.next = function() {
                                    var e = firstTimer(n);
                                    if (!e) return n.now;
                                    n.duringTick = !0;
                                    try {
                                        return n.now = e.callAt, callTimer(n, e), n.now;
                                    } finally {
                                        n.duringTick = !1;
                                    }
                                }, n.runAll = function() {
                                    var e;
                                    for (e = 0; e < n.loopLimit; e++) {
                                        if (!n.timers) return n.now;
                                        if (0 === Object.keys(n.timers).length) return n.now;
                                        n.next();
                                    }
                                    throw new Error("Aborting after running " + n.loopLimit + "timers, assuming an infinite loop!");
                                }, n.runToLast = function() {
                                    var e = lastTimer(n);
                                    return e ? n.tick(e.callAt) : n.now;
                                }, n.reset = function() {
                                    n.timers = {};
                                }, n.setSystemTime = function(e) {
                                    var t, r, i = getEpoch(e), o = i - n.now;
                                    n.now = i;
                                    for (t in n.timers) n.timers.hasOwnProperty(t) && ((r = n.timers[t]).createdAt += o, 
                                    r.callAt += o);
                                }, hrtimePresent && (n.hrtime = function(e) {
                                    if (Array.isArray(e)) {
                                        var t = e[0] + e[1] / 1e9, r = n.hrNow / 1e3 - t;
                                        return [ fixedFloor(r), fixedModulo(1e9 * r, 1e9) ];
                                    }
                                    return [ fixedFloor(n.hrNow / 1e3), fixedModulo(1e6 * n.hrNow, 1e9) ];
                                }), n;
                            }
                            var userAgent = global.navigator && global.navigator.userAgent, isRunningInIE = userAgent && userAgent.indexOf("MSIE ") > -1;
                            isRunningInIE && (global.setTimeout = global.setTimeout, global.clearTimeout = global.clearTimeout, 
                            global.setInterval = global.setInterval, global.clearInterval = global.clearInterval, 
                            global.Date = global.Date), void 0 !== global.setImmediate && (global.setImmediate = global.setImmediate, 
                            global.clearImmediate = global.clearImmediate);
                            var NOOP = function() {}, timeoutResult = setTimeout(NOOP, 0), addTimerReturnsObject = "object" == typeof timeoutResult, hrtimePresent = global.process && "function" == typeof global.process.hrtime;
                            clearTimeout(timeoutResult);
                            var NativeDate = Date, uniqueTimerId = 1, timers = {
                                "setTimeout": setTimeout,
                                "clearTimeout": clearTimeout,
                                "setImmediate": global.setImmediate,
                                "clearImmediate": global.clearImmediate,
                                "setInterval": setInterval,
                                "clearInterval": clearInterval,
                                "Date": Date
                            };
                            hrtimePresent && (timers.hrtime = global.process.hrtime);
                            var keys = Object.keys || function(e) {
                                var t, n = [];
                                for (t in e) e.hasOwnProperty(t) && n.push(t);
                                return n;
                            };
                            exports.timers = timers, exports.createClock = createClock, exports.install = function(e, t, n, r) {
                                var i, o;
                                "number" == typeof e && (n = t, t = e, e = null), e || (e = global);
                                var s = createClock(t, r);
                                for (s.uninstall = function() {
                                    uninstall(s, e);
                                }, s.methods = n || [], 0 === s.methods.length && (s.methods = keys(timers)), i = 0, 
                                o = s.methods.length; i < o; i++) "hrtime" === s.methods[i] ? e.process && "function" == typeof e.process.hrtime && hijackMethod(e.process, s.methods[i], s) : hijackMethod(e, s.methods[i], s);
                                return s;
                            };
                        }(global || this);
                    }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
                }, {} ]
            }, {}, [ 1 ])(1);
        });
    }();
    var define, sinon = function() {
        function e(e, n, r) {
            t = r.exports = e("./sinon/util/core"), e("./sinon/extend"), e("./sinon/walk"), 
            e("./sinon/typeOf"), e("./sinon/times_in_words"), e("./sinon/spy"), e("./sinon/call"), 
            e("./sinon/behavior"), e("./sinon/stub"), e("./sinon/mock"), e("./sinon/collection"), 
            e("./sinon/assert"), e("./sinon/sandbox"), e("./sinon/test"), e("./sinon/test_case"), 
            e("./sinon/match"), e("./sinon/format"), e("./sinon/log_error");
        }
        var t, n = "undefined" != typeof module && module.exports && "function" == typeof require;
        return "function" == typeof define && "object" == typeof define.amd && define.amd ? define(e) : n ? (e(require, module.exports, module), 
        t = module.exports) : t = {}, t;
    }();
    return function(e) {
        function t(e) {
            var t = !1;
            try {
                e.appendChild(c), t = c.parentNode === e;
            } catch (e) {
                return !1;
            } finally {
                try {
                    e.removeChild(c);
                } catch (e) {}
            }
            return t;
        }
        function n(e) {
            return c && e && 1 === e.nodeType && t(e);
        }
        function r(e) {
            return "function" == typeof e || !!(e && e.constructor && e.call && e.apply);
        }
        function i(e) {
            return "number" == typeof e && isNaN(e);
        }
        function o(e, t) {
            for (var n in t) l.call(e, n) || (e[n] = t[n]);
        }
        function s(e) {
            return "function" == typeof e && "function" == typeof e.restore && e.restore.sinon;
        }
        function a(e) {
            return e.wrapMethod = function(t, n, i) {
                function s(e) {
                    var t;
                    if (r(e)) {
                        if (e.restore && e.restore.sinon) t = new TypeError("Attempted to wrap " + n + " which is already wrapped"); else if (e.calledBefore) {
                            var i = e.returns ? "stubbed" : "spied on";
                            t = new TypeError("Attempted to wrap " + n + " which is already " + i);
                        }
                    } else t = new TypeError("Attempted to wrap " + typeof e + " property " + n + " as function");
                    if (t) throw e && e.stackTrace && (t.stack += "\n--------------\n" + e.stackTrace), 
                    t;
                }
                function a() {
                    s(c = t[n]), t[n] = i, i.displayName = n;
                }
                if (!t) throw new TypeError("Should wrap property of object");
                if ("function" != typeof i && "object" != typeof i) throw new TypeError("Method wrapper should be a function or a property descriptor");
                var u, c, f, h = t.hasOwnProperty && t.hasOwnProperty === l ? t.hasOwnProperty(n) : l.call(t, n);
                if (p) {
                    var d = "function" == typeof i ? {
                        "value": i
                    } : i, m = e.getPropertyDescriptor(t, n);
                    if (m ? m.restore && m.restore.sinon && (u = new TypeError("Attempted to wrap " + n + " which is already wrapped")) : u = new TypeError("Attempted to wrap " + typeof c + " property " + n + " as function"), 
                    u) throw m && m.stackTrace && (u.stack += "\n--------------\n" + m.stackTrace), 
                    u;
                    var y = e.objectKeys(d);
                    for (f = 0; f < y.length; f++) s(c = m[y[f]]);
                    for (o(d, m), f = 0; f < y.length; f++) o(d[y[f]], m[y[f]]);
                    Object.defineProperty(t, n, d), "function" == typeof i && t[n] !== i && (delete t[n], 
                    a());
                } else a();
                return i.displayName = n, i.stackTrace = new Error("Stack Trace for original").stack, 
                i.restore = function() {
                    if (h) p && Object.defineProperty(t, n, m); else try {
                        delete t[n];
                    } catch (e) {}
                    p ? e.getPropertyDescriptor(t, n).value === i && (t[n] = c) : t[n] === i && (t[n] = c);
                }, i.restore.sinon = !0, p || o(i, c), i;
            }, e.create = function(e) {
                var t = function() {};
                return t.prototype = e, new t();
            }, e.deepEqual = function t(r, o) {
                if (e.match && e.match.isMatcher(r)) return r.test(o);
                if ("object" != typeof r || "object" != typeof o) return i(r) && i(o) || r === o;
                if (n(r) || n(o)) return r === o;
                if (r === o) return !0;
                if (null === r && null !== o || null !== r && null === o) return !1;
                if (r instanceof RegExp && o instanceof RegExp) return r.source === o.source && r.global === o.global && r.ignoreCase === o.ignoreCase && r.multiline === o.multiline;
                var s = Object.prototype.toString.call(r);
                if (s !== Object.prototype.toString.call(o)) return !1;
                if ("[object Date]" === s) return r.valueOf() === o.valueOf();
                var a, u = 0, c = 0;
                if ("[object Array]" === s && r.length !== o.length) return !1;
                for (a in r) if (l.call(r, a)) {
                    if (u += 1, !(a in o)) return !1;
                    if (!t(r[a], o[a])) return !1;
                }
                for (a in o) l.call(o, a) && (c += 1);
                return u === c;
            }, e.functionName = function(e) {
                var t = e.displayName || e.name;
                if (!t) {
                    var n = e.toString().match(/function ([^\s\(]+)/);
                    t = n && n[1];
                }
                return t;
            }, e.functionToString = function() {
                if (this.getCall && this.callCount) for (var e, t, n = this.callCount; n--; ) {
                    e = this.getCall(n).thisValue;
                    for (t in e) if (e[t] === this) return t;
                }
                return this.displayName || "sinon fake";
            }, e.objectKeys = function(e) {
                if (e !== Object(e)) throw new TypeError("sinon.objectKeys called on a non-object");
                var t, n = [];
                for (t in e) l.call(e, t) && n.push(t);
                return n;
            }, e.getPropertyDescriptor = function(e, t) {
                for (var n, r = e; r && !(n = Object.getOwnPropertyDescriptor(r, t)); ) r = Object.getPrototypeOf(r);
                return n;
            }, e.getConfig = function(t) {
                var n = {};
                t = t || {};
                var r = e.defaultConfig;
                for (var i in r) r.hasOwnProperty(i) && (n[i] = t.hasOwnProperty(i) ? t[i] : r[i]);
                return n;
            }, e.defaultConfig = {
                "injectIntoThis": !0,
                "injectInto": null,
                "properties": [ "spy", "stub", "mock", "clock", "server", "requests" ],
                "useFakeTimers": !0,
                "useFakeServer": !0
            }, e.timesInWords = function(e) {
                return 1 === e && "once" || 2 === e && "twice" || 3 === e && "thrice" || (e || 0) + " times";
            }, e.calledInOrder = function(e) {
                for (var t = 1, n = e.length; t < n; t++) if (!e[t - 1].calledBefore(e[t]) || !e[t].called) return !1;
                return !0;
            }, e.orderByFirstCall = function(e) {
                return e.sort(function(e, t) {
                    var n = e.getCall(0), r = t.getCall(0);
                    return (n && n.callId || -1) < (r && r.callId || -1) ? -1 : 1;
                });
            }, e.createStubInstance = function(t) {
                if ("function" != typeof t) throw new TypeError("The constructor should be a function.");
                return e.stub(e.create(t.prototype));
            }, e.restore = function(e) {
                if (null !== e && "object" == typeof e) for (var t in e) s(e[t]) && e[t].restore(); else s(e) && e.restore();
            }, e;
        }
        function u(e, t) {
            a(t);
        }
        var c = "undefined" != typeof document && document.createElement("div"), l = Object.prototype.hasOwnProperty, p = "keys" in Object, f = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(u) : f ? u(require, module.exports, module) : e && a(e);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e) {
            var t = function() {
                var e = {
                    "constructor": function() {
                        return "0";
                    },
                    "toString": function() {
                        return "1";
                    },
                    "valueOf": function() {
                        return "2";
                    },
                    "toLocaleString": function() {
                        return "3";
                    },
                    "prototype": function() {
                        return "4";
                    },
                    "isPrototypeOf": function() {
                        return "5";
                    },
                    "propertyIsEnumerable": function() {
                        return "6";
                    },
                    "hasOwnProperty": function() {
                        return "7";
                    },
                    "length": function() {
                        return "8";
                    },
                    "unique": function() {
                        return "9";
                    }
                }, t = [];
                for (var n in e) e.hasOwnProperty(n) && t.push(e[n]());
                return "0123456789" !== t.join("");
            }();
            return e.extend = function(e) {
                var n, r, i, o = Array.prototype.slice.call(arguments, 1);
                for (r = 0; r < o.length; r++) {
                    n = o[r];
                    for (i in n) n.hasOwnProperty(i) && (e[i] = n[i]);
                    t && n.hasOwnProperty("toString") && n.toString !== e.toString && (e.toString = n.toString);
                }
                return e;
            }, e.extend;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            r.exports = t(i);
        }
        var r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : r ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e) {
            return e.timesInWords = function(e) {
                switch (e) {
                  case 1:
                    return "once";

                  case 2:
                    return "twice";

                  case 3:
                    return "thrice";

                  default:
                    return (e || 0) + " times";
                }
            }, e.timesInWords;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            r.exports = t(i);
        }
        var r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : r ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e) {
            return e.typeOf = function(e) {
                if (null === e) return "null";
                if (void 0 === e) return "undefined";
                var t = Object.prototype.toString.call(e);
                return t.substring(8, t.length - 1).toLowerCase();
            }, e.typeOf;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            r.exports = t(i);
        }
        var r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : r ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e) {
            function t(t, n, r) {
                var i = e.typeOf(t);
                if (i !== n) throw new TypeError("Expected type of " + r + " to be " + n + ", but was " + i);
            }
            function n(e) {
                return s.isPrototypeOf(e);
            }
            function r(t, i) {
                if (null === i || void 0 === i) return !1;
                for (var o in t) if (t.hasOwnProperty(o)) {
                    var s = t[o], a = i[o];
                    if (n(s)) {
                        if (!s.test(a)) return !1;
                    } else if ("object" === e.typeOf(s)) {
                        if (!r(s, a)) return !1;
                    } else if (!e.deepEqual(s, a)) return !1;
                }
                return !0;
            }
            function i(t, n) {
                var i = e.create(s);
                switch (e.typeOf(t)) {
                  case "object":
                    if ("function" == typeof t.test) return i.test = function(e) {
                        return !0 === t.test(e);
                    }, i.message = "match(" + e.functionName(t.test) + ")", i;
                    var o = [];
                    for (var a in t) t.hasOwnProperty(a) && o.push(a + ": " + t[a]);
                    i.test = function(e) {
                        return r(t, e);
                    }, i.message = "match(" + o.join(", ") + ")";
                    break;

                  case "number":
                    i.test = function(e) {
                        return t == e;
                    };
                    break;

                  case "string":
                    i.test = function(e) {
                        return "string" == typeof e && -1 !== e.indexOf(t);
                    }, i.message = 'match("' + t + '")';
                    break;

                  case "regexp":
                    i.test = function(e) {
                        return "string" == typeof e && t.test(e);
                    };
                    break;

                  case "function":
                    i.test = t, i.message = n || "match(" + e.functionName(t) + ")";
                    break;

                  default:
                    i.test = function(n) {
                        return e.deepEqual(t, n);
                    };
                }
                return i.message || (i.message = "match(" + t + ")"), i;
            }
            function o(n, r) {
                return function(o, s) {
                    t(o, "string", "property");
                    var a = 1 === arguments.length, u = r + '("' + o + '"';
                    return a || (u += ", " + s), u += ")", i(function(t) {
                        return !(void 0 === t || null === t || !n(t, o)) && (a || e.deepEqual(s, t[o]));
                    }, u);
                };
            }
            var s = {
                "toString": function() {
                    return this.message;
                }
            };
            return s.or = function(t) {
                if (!arguments.length) throw new TypeError("Matcher expected");
                n(t) || (t = i(t));
                var r = this, o = e.create(s);
                return o.test = function(e) {
                    return r.test(e) || t.test(e);
                }, o.message = r.message + ".or(" + t.message + ")", o;
            }, s.and = function(t) {
                if (!arguments.length) throw new TypeError("Matcher expected");
                n(t) || (t = i(t));
                var r = this, o = e.create(s);
                return o.test = function(e) {
                    return r.test(e) && t.test(e);
                }, o.message = r.message + ".and(" + t.message + ")", o;
            }, i.isMatcher = n, i.any = i(function() {
                return !0;
            }, "any"), i.defined = i(function(e) {
                return null !== e && void 0 !== e;
            }, "defined"), i.truthy = i(function(e) {
                return !!e;
            }, "truthy"), i.falsy = i(function(e) {
                return !e;
            }, "falsy"), i.same = function(e) {
                return i(function(t) {
                    return e === t;
                }, "same(" + e + ")");
            }, i.typeOf = function(n) {
                return t(n, "string", "type"), i(function(t) {
                    return e.typeOf(t) === n;
                }, 'typeOf("' + n + '")');
            }, i.instanceOf = function(n) {
                return t(n, "function", "type"), i(function(e) {
                    return e instanceof n;
                }, "instanceOf(" + e.functionName(n) + ")");
            }, i.has = o(function(e, t) {
                return "object" == typeof e ? t in e : void 0 !== e[t];
            }, "has"), i.hasOwn = o(function(e, t) {
                return e.hasOwnProperty(t);
            }, "hasOwn"), i.bool = i.typeOf("boolean"), i.number = i.typeOf("number"), i.string = i.typeOf("string"), 
            i.object = i.typeOf("object"), i.func = i.typeOf("function"), i.array = i.typeOf("array"), 
            i.regexp = i.typeOf("regexp"), i.date = i.typeOf("date"), e.match = i, i;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            e("./typeOf"), r.exports = t(i);
        }
        var r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : r ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), function(e, t) {
        function n(e) {
            function n(e) {
                return "" + e;
            }
            var r, i = "undefined" != typeof module && module.exports && "function" == typeof require;
            if (i) try {
                t = require("formatio");
            } catch (e) {}
            return r = t ? function() {
                var e = t.configure({
                    "quoteStrings": !1,
                    "limitChildrenCount": 250
                });
                return function() {
                    return e.ascii.apply(e, arguments);
                };
            }() : i ? function() {
                try {
                    var e = require("util");
                } catch (e) {}
                return e ? function(t) {
                    return "object" == typeof t && t.toString === Object.prototype.toString ? e.inspect(t) : t;
                } : n;
            }() : n, e.format = r, e.format;
        }
        function r(e, t, r) {
            var i = e("./util/core");
            r.exports = n(i);
        }
        var i = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(r) : i ? r(require, module.exports, module) : e && n(e);
    }("object" == typeof sinon && sinon, "object" == typeof formatio && formatio), function(e) {
        function t(e) {
            function t(t, n, i) {
                var o = e.functionName(t) + n;
                throw i.length && (o += " Received [" + r.call(i).join(", ") + "]"), new Error(o);
            }
            function n(t, n, r, o, s, a, u) {
                if ("number" != typeof a) throw new TypeError("Call id is not a number");
                var c = e.create(i);
                return c.proxy = t, c.thisValue = n, c.args = r, c.returnValue = o, c.exception = s, 
                c.callId = a, c.stack = u, c;
            }
            var i = {
                "calledOn": function(t) {
                    return e.match && e.match.isMatcher(t) ? t.test(this.thisValue) : this.thisValue === t;
                },
                "calledWith": function() {
                    var t = arguments.length;
                    if (t > this.args.length) return !1;
                    for (var n = 0; n < t; n += 1) if (!e.deepEqual(arguments[n], this.args[n])) return !1;
                    return !0;
                },
                "calledWithMatch": function() {
                    var t = arguments.length;
                    if (t > this.args.length) return !1;
                    for (var n = 0; n < t; n += 1) {
                        var r = this.args[n], i = arguments[n];
                        if (!e.match || !e.match(i).test(r)) return !1;
                    }
                    return !0;
                },
                "calledWithExactly": function() {
                    return arguments.length === this.args.length && this.calledWith.apply(this, arguments);
                },
                "notCalledWith": function() {
                    return !this.calledWith.apply(this, arguments);
                },
                "notCalledWithMatch": function() {
                    return !this.calledWithMatch.apply(this, arguments);
                },
                "returned": function(t) {
                    return e.deepEqual(t, this.returnValue);
                },
                "threw": function(e) {
                    return void 0 !== e && this.exception ? this.exception === e || this.exception.name === e : !!this.exception;
                },
                "calledWithNew": function() {
                    return this.proxy.prototype && this.thisValue instanceof this.proxy;
                },
                "calledBefore": function(e) {
                    return this.callId < e.callId;
                },
                "calledAfter": function(e) {
                    return this.callId > e.callId;
                },
                "callArg": function(e) {
                    this.args[e]();
                },
                "callArgOn": function(e, t) {
                    this.args[e].apply(t);
                },
                "callArgWith": function(e) {
                    this.callArgOnWith.apply(this, [ e, null ].concat(r.call(arguments, 1)));
                },
                "callArgOnWith": function(e, t) {
                    var n = r.call(arguments, 2);
                    this.args[e].apply(t, n);
                },
                "yield": function() {
                    this.yieldOn.apply(this, [ null ].concat(r.call(arguments, 0)));
                },
                "yieldOn": function(e) {
                    for (var n = this.args, i = 0, o = n.length; i < o; ++i) if ("function" == typeof n[i]) return void n[i].apply(e, r.call(arguments, 1));
                    t(this.proxy, " cannot yield since no callback was passed.", n);
                },
                "yieldTo": function(e) {
                    this.yieldToOn.apply(this, [ e, null ].concat(r.call(arguments, 1)));
                },
                "yieldToOn": function(e, n) {
                    for (var i = this.args, o = 0, s = i.length; o < s; ++o) if (i[o] && "function" == typeof i[o][e]) return void i[o][e].apply(n, r.call(arguments, 2));
                    t(this.proxy, " cannot yield to '" + e + "' since no callback was passed.", i);
                },
                "getStackFrames": function() {
                    return this.stack && this.stack.split("\n").slice(3);
                },
                "toString": function() {
                    var t = this.proxy ? this.proxy.toString() + "(" : "", n = [];
                    if (!this.args) return ":(";
                    for (var r = 0, i = this.args.length; r < i; ++r) n.push(e.format(this.args[r]));
                    return t = t + n.join(", ") + ")", void 0 !== this.returnValue && (t += " => " + e.format(this.returnValue)), 
                    this.exception && (t += " !" + this.exception.name, this.exception.message && (t += "(" + this.exception.message + ")")), 
                    this.stack && (t += this.getStackFrames()[0].replace(/^\s*(?:at\s+|@)?/, " at ")), 
                    t;
                }
            };
            return i.invokeCallback = i.yield, n.toString = i.toString, e.spyCall = n, n;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            e("./match"), e("./format"), r.exports = t(i);
        }
        var r = Array.prototype.slice, i = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : i ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), function(sinonGlobal) {
        function makeApi(sinon) {
            function spy(e, t, n) {
                if (!t && "function" == typeof e) return spy.create(e);
                if (!e && !t) return spy.create(function() {});
                if (n) {
                    for (var r = {}, i = sinon.getPropertyDescriptor(e, t), o = 0; o < n.length; o++) r[n[o]] = spy.create(i[n[o]]);
                    return sinon.wrapMethod(e, t, r);
                }
                return sinon.wrapMethod(e, t, spy.create(e[t]));
            }
            function matchingFake(e, t, n) {
                if (e) for (var r = 0, i = e.length; r < i; r++) if (e[r].matches(t, n)) return e[r];
            }
            function incrementCallCount() {
                this.called = !0, this.callCount += 1, this.notCalled = !1, this.calledOnce = 1 === this.callCount, 
                this.calledTwice = 2 === this.callCount, this.calledThrice = 3 === this.callCount;
            }
            function createCallProperties() {
                this.firstCall = this.getCall(0), this.secondCall = this.getCall(1), this.thirdCall = this.getCall(2), 
                this.lastCall = this.getCall(this.callCount - 1);
            }
            function createProxy(func, proxyLength) {
                var p;
                return proxyLength ? eval("p = (function proxy(" + vars.substring(0, 2 * proxyLength - 1) + ") { return p.invoke(func, this, slice.call(arguments)); });") : p = function() {
                    return p.invoke(func, this, slice.call(arguments));
                }, p.isSinonProxy = !0, p;
            }
            function delegateToCalls(e, t, n, r) {
                spyApi[e] = function() {
                    if (!this.called) return !!r && r.apply(this, arguments);
                    for (var i, o = 0, s = 0, a = this.callCount; s < a; s += 1) if ((i = this.getCall(s))[n || e].apply(i, arguments) && (o += 1, 
                    t)) return !0;
                    return o === this.callCount;
                };
            }
            var push = Array.prototype.push, slice = Array.prototype.slice, callId = 0, vars = "a,b,c,d,e,f,g,h,i,j,k,l", uuid = 0, spyApi = {
                "reset": function() {
                    if (this.invoking) {
                        var e = new Error("Cannot reset Sinon function while invoking it. Move the call to .reset outside of the callback.");
                        throw e.name = "InvalidResetException", e;
                    }
                    if (this.called = !1, this.notCalled = !0, this.calledOnce = !1, this.calledTwice = !1, 
                    this.calledThrice = !1, this.callCount = 0, this.firstCall = null, this.secondCall = null, 
                    this.thirdCall = null, this.lastCall = null, this.args = [], this.returnValues = [], 
                    this.thisValues = [], this.exceptions = [], this.callIds = [], this.stacks = [], 
                    this.fakes) for (var t = 0; t < this.fakes.length; t++) this.fakes[t].reset();
                    return this;
                },
                "create": function(e, t) {
                    var n;
                    "function" != typeof e ? e = function() {} : n = sinon.functionName(e), t || (t = e.length);
                    var r = createProxy(e, t);
                    return sinon.extend(r, spy), delete r.create, sinon.extend(r, e), r.reset(), r.prototype = e.prototype, 
                    r.displayName = n || "spy", r.toString = sinon.functionToString, r.instantiateFake = sinon.spy.create, 
                    r.id = "spy#" + uuid++, r;
                },
                "invoke": function(e, t, n) {
                    var r, i, o = matchingFake(this.fakes, n);
                    incrementCallCount.call(this), push.call(this.thisValues, t), push.call(this.args, n), 
                    push.call(this.callIds, callId++), createCallProperties.call(this);
                    try {
                        this.invoking = !0, i = o ? o.invoke(e, t, n) : (this.func || e).apply(t, n), this.getCall(this.callCount - 1).calledWithNew() && "object" != typeof i && (i = t);
                    } catch (e) {
                        r = e;
                    } finally {
                        delete this.invoking;
                    }
                    if (push.call(this.exceptions, r), push.call(this.returnValues, i), push.call(this.stacks, new Error().stack), 
                    createCallProperties.call(this), void 0 !== r) throw r;
                    return i;
                },
                "named": function(e) {
                    return this.displayName = e, this;
                },
                "getCall": function(e) {
                    return e < 0 || e >= this.callCount ? null : sinon.spyCall(this, this.thisValues[e], this.args[e], this.returnValues[e], this.exceptions[e], this.callIds[e], this.stacks[e]);
                },
                "getCalls": function() {
                    var e, t = [];
                    for (e = 0; e < this.callCount; e++) t.push(this.getCall(e));
                    return t;
                },
                "calledBefore": function(e) {
                    return !!this.called && (!e.called || this.callIds[0] < e.callIds[e.callIds.length - 1]);
                },
                "calledAfter": function(e) {
                    return !(!this.called || !e.called) && this.callIds[this.callCount - 1] > e.callIds[e.callCount - 1];
                },
                "withArgs": function() {
                    var e = slice.call(arguments);
                    if (this.fakes) {
                        var t = matchingFake(this.fakes, e, !0);
                        if (t) return t;
                    } else this.fakes = [];
                    var n = this, r = this.instantiateFake();
                    r.matchingAguments = e, r.parent = this, push.call(this.fakes, r), r.withArgs = function() {
                        return n.withArgs.apply(n, arguments);
                    };
                    for (var i = 0; i < this.args.length; i++) r.matches(this.args[i]) && (incrementCallCount.call(r), 
                    push.call(r.thisValues, this.thisValues[i]), push.call(r.args, this.args[i]), push.call(r.returnValues, this.returnValues[i]), 
                    push.call(r.exceptions, this.exceptions[i]), push.call(r.callIds, this.callIds[i]));
                    return createCallProperties.call(r), r;
                },
                "matches": function(e, t) {
                    var n = this.matchingAguments;
                    if (n.length <= e.length && sinon.deepEqual(n, e.slice(0, n.length))) return !t || n.length === e.length;
                },
                "printf": function(e) {
                    var t, n = this, r = slice.call(arguments, 1);
                    return (e || "").replace(/%(.)/g, function(e, i) {
                        return "function" == typeof (t = spyApi.formatters[i]) ? t.call(null, n, r) : isNaN(parseInt(i, 10)) ? "%" + i : sinon.format(r[i - 1]);
                    });
                }
            };
            return delegateToCalls("calledOn", !0), delegateToCalls("alwaysCalledOn", !1, "calledOn"), 
            delegateToCalls("calledWith", !0), delegateToCalls("calledWithMatch", !0), delegateToCalls("alwaysCalledWith", !1, "calledWith"), 
            delegateToCalls("alwaysCalledWithMatch", !1, "calledWithMatch"), delegateToCalls("calledWithExactly", !0), 
            delegateToCalls("alwaysCalledWithExactly", !1, "calledWithExactly"), delegateToCalls("neverCalledWith", !1, "notCalledWith", function() {
                return !0;
            }), delegateToCalls("neverCalledWithMatch", !1, "notCalledWithMatch", function() {
                return !0;
            }), delegateToCalls("threw", !0), delegateToCalls("alwaysThrew", !1, "threw"), delegateToCalls("returned", !0), 
            delegateToCalls("alwaysReturned", !1, "returned"), delegateToCalls("calledWithNew", !0), 
            delegateToCalls("alwaysCalledWithNew", !1, "calledWithNew"), delegateToCalls("callArg", !1, "callArgWith", function() {
                throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");
            }), spyApi.callArgWith = spyApi.callArg, delegateToCalls("callArgOn", !1, "callArgOnWith", function() {
                throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");
            }), spyApi.callArgOnWith = spyApi.callArgOn, delegateToCalls("yield", !1, "yield", function() {
                throw new Error(this.toString() + " cannot yield since it was not yet invoked.");
            }), spyApi.invokeCallback = spyApi.yield, delegateToCalls("yieldOn", !1, "yieldOn", function() {
                throw new Error(this.toString() + " cannot yield since it was not yet invoked.");
            }), delegateToCalls("yieldTo", !1, "yieldTo", function(e) {
                throw new Error(this.toString() + " cannot yield to '" + e + "' since it was not yet invoked.");
            }), delegateToCalls("yieldToOn", !1, "yieldToOn", function(e) {
                throw new Error(this.toString() + " cannot yield to '" + e + "' since it was not yet invoked.");
            }), spyApi.formatters = {
                "c": function(e) {
                    return sinon.timesInWords(e.callCount);
                },
                "n": function(e) {
                    return e.toString();
                },
                "C": function(e) {
                    for (var t = [], n = 0, r = e.callCount; n < r; ++n) {
                        var i = "    " + e.getCall(n).toString();
                        /\n/.test(t[n - 1]) && (i = "\n" + i), push.call(t, i);
                    }
                    return t.length > 0 ? "\n" + t.join("\n") : "";
                },
                "t": function(e) {
                    for (var t = [], n = 0, r = e.callCount; n < r; ++n) push.call(t, sinon.format(e.thisValues[n]));
                    return t.join(", ");
                },
                "*": function(e, t) {
                    for (var n = [], r = 0, i = t.length; r < i; ++r) push.call(n, sinon.format(t[r]));
                    return n.join(", ");
                }
            }, sinon.extend(spy, spyApi), spy.spyCall = sinon.spyCall, sinon.spy = spy, spy;
        }
        function loadDependencies(e, t, n) {
            var r = e("./util/core");
            e("./call"), e("./extend"), e("./times_in_words"), e("./format"), n.exports = makeApi(r);
        }
        var isNode = "undefined" != typeof module && module.exports && "function" == typeof require, isAMD = "function" == typeof define && "object" == typeof define.amd && define.amd;
        isAMD ? define(loadDependencies) : isNode ? loadDependencies(require, module.exports, module) : sinonGlobal && makeApi(sinonGlobal);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e, t) {
            return "string" == typeof e ? (this.exception = new Error(t || ""), this.exception.name = e) : this.exception = e || new Error("Error"), 
            this;
        }
        function n(e, t) {
            var n = e.callArgAt;
            if (n >= 0) return t[n];
            var r;
            n === a && (r = t), n === u && (r = o.call(t).reverse());
            for (var i = e.callArgProp, s = 0, c = r.length; s < c; ++s) {
                if (!i && "function" == typeof r[s]) return r[s];
                if (i && r[s] && "function" == typeof r[s][i]) return r[s][i];
            }
            return null;
        }
        function r(e) {
            function r(t, n, r) {
                if (t.callArgAt < 0) {
                    var i;
                    return i = t.callArgProp ? e.functionName(t.stub) + " expected to yield to '" + t.callArgProp + "', but no object with such a property was passed." : e.functionName(t.stub) + " expected to yield, but no callback was passed.", 
                    r.length > 0 && (i += " Received [" + s.call(r, ", ") + "]"), i;
                }
                return "argument at index " + t.callArgAt + " is not a function: " + n;
            }
            function i(e, t) {
                if ("number" == typeof e.callArgAt) {
                    var i = n(e, t);
                    if ("function" != typeof i) throw new TypeError(r(e, i, t));
                    e.callbackAsync ? c(function() {
                        i.apply(e.callbackContext, e.callbackArguments);
                    }) : i.apply(e.callbackContext, e.callbackArguments);
                }
            }
            var l = {
                "create": function(t) {
                    var n = e.extend({}, e.behavior);
                    return delete n.create, n.stub = t, n;
                },
                "isPresent": function() {
                    return "number" == typeof this.callArgAt || this.exception || "number" == typeof this.returnArgAt || this.returnThis || this.returnValueDefined;
                },
                "invoke": function(e, t) {
                    if (i(this, t), this.exception) throw this.exception;
                    return "number" == typeof this.returnArgAt ? t[this.returnArgAt] : this.returnThis ? e : this.returnValue;
                },
                "onCall": function(e) {
                    return this.stub.onCall(e);
                },
                "onFirstCall": function() {
                    return this.stub.onFirstCall();
                },
                "onSecondCall": function() {
                    return this.stub.onSecondCall();
                },
                "onThirdCall": function() {
                    return this.stub.onThirdCall();
                },
                "withArgs": function() {
                    throw new Error('Defining a stub by invoking "stub.onCall(...).withArgs(...)" is not supported. Use "stub.withArgs(...).onCall(...)" to define sequential behavior for calls with certain arguments.');
                },
                "callsArg": function(e) {
                    if ("number" != typeof e) throw new TypeError("argument index is not number");
                    return this.callArgAt = e, this.callbackArguments = [], this.callbackContext = void 0, 
                    this.callArgProp = void 0, this.callbackAsync = !1, this;
                },
                "callsArgOn": function(e, t) {
                    if ("number" != typeof e) throw new TypeError("argument index is not number");
                    if ("object" != typeof t) throw new TypeError("argument context is not an object");
                    return this.callArgAt = e, this.callbackArguments = [], this.callbackContext = t, 
                    this.callArgProp = void 0, this.callbackAsync = !1, this;
                },
                "callsArgWith": function(e) {
                    if ("number" != typeof e) throw new TypeError("argument index is not number");
                    return this.callArgAt = e, this.callbackArguments = o.call(arguments, 1), this.callbackContext = void 0, 
                    this.callArgProp = void 0, this.callbackAsync = !1, this;
                },
                "callsArgOnWith": function(e, t) {
                    if ("number" != typeof e) throw new TypeError("argument index is not number");
                    if ("object" != typeof t) throw new TypeError("argument context is not an object");
                    return this.callArgAt = e, this.callbackArguments = o.call(arguments, 2), this.callbackContext = t, 
                    this.callArgProp = void 0, this.callbackAsync = !1, this;
                },
                "yields": function() {
                    return this.callArgAt = a, this.callbackArguments = o.call(arguments, 0), this.callbackContext = void 0, 
                    this.callArgProp = void 0, this.callbackAsync = !1, this;
                },
                "yieldsRight": function() {
                    return this.callArgAt = u, this.callbackArguments = o.call(arguments, 0), this.callbackContext = void 0, 
                    this.callArgProp = void 0, this.callbackAsync = !1, this;
                },
                "yieldsOn": function(e) {
                    if ("object" != typeof e) throw new TypeError("argument context is not an object");
                    return this.callArgAt = a, this.callbackArguments = o.call(arguments, 1), this.callbackContext = e, 
                    this.callArgProp = void 0, this.callbackAsync = !1, this;
                },
                "yieldsTo": function(e) {
                    return this.callArgAt = a, this.callbackArguments = o.call(arguments, 1), this.callbackContext = void 0, 
                    this.callArgProp = e, this.callbackAsync = !1, this;
                },
                "yieldsToOn": function(e, t) {
                    if ("object" != typeof t) throw new TypeError("argument context is not an object");
                    return this.callArgAt = a, this.callbackArguments = o.call(arguments, 2), this.callbackContext = t, 
                    this.callArgProp = e, this.callbackAsync = !1, this;
                },
                "throws": t,
                "throwsException": t,
                "returns": function(e) {
                    return this.returnValue = e, this.returnValueDefined = !0, this.exception = void 0, 
                    this;
                },
                "returnsArg": function(e) {
                    if ("number" != typeof e) throw new TypeError("argument index is not number");
                    return this.returnArgAt = e, this;
                },
                "returnsThis": function() {
                    return this.returnThis = !0, this;
                }
            };
            for (var p in l) l.hasOwnProperty(p) && p.match(/^(callsArg|yields)/) && !p.match(/Async/) && (l[p + "Async"] = function(e) {
                return function() {
                    var t = this[e].apply(this, arguments);
                    return this.callbackAsync = !0, t;
                };
            }(p));
            return e.behavior = l, l;
        }
        function i(e, t, n) {
            var i = e("./util/core");
            e("./extend"), n.exports = r(i);
        }
        var o = Array.prototype.slice, s = Array.prototype.join, a = -1, u = -2, c = "object" == typeof process && "function" == typeof process.nextTick ? process.nextTick : "function" == typeof setImmediate ? setImmediate : function(e) {
            setTimeout(e, 0);
        }, l = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(i) : l ? i(require, module.exports, module) : e && r(e);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e) {
            function t(e, n, r, i, o) {
                var s, a;
                if ("function" == typeof Object.getOwnPropertyNames) Object.getOwnPropertyNames(e).forEach(function(t) {
                    if (!0 !== o[t]) {
                        o[t] = !0;
                        var s = "function" == typeof Object.getOwnPropertyDescriptor(e, t).get ? i : e;
                        n.call(r, s[t], t, s);
                    }
                }), (s = Object.getPrototypeOf(e)) && t(s, n, r, i, o); else for (a in e) n.call(r, e[a], a, e);
            }
            return e.walk = function(e, n, r) {
                return t(e, n, r, e, {});
            }, e.walk;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            r.exports = t(i);
        }
        var r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : r ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e) {
            function t(n, r, i) {
                if (i && "function" != typeof i && "object" != typeof i) throw new TypeError("Custom stub should be a function or a property descriptor");
                var o;
                if (i) {
                    if ("function" == typeof i) o = e.spy && e.spy.create ? e.spy.create(i) : i; else if (o = i, 
                    e.spy && e.spy.create) for (var s = e.objectKeys(o), a = 0; a < s.length; a++) o[s[a]] = e.spy.create(o[s[a]]);
                } else {
                    var u = 0;
                    "object" == typeof n && "function" == typeof n[r] && (u = n[r].length), o = t.create(u);
                }
                return n || void 0 !== r ? void 0 === r && "object" == typeof n ? (e.walk(n || {}, function(r, i, o) {
                    o !== Object.prototype && "constructor" !== i && "function" == typeof e.getPropertyDescriptor(o, i).value && t(n, i);
                }), n) : e.wrapMethod(n, r, o) : e.stub.create();
            }
            function n(e) {
                return e.parent && i(e.parent);
            }
            function r(t) {
                return t.defaultBehavior || n(t) || e.behavior.create(t);
            }
            function i(e) {
                var t = e.behaviors[e.callCount - 1];
                return t && t.isPresent() ? t : r(e);
            }
            var o = 0, s = {
                "create": function(n) {
                    var r = function() {
                        return i(r).invoke(this, arguments);
                    };
                    r.id = "stub#" + o++;
                    var s = r;
                    return r = e.spy.create(r, n), r.func = s, e.extend(r, t), r.instantiateFake = e.stub.create, 
                    r.displayName = "stub", r.toString = e.functionToString, r.defaultBehavior = null, 
                    r.behaviors = [], r;
                },
                "resetBehavior": function() {
                    var e;
                    if (this.defaultBehavior = null, this.behaviors = [], delete this.returnValue, delete this.returnArgAt, 
                    this.returnThis = !1, this.fakes) for (e = 0; e < this.fakes.length; e++) this.fakes[e].resetBehavior();
                },
                "onCall": function(t) {
                    return this.behaviors[t] || (this.behaviors[t] = e.behavior.create(this)), this.behaviors[t];
                },
                "onFirstCall": function() {
                    return this.onCall(0);
                },
                "onSecondCall": function() {
                    return this.onCall(1);
                },
                "onThirdCall": function() {
                    return this.onCall(2);
                }
            };
            for (var a in e.behavior) e.behavior.hasOwnProperty(a) && !s.hasOwnProperty(a) && "create" !== a && "withArgs" !== a && "invoke" !== a && (s[a] = function(t) {
                return function() {
                    return this.defaultBehavior = this.defaultBehavior || e.behavior.create(this), this.defaultBehavior[t].apply(this.defaultBehavior, arguments), 
                    this;
                };
            }(a));
            return e.extend(t, s), e.stub = t, t;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            e("./behavior"), e("./spy"), e("./extend"), r.exports = t(i);
        }
        var r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : r ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e) {
            function t(n) {
                return n ? t.create(n) : e.expectation.create("Anonymous mock");
            }
            function n(e, t) {
                if (e) for (var n = 0, r = e.length; n < r; n += 1) t(e[n]);
            }
            function r(t, n, r) {
                if (r && t.length !== n.length) return !1;
                for (var i = 0, o = t.length; i < o; i++) if (!e.deepEqual(t[i], n[i])) return !1;
                return !0;
            }
            function i(e) {
                return 0 === e ? "never called" : "called " + p(e);
            }
            function o(e) {
                var t = e.minCalls, n = e.maxCalls;
                if ("number" == typeof t && "number" == typeof n) {
                    var r = p(t);
                    return t !== n && (r = "at least " + r + " and at most " + p(n)), r;
                }
                return "number" == typeof t ? "at least " + p(t) : "at most " + p(n);
            }
            function s(e) {
                return !("number" == typeof e.minCalls) || e.callCount >= e.minCalls;
            }
            function a(e) {
                return "number" == typeof e.maxCalls && e.callCount === e.maxCalls;
            }
            function u(e, t) {
                return l && l.isMatcher(e) && e.test(t) || !0;
            }
            var c = [].push, l = e.match;
            e.extend(t, {
                "create": function(n) {
                    if (!n) throw new TypeError("object is null");
                    var r = e.extend({}, t);
                    return r.object = n, delete r.create, r;
                },
                "expects": function(t) {
                    if (!t) throw new TypeError("method is falsy");
                    if (this.expectations || (this.expectations = {}, this.proxies = []), !this.expectations[t]) {
                        this.expectations[t] = [];
                        var n = this;
                        e.wrapMethod(this.object, t, function() {
                            return n.invokeMethod(t, this, arguments);
                        }), c.call(this.proxies, t);
                    }
                    var r = e.expectation.create(t);
                    return c.call(this.expectations[t], r), r;
                },
                "restore": function() {
                    var e = this.object;
                    n(this.proxies, function(t) {
                        "function" == typeof e[t].restore && e[t].restore();
                    });
                },
                "verify": function() {
                    var t = this.expectations || {}, r = [], i = [];
                    return n(this.proxies, function(e) {
                        n(t[e], function(e) {
                            e.met() ? c.call(i, e.toString()) : c.call(r, e.toString());
                        });
                    }), this.restore(), r.length > 0 ? e.expectation.fail(r.concat(i).join("\n")) : i.length > 0 && e.expectation.pass(r.concat(i).join("\n")), 
                    !0;
                },
                "invokeMethod": function(t, n, i) {
                    var o, s, a = this.expectations && this.expectations[t] ? this.expectations[t] : [], u = [], l = i || [];
                    for (o = 0; o < a.length; o += 1) r(a[o].expectedArguments || [], l, a[o].expectsExactArgCount) && u.push(a[o]);
                    for (o = 0; o < u.length; o += 1) if (!u[o].met() && u[o].allowsCall(n, i)) return u[o].apply(n, i);
                    var p = [], f = 0;
                    for (o = 0; o < u.length; o += 1) u[o].allowsCall(n, i) ? s = s || u[o] : f += 1;
                    if (s && 0 === f) return s.apply(n, i);
                    for (o = 0; o < a.length; o += 1) c.call(p, "    " + a[o].toString());
                    p.unshift("Unexpected call: " + e.spyCall.toString.call({
                        "proxy": t,
                        "args": i
                    })), e.expectation.fail(p.join("\n"));
                }
            });
            var p = e.timesInWords, f = Array.prototype.slice;
            return e.expectation = {
                "minCalls": 1,
                "maxCalls": 1,
                "create": function(t) {
                    var n = e.extend(e.stub.create(), e.expectation);
                    return delete n.create, n.method = t, n;
                },
                "invoke": function(t, n, r) {
                    return this.verifyCallAllowed(n, r), e.spy.invoke.apply(this, arguments);
                },
                "atLeast": function(e) {
                    if ("number" != typeof e) throw new TypeError("'" + e + "' is not number");
                    return this.limitsSet || (this.maxCalls = null, this.limitsSet = !0), this.minCalls = e, 
                    this;
                },
                "atMost": function(e) {
                    if ("number" != typeof e) throw new TypeError("'" + e + "' is not number");
                    return this.limitsSet || (this.minCalls = null, this.limitsSet = !0), this.maxCalls = e, 
                    this;
                },
                "never": function() {
                    return this.exactly(0);
                },
                "once": function() {
                    return this.exactly(1);
                },
                "twice": function() {
                    return this.exactly(2);
                },
                "thrice": function() {
                    return this.exactly(3);
                },
                "exactly": function(e) {
                    if ("number" != typeof e) throw new TypeError("'" + e + "' is not a number");
                    return this.atLeast(e), this.atMost(e);
                },
                "met": function() {
                    return !this.failed && s(this);
                },
                "verifyCallAllowed": function(t, n) {
                    if (a(this) && (this.failed = !0, e.expectation.fail(this.method + " already called " + p(this.maxCalls))), 
                    "expectedThis" in this && this.expectedThis !== t && e.expectation.fail(this.method + " called with " + t + " as thisValue, expected " + this.expectedThis), 
                    "expectedArguments" in this) {
                        n || e.expectation.fail(this.method + " received no arguments, expected " + e.format(this.expectedArguments)), 
                        n.length < this.expectedArguments.length && e.expectation.fail(this.method + " received too few arguments (" + e.format(n) + "), expected " + e.format(this.expectedArguments)), 
                        this.expectsExactArgCount && n.length !== this.expectedArguments.length && e.expectation.fail(this.method + " received too many arguments (" + e.format(n) + "), expected " + e.format(this.expectedArguments));
                        for (var r = 0, i = this.expectedArguments.length; r < i; r += 1) u(this.expectedArguments[r], n[r]) || e.expectation.fail(this.method + " received wrong arguments " + e.format(n) + ", didn't match " + this.expectedArguments.toString()), 
                        e.deepEqual(this.expectedArguments[r], n[r]) || e.expectation.fail(this.method + " received wrong arguments " + e.format(n) + ", expected " + e.format(this.expectedArguments));
                    }
                },
                "allowsCall": function(t, n) {
                    if (this.met() && a(this)) return !1;
                    if ("expectedThis" in this && this.expectedThis !== t) return !1;
                    if (!("expectedArguments" in this)) return !0;
                    if ((n = n || []).length < this.expectedArguments.length) return !1;
                    if (this.expectsExactArgCount && n.length !== this.expectedArguments.length) return !1;
                    for (var r = 0, i = this.expectedArguments.length; r < i; r += 1) {
                        if (!u(this.expectedArguments[r], n[r])) return !1;
                        if (!e.deepEqual(this.expectedArguments[r], n[r])) return !1;
                    }
                    return !0;
                },
                "withArgs": function() {
                    return this.expectedArguments = f.call(arguments), this;
                },
                "withExactArgs": function() {
                    return this.withArgs.apply(this, arguments), this.expectsExactArgCount = !0, this;
                },
                "on": function(e) {
                    return this.expectedThis = e, this;
                },
                "toString": function() {
                    var t = (this.expectedArguments || []).slice();
                    this.expectsExactArgCount || c.call(t, "[...]");
                    var n = e.spyCall.toString.call({
                        "proxy": this.method || "anonymous mock expectation",
                        "args": t
                    }).replace(", [...", "[, ...") + " " + o(this);
                    return this.met() ? "Expectation met: " + n : "Expected " + n + " (" + i(this.callCount) + ")";
                },
                "verify": function() {
                    return this.met() ? e.expectation.pass(this.toString()) : e.expectation.fail(this.toString()), 
                    !0;
                },
                "pass": function(t) {
                    e.assert.pass(t);
                },
                "fail": function(e) {
                    var t = new Error(e);
                    throw t.name = "ExpectationError", t;
                }
            }, e.mock = t, t;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            e("./times_in_words"), e("./call"), e("./extend"), e("./match"), e("./spy"), e("./stub"), 
            e("./format"), r.exports = t(i);
        }
        var r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : r ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e) {
            return e.fakes || (e.fakes = []), e.fakes;
        }
        function n(e, n) {
            for (var r = t(e), i = 0, o = r.length; i < o; i += 1) "function" == typeof r[i][n] && r[i][n]();
        }
        function r(e) {
            for (var n = t(e); 0 < n.length; ) n.splice(0, 1);
        }
        function i(e) {
            var i = {
                "verify": function() {
                    n(this, "verify");
                },
                "restore": function() {
                    n(this, "restore"), r(this);
                },
                "reset": function() {
                    n(this, "reset");
                },
                "verifyAndRestore": function() {
                    var e;
                    try {
                        this.verify();
                    } catch (t) {
                        e = t;
                    }
                    if (this.restore(), e) throw e;
                },
                "add": function(e) {
                    return s.call(t(this), e), e;
                },
                "spy": function() {
                    return this.add(e.spy.apply(e, arguments));
                },
                "stub": function(t, n, r) {
                    if (n) {
                        var i = t[n];
                        if ("function" != typeof i) {
                            if (!a.call(t, n)) throw new TypeError("Cannot stub non-existent own property " + n);
                            return t[n] = r, this.add({
                                "restore": function() {
                                    t[n] = i;
                                }
                            });
                        }
                    }
                    if (!n && t && "object" == typeof t) {
                        var o = e.stub.apply(e, arguments);
                        for (var s in o) "function" == typeof o[s] && this.add(o[s]);
                        return o;
                    }
                    return this.add(e.stub.apply(e, arguments));
                },
                "mock": function() {
                    return this.add(e.mock.apply(e, arguments));
                },
                "inject": function(e) {
                    var t = this;
                    return e.spy = function() {
                        return t.spy.apply(t, arguments);
                    }, e.stub = function() {
                        return t.stub.apply(t, arguments);
                    }, e.mock = function() {
                        return t.mock.apply(t, arguments);
                    }, e;
                }
            };
            return e.collection = i, i;
        }
        function o(e, t, n) {
            var r = e("./util/core");
            e("./mock"), e("./spy"), e("./stub"), n.exports = i(r);
        }
        var s = [].push, a = Object.prototype.hasOwnProperty, u = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(o) : u ? o(require, module.exports, module) : e && i(e);
    }("object" == typeof sinon && sinon), function() {
        function e(e, t) {
            var n = void 0 !== lolex ? lolex : t;
            e.useFakeTimers = function() {
                var e, t = Array.prototype.slice.call(arguments);
                e = "string" == typeof t[0] ? 0 : t.shift();
                var r = n.install(e || 0, t);
                return r.restore = r.uninstall, r;
            }, e.clock = {
                "create": function(e) {
                    return n.createClock(e);
                }
            }, e.timers = {
                "setTimeout": setTimeout,
                "clearTimeout": clearTimeout,
                "setImmediate": "undefined" != typeof setImmediate ? setImmediate : void 0,
                "clearImmediate": "undefined" != typeof clearImmediate ? clearImmediate : void 0,
                "setInterval": setInterval,
                "clearInterval": clearInterval,
                "Date": Date
            };
        }
        function t(t, n, r, i) {
            var o = t("./core");
            e(o, i), r.exports = o;
        }
        var n = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(t) : n ? t(require, module.exports, module, require("lolex")) : e(sinon);
    }(), void 0 === sinon && (this.sinon = {}), function() {
        function e(e) {
            e.Event = function(e, t, n, r) {
                this.initEvent(e, t, n, r);
            }, e.Event.prototype = {
                "initEvent": function(e, t, n, r) {
                    this.type = e, this.bubbles = t, this.cancelable = n, this.target = r;
                },
                "stopPropagation": function() {},
                "preventDefault": function() {
                    this.defaultPrevented = !0;
                }
            }, e.ProgressEvent = function(e, t, n) {
                this.initEvent(e, !1, !1, n), this.loaded = "number" == typeof t.loaded ? t.loaded : null, 
                this.total = "number" == typeof t.total ? t.total : null, this.lengthComputable = !!t.total;
            }, e.ProgressEvent.prototype = new e.Event(), e.ProgressEvent.prototype.constructor = e.ProgressEvent, 
            e.CustomEvent = function(e, t, n) {
                this.initEvent(e, !1, !1, n), this.detail = t.detail || null;
            }, e.CustomEvent.prototype = new e.Event(), e.CustomEvent.prototype.constructor = e.CustomEvent, 
            e.EventTarget = {
                "addEventListener": function(e, t) {
                    this.eventListeners = this.eventListeners || {}, this.eventListeners[e] = this.eventListeners[e] || [], 
                    n.call(this.eventListeners[e], t);
                },
                "removeEventListener": function(e, t) {
                    for (var n = this.eventListeners && this.eventListeners[e] || [], r = 0, i = n.length; r < i; ++r) if (n[r] === t) return n.splice(r, 1);
                },
                "dispatchEvent": function(e) {
                    for (var t = e.type, n = this.eventListeners && this.eventListeners[t] || [], r = 0; r < n.length; r++) "function" == typeof n[r] ? n[r].call(this, e) : n[r].handleEvent(e);
                    return !!e.defaultPrevented;
                }
            };
        }
        function t(t) {
            e(t("./core"));
        }
        var n = [].push, r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(t) : r ? t(require) : e(sinon);
    }(), function(e) {
        function t(e) {
            function t(n, r) {
                function i() {
                    throw r.message = o + r.message, r;
                }
                var o = n + " threw exception: ";
                e.log(o + "[" + r.name + "] " + r.message), r.stack && e.log(r.stack), t.useImmediateExceptions ? i() : t.setTimeout(i, 0);
            }
            t.useImmediateExceptions = !1, t.setTimeout = function(e, t) {
                r(e, t);
            };
            var n = {};
            return n.log = e.log = function() {}, n.logError = e.logError = t, n;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            r.exports = t(i);
        }
        var r = setTimeout, i = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : i ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), void 0 === sinon && (void 0 === this ? getGlobal().sinon = {} : this.sinon = {}), 
    function(e) {
        function t(t) {
            function n() {
                this.readyState = n.UNSENT, this.requestBody = null, this.requestHeaders = {}, this.status = 0, 
                this.timeout = null, "function" == typeof n.onCreate && n.onCreate(this);
            }
            function i(e) {
                if (e.readyState !== n.OPENED) throw new Error("INVALID_STATE_ERR");
                if (e.sendFlag) throw new Error("INVALID_STATE_ERR");
            }
            function o(e) {
                if (e.readyState === n.UNSENT) throw new Error("Request not sent");
                if (e.readyState === n.DONE) throw new Error("Request done");
            }
            function s(e) {
                if ("string" != typeof e) {
                    var t = new Error("Attempted to respond to fake XDomainRequest with " + e + ", which is not a string.");
                    throw t.name = "InvalidBodyException", t;
                }
            }
            t.xdr = r, t.extend(n.prototype, t.EventTarget, {
                "open": function(e, t) {
                    this.method = e, this.url = t, this.responseText = null, this.sendFlag = !1, this.readyStateChange(n.OPENED);
                },
                "readyStateChange": function(e) {
                    this.readyState = e;
                    var r = "";
                    switch (this.readyState) {
                      case n.UNSENT:
                      case n.OPENED:
                        break;

                      case n.LOADING:
                        this.sendFlag && (r = "onprogress");
                        break;

                      case n.DONE:
                        r = this.isTimeout ? "ontimeout" : this.errorFlag || this.status < 200 || this.status > 299 ? "onerror" : "onload";
                    }
                    if (r && "function" == typeof this[r]) try {
                        this[r]();
                    } catch (e) {
                        t.logError("Fake XHR " + r + " handler", e);
                    }
                },
                "send": function(e) {
                    i(this), /^(get|head)$/i.test(this.method) || (this.requestBody = e), this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8", 
                    this.errorFlag = !1, this.sendFlag = !0, this.readyStateChange(n.OPENED), "function" == typeof this.onSend && this.onSend(this);
                },
                "abort": function() {
                    this.aborted = !0, this.responseText = null, this.errorFlag = !0, this.readyState > t.FakeXDomainRequest.UNSENT && this.sendFlag && (this.readyStateChange(t.FakeXDomainRequest.DONE), 
                    this.sendFlag = !1);
                },
                "setResponseBody": function(e) {
                    o(this), s(e);
                    var t = this.chunkSize || 10, r = 0;
                    this.responseText = "";
                    do {
                        this.readyStateChange(n.LOADING), this.responseText += e.substring(r, r + t), r += t;
                    } while (r < e.length);
                    this.readyStateChange(n.DONE);
                },
                "respond": function(e, t, n) {
                    this.status = "number" == typeof e ? e : 200, this.setResponseBody(n || "");
                },
                "simulatetimeout": function() {
                    this.status = 0, this.isTimeout = !0, this.responseText = void 0, this.readyStateChange(n.DONE);
                }
            }), t.extend(n, {
                "UNSENT": 0,
                "OPENED": 1,
                "LOADING": 3,
                "DONE": 4
            }), t.useFakeXDomainRequest = function() {
                return t.FakeXDomainRequest.restore = function(n) {
                    r.supportsXDR && (e.XDomainRequest = r.GlobalXDomainRequest), delete t.FakeXDomainRequest.restore, 
                    !0 !== n && delete t.FakeXDomainRequest.onCreate;
                }, r.supportsXDR && (e.XDomainRequest = t.FakeXDomainRequest), t.FakeXDomainRequest;
            }, t.FakeXDomainRequest = n;
        }
        function n(e, n, r) {
            var i = e("./core");
            e("../extend"), e("./event"), e("../log_error"), t(i), r.exports = i;
        }
        var r = {
            "XDomainRequest": e.XDomainRequest
        };
        r.GlobalXDomainRequest = e.XDomainRequest, r.supportsXDR = void 0 !== r.GlobalXDomainRequest, 
        r.workingXDR = !!r.supportsXDR && r.GlobalXDomainRequest;
        var i = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : i ? n(require, module.exports, module) : t(sinon);
    }("undefined" != typeof global ? global : self), function(e, t) {
        function n() {
            this.eventListeners = {
                "abort": [],
                "error": [],
                "load": [],
                "loadend": [],
                "progress": []
            };
        }
        function r() {
            this.readyState = r.UNSENT, this.requestHeaders = {}, this.requestBody = null, this.status = 0, 
            this.statusText = "", this.upload = new n(), this.responseType = "", this.response = "", 
            C.supportsCORS && (this.withCredentials = !1);
            for (var e = this, t = [ "loadstart", "load", "abort", "error", "loadend" ], i = t.length - 1; i >= 0; i--) !function(t) {
                e.addEventListener(t, function(n) {
                    var r = e["on" + t];
                    r && "function" == typeof r && r.call(this, n);
                });
            }(t[i]);
            "function" == typeof r.onCreate && r.onCreate(this);
        }
        function i(e) {
            if (e.readyState !== r.OPENED) throw new Error("INVALID_STATE_ERR");
            if (e.sendFlag) throw new Error("INVALID_STATE_ERR");
        }
        function o(e, t) {
            t = t.toLowerCase();
            for (var n in e) if (n.toLowerCase() === t) return n;
            return null;
        }
        function s(e, t) {
            if (e) for (var n = 0, r = e.length; n < r; n += 1) t(e[n]);
        }
        function a(e, t) {
            for (var n = 0; n < e.length; n++) if (!0 === t(e[n])) return !0;
            return !1;
        }
        function u(e) {
            if (e.readyState !== r.OPENED) throw new Error("INVALID_STATE_ERR - " + e.readyState);
        }
        function c(e) {
            if (e.readyState === r.DONE) throw new Error("Request done");
        }
        function l(e) {
            if (e.async && e.readyState !== r.HEADERS_RECEIVED) throw new Error("No headers received");
        }
        function p(e) {
            if ("string" != typeof e) {
                var t = new Error("Attempted to respond to fake XMLHttpRequest with " + e + ", which is not a string.");
                throw t.name = "InvalidBodyException", t;
            }
        }
        function f(e) {
            for (var t = new ArrayBuffer(e.length), n = new Uint8Array(t), r = 0; r < e.length; r++) {
                var i = e.charCodeAt(r);
                if (i >= 256) throw new TypeError("arraybuffer or blob responseTypes require binary string, invalid character " + e[r] + " found.");
                n[r] = i;
            }
            return t;
        }
        function h(e) {
            return !e || /(text\/xml)|(application\/xml)|(\+xml)/.test(e);
        }
        function d(e, t, n) {
            if ("" === e || "text" === e) return n;
            if (w && "arraybuffer" === e) return f(n);
            if ("json" === e) try {
                return JSON.parse(n);
            } catch (e) {
                return null;
            } else {
                if (E && "blob" === e) {
                    var i = {};
                    return t && (i.type = t), new Blob([ f(n) ], i);
                }
                if ("document" === e) return h(t) ? r.parseXML(n) : null;
            }
            throw new Error("Invalid responseType " + e);
        }
        function m(e) {
            "" === e.responseType || "text" === e.responseType ? e.response = e.responseText = "" : e.response = e.responseText = null, 
            e.responseXML = null;
        }
        function y(e) {
            e.xhr = C, e.extend(r.prototype, e.EventTarget, {
                "async": !0,
                "open": function(e, t, n, i, o) {
                    if (this.method = e, this.url = t, this.async = "boolean" != typeof n || n, this.username = i, 
                    this.password = o, m(this), this.requestHeaders = {}, this.sendFlag = !1, !0 === r.useFilters) {
                        var s = arguments;
                        if (a(r.filters, function(e) {
                            return e.apply(this, s);
                        })) return r.defake(this, arguments);
                    }
                    this.readyStateChange(r.OPENED);
                },
                "readyStateChange": function(t) {
                    this.readyState = t;
                    var n, i, o = new e.Event("readystatechange", !1, !1, this);
                    if ("function" == typeof this.onreadystatechange) try {
                        this.onreadystatechange(o);
                    } catch (t) {
                        e.logError("Fake XHR onreadystatechange handler", t);
                    }
                    this.readyState === r.DONE && (i = {
                        "loaded": this.progress || 0,
                        "total": this.progress || 0
                    }, n = 0 === this.status ? this.aborted ? "abort" : "error" : "load", v && (this.upload.dispatchEvent(new e.ProgressEvent("progress", i, this)), 
                    this.upload.dispatchEvent(new e.ProgressEvent(n, i, this)), this.upload.dispatchEvent(new e.ProgressEvent("loadend", i, this))), 
                    this.dispatchEvent(new e.ProgressEvent("progress", i, this)), this.dispatchEvent(new e.ProgressEvent(n, i, this)), 
                    this.dispatchEvent(new e.ProgressEvent("loadend", i, this))), this.dispatchEvent(o);
                },
                "setRequestHeader": function(e, t) {
                    if (i(this), _[e] || /^(Sec-|Proxy-)/.test(e)) throw new Error('Refused to set unsafe header "' + e + '"');
                    this.requestHeaders[e] ? this.requestHeaders[e] += "," + t : this.requestHeaders[e] = t;
                },
                "setResponseHeaders": function(e) {
                    u(this), this.responseHeaders = {};
                    for (var t in e) e.hasOwnProperty(t) && (this.responseHeaders[t] = e[t]);
                    this.async ? this.readyStateChange(r.HEADERS_RECEIVED) : this.readyState = r.HEADERS_RECEIVED;
                },
                "send": function(t) {
                    if (i(this), !/^(get|head)$/i.test(this.method)) {
                        var n = o(this.requestHeaders, "Content-Type");
                        if (this.requestHeaders[n]) {
                            var s = this.requestHeaders[n].split(";");
                            this.requestHeaders[n] = s[0] + ";charset=utf-8";
                        } else !b || t instanceof FormData || (this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8");
                        this.requestBody = t;
                    }
                    this.errorFlag = !1, this.sendFlag = this.async, m(this), this.readyStateChange(r.OPENED), 
                    "function" == typeof this.onSend && this.onSend(this), this.dispatchEvent(new e.Event("loadstart", !1, !1, this));
                },
                "abort": function() {
                    this.aborted = !0, m(this), this.errorFlag = !0, this.requestHeaders = {}, this.responseHeaders = {}, 
                    this.readyState > r.UNSENT && this.sendFlag && (this.readyStateChange(r.DONE), this.sendFlag = !1), 
                    this.readyState = r.UNSENT;
                },
                "error": function() {
                    m(this), this.errorFlag = !0, this.requestHeaders = {}, this.responseHeaders = {}, 
                    this.readyStateChange(r.DONE);
                },
                "getResponseHeader": function(e) {
                    return this.readyState < r.HEADERS_RECEIVED ? null : /^Set-Cookie2?$/i.test(e) ? null : (e = o(this.responseHeaders, e), 
                    this.responseHeaders[e] || null);
                },
                "getAllResponseHeaders": function() {
                    if (this.readyState < r.HEADERS_RECEIVED) return "";
                    var e = "";
                    for (var t in this.responseHeaders) this.responseHeaders.hasOwnProperty(t) && !/^Set-Cookie2?$/i.test(t) && (e += t + ": " + this.responseHeaders[t] + "\r\n");
                    return e;
                },
                "setResponseBody": function(e) {
                    c(this), l(this), p(e);
                    var t = this.getResponseHeader("Content-Type"), n = "" === this.responseType || "text" === this.responseType;
                    if (m(this), this.async) {
                        var i = this.chunkSize || 10, o = 0;
                        do {
                            this.readyStateChange(r.LOADING), n && (this.responseText = this.response += e.substring(o, o + i)), 
                            o += i;
                        } while (o < e.length);
                    }
                    this.response = d(this.responseType, t, e), n && (this.responseText = this.response), 
                    "document" === this.responseType ? this.responseXML = this.response : "" === this.responseType && h(t) && (this.responseXML = r.parseXML(this.responseText)), 
                    this.progress = e.length, this.readyStateChange(r.DONE);
                },
                "respond": function(e, t, n) {
                    this.status = "number" == typeof e ? e : 200, this.statusText = r.statusCodes[this.status], 
                    this.setResponseHeaders(t || {}), this.setResponseBody(n || "");
                },
                "uploadProgress": function(t) {
                    v && this.upload.dispatchEvent(new e.ProgressEvent("progress", t));
                },
                "downloadProgress": function(t) {
                    v && this.dispatchEvent(new e.ProgressEvent("progress", t));
                },
                "uploadError": function(t) {
                    x && this.upload.dispatchEvent(new e.CustomEvent("error", {
                        "detail": t
                    }));
                }
            }), e.extend(r, {
                "UNSENT": 0,
                "OPENED": 1,
                "HEADERS_RECEIVED": 2,
                "LOADING": 3,
                "DONE": 4
            }), e.useFakeXMLHttpRequest = function() {
                return r.restore = function(e) {
                    C.supportsXHR && (t.XMLHttpRequest = C.GlobalXMLHttpRequest), C.supportsActiveX && (t.ActiveXObject = C.GlobalActiveXObject), 
                    delete r.restore, !0 !== e && delete r.onCreate;
                }, C.supportsXHR && (t.XMLHttpRequest = r), C.supportsActiveX && (t.ActiveXObject = function(e) {
                    return "Microsoft.XMLHTTP" === e || /^Msxml2\.XMLHTTP/i.test(e) ? new r() : new C.GlobalActiveXObject(e);
                }), r;
            }, e.FakeXMLHttpRequest = r;
        }
        function g(e, t, n) {
            var r = e("./core");
            e("../extend"), e("./event"), e("../log_error"), y(r), n.exports = r;
        }
        var v = "undefined" != typeof ProgressEvent, x = "undefined" != typeof CustomEvent, b = "undefined" != typeof FormData, w = "undefined" != typeof ArrayBuffer, E = function() {
            try {
                return !!new Blob();
            } catch (e) {
                return !1;
            }
        }(), C = {
            "XMLHttpRequest": t.XMLHttpRequest
        };
        C.GlobalXMLHttpRequest = t.XMLHttpRequest, C.GlobalActiveXObject = t.ActiveXObject, 
        C.supportsActiveX = void 0 !== C.GlobalActiveXObject, C.supportsXHR = void 0 !== C.GlobalXMLHttpRequest, 
        C.workingXHR = function(e) {
            return void 0 !== e.XMLHttpRequest ? e.XMLHttpRequest : !(void 0 === e.ActiveXObject) && function() {
                return new e.ActiveXObject("MSXML2.XMLHTTP.3.0");
            };
        }(t), C.supportsCORS = C.supportsXHR && "withCredentials" in new C.GlobalXMLHttpRequest();
        var _ = {
            "Accept-Charset": !0,
            "Accept-Encoding": !0,
            "Connection": !0,
            "Content-Length": !0,
            "Cookie": !0,
            "Cookie2": !0,
            "Content-Transfer-Encoding": !0,
            "Date": !0,
            "Expect": !0,
            "Host": !0,
            "Keep-Alive": !0,
            "Referer": !0,
            "TE": !0,
            "Trailer": !0,
            "Transfer-Encoding": !0,
            "Upgrade": !0,
            "User-Agent": !0,
            "Via": !0
        };
        n.prototype.addEventListener = function(e, t) {
            this.eventListeners[e].push(t);
        }, n.prototype.removeEventListener = function(e, t) {
            for (var n = this.eventListeners[e] || [], r = 0, i = n.length; r < i; ++r) if (n[r] === t) return n.splice(r, 1);
        }, n.prototype.dispatchEvent = function(e) {
            for (var t, n = this.eventListeners[e.type] || [], r = 0; null != (t = n[r]); r++) t(e);
        };
        var T = function(e, t, n) {
            switch (n.length) {
              case 0:
                return e[t]();

              case 1:
                return e[t](n[0]);

              case 2:
                return e[t](n[0], n[1]);

              case 3:
                return e[t](n[0], n[1], n[2]);

              case 4:
                return e[t](n[0], n[1], n[2], n[3]);

              case 5:
                return e[t](n[0], n[1], n[2], n[3], n[4]);
            }
        };
        r.filters = [], r.addFilter = function(e) {
            this.filters.push(e);
        };
        var A = /MSIE 6/;
        r.defake = function(e, t) {
            var n = new C.workingXHR();
            s([ "open", "setRequestHeader", "send", "abort", "getResponseHeader", "getAllResponseHeaders", "addEventListener", "overrideMimeType", "removeEventListener" ], function(t) {
                e[t] = function() {
                    return T(n, t, arguments);
                };
            });
            var i = function(t) {
                s(t, function(t) {
                    try {
                        e[t] = n[t];
                    } catch (e) {
                        if (!A.test(navigator.userAgent)) throw e;
                    }
                });
            }, o = function() {
                e.readyState = n.readyState, n.readyState >= r.HEADERS_RECEIVED && i([ "status", "statusText" ]), 
                n.readyState >= r.LOADING && i([ "responseText", "response" ]), n.readyState === r.DONE && i([ "responseXML" ]), 
                e.onreadystatechange && e.onreadystatechange.call(e, {
                    "target": e
                });
            };
            if (n.addEventListener) {
                for (var a in e.eventListeners) e.eventListeners.hasOwnProperty(a) && s(e.eventListeners[a], function(e) {
                    n.addEventListener(a, e);
                });
                n.addEventListener("readystatechange", o);
            } else n.onreadystatechange = o;
            T(n, "open", t);
        }, r.useFilters = !1, r.parseXML = function(e) {
            if ("" !== e) try {
                if ("undefined" != typeof DOMParser) return new DOMParser().parseFromString(e, "text/xml");
                var t = new window.ActiveXObject("Microsoft.XMLDOM");
                return t.async = "false", t.loadXML(e), t;
            } catch (e) {}
            return null;
        }, r.statusCodes = {
            "100": "Continue",
            "101": "Switching Protocols",
            "200": "OK",
            "201": "Created",
            "202": "Accepted",
            "203": "Non-Authoritative Information",
            "204": "No Content",
            "205": "Reset Content",
            "206": "Partial Content",
            "207": "Multi-Status",
            "300": "Multiple Choice",
            "301": "Moved Permanently",
            "302": "Found",
            "303": "See Other",
            "304": "Not Modified",
            "305": "Use Proxy",
            "307": "Temporary Redirect",
            "400": "Bad Request",
            "401": "Unauthorized",
            "402": "Payment Required",
            "403": "Forbidden",
            "404": "Not Found",
            "405": "Method Not Allowed",
            "406": "Not Acceptable",
            "407": "Proxy Authentication Required",
            "408": "Request Timeout",
            "409": "Conflict",
            "410": "Gone",
            "411": "Length Required",
            "412": "Precondition Failed",
            "413": "Request Entity Too Large",
            "414": "Request-URI Too Long",
            "415": "Unsupported Media Type",
            "416": "Requested Range Not Satisfiable",
            "417": "Expectation Failed",
            "422": "Unprocessable Entity",
            "500": "Internal Server Error",
            "501": "Not Implemented",
            "502": "Bad Gateway",
            "503": "Service Unavailable",
            "504": "Gateway Timeout",
            "505": "HTTP Version Not Supported"
        };
        var S = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(g) : S ? g(require, module.exports, module) : e && y(e);
    }("object" == typeof sinon && sinon, "undefined" != typeof global ? global : self), 
    function() {
        function e(e) {
            var t = e;
            if ("[object Array]" !== Object.prototype.toString.call(e) && (t = [ 200, {}, e ]), 
            "string" != typeof t[2]) throw new TypeError("Fake server response body should be string, but was " + typeof t[2]);
            return t;
        }
        function t(e, t, n) {
            var r = e.method, i = !r || r.toLowerCase() === t.toLowerCase(), o = e.url, s = !o || o === n || "function" == typeof o.test && o.test(n);
            return i && s;
        }
        function n(e, n) {
            var r = n.url;
            if (/^https?:\/\//.test(r) && !a.test(r) || (r = r.replace(a, "")), t(e, this.getHTTPMethod(n), r)) {
                if ("function" == typeof e.response) {
                    var i = e.url, o = [ n ].concat(i && "function" == typeof i.exec ? i.exec(r).slice(1) : []);
                    return e.response.apply(e, o);
                }
                return !0;
            }
            return !1;
        }
        function r(t) {
            t.fakeServer = {
                "create": function(e) {
                    var n = t.create(this);
                    return n.configure(e), t.xhr.supportsCORS ? this.xhr = t.useFakeXMLHttpRequest() : this.xhr = t.useFakeXDomainRequest(), 
                    n.requests = [], this.xhr.onCreate = function(e) {
                        n.addRequest(e);
                    }, n;
                },
                "configure": function(e) {
                    var t, n = {
                        "autoRespond": !0,
                        "autoRespondAfter": !0,
                        "respondImmediately": !0,
                        "fakeHTTPMethods": !0
                    };
                    e = e || {};
                    for (t in e) n.hasOwnProperty(t) && e.hasOwnProperty(t) && (this[t] = e[t]);
                },
                "addRequest": function(e) {
                    var t = this;
                    o.call(this.requests, e), e.onSend = function() {
                        t.handleRequest(this), t.respondImmediately ? t.respond() : t.autoRespond && !t.responding && (setTimeout(function() {
                            t.responding = !1, t.respond();
                        }, t.autoRespondAfter || 10), t.responding = !0);
                    };
                },
                "getHTTPMethod": function(e) {
                    if (this.fakeHTTPMethods && /post/i.test(e.method)) {
                        var t = (e.requestBody || "").match(/_method=([^\b;]+)/);
                        return t ? t[1] : e.method;
                    }
                    return e.method;
                },
                "handleRequest": function(e) {
                    e.async ? (this.queue || (this.queue = []), o.call(this.queue, e)) : this.processRequest(e);
                },
                "log": function(e, n) {
                    var r;
                    r = "Request:\n" + t.format(n) + "\n\n", r += "Response:\n" + t.format(e) + "\n\n", 
                    t.log(r);
                },
                "respondWith": function(t, n, r) {
                    1 !== arguments.length || "function" == typeof t ? (this.responses || (this.responses = []), 
                    1 === arguments.length && (r = t, n = t = null), 2 === arguments.length && (r = n, 
                    n = t, t = null), o.call(this.responses, {
                        "method": t,
                        "url": n,
                        "response": "function" == typeof r ? r : e(r)
                    })) : this.response = e(t);
                },
                "respond": function() {
                    arguments.length > 0 && this.respondWith.apply(this, arguments);
                    for (var e = this.queue || [], t = e.splice(0, e.length), n = 0; n < t.length; n++) this.processRequest(t[n]);
                },
                "processRequest": function(e) {
                    try {
                        if (e.aborted) return;
                        var r = this.response || [ 404, {}, "" ];
                        if (this.responses) for (var i = this.responses.length - 1; i >= 0; i--) if (n.call(this, this.responses[i], e)) {
                            r = this.responses[i].response;
                            break;
                        }
                        4 !== e.readyState && (this.log(r, e), e.respond(r[0], r[1], r[2]));
                    } catch (e) {
                        t.logError("Fake server request processing", e);
                    }
                },
                "restore": function() {
                    return this.xhr.restore && this.xhr.restore.apply(this.xhr, arguments);
                }
            };
        }
        function i(e, t, n) {
            var i = e("./core");
            e("./fake_xdomain_request"), e("./fake_xml_http_request"), e("../format"), r(i), 
            n.exports = i;
        }
        var o = [].push, s = "undefined" != typeof window ? window.location : {}, a = new RegExp("^" + s.protocol + "//" + s.host), u = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(i) : u ? i(require, module.exports, module) : r(sinon);
    }(), function() {
        function e(e) {
            function t() {}
            t.prototype = e.fakeServer, e.fakeServerWithClock = new t(), e.fakeServerWithClock.addRequest = function(t) {
                if (t.async && ("object" == typeof setTimeout.clock ? this.clock = setTimeout.clock : (this.clock = e.useFakeTimers(), 
                this.resetClock = !0), !this.longestTimeout)) {
                    var n = this.clock.setTimeout, r = this.clock.setInterval, i = this;
                    this.clock.setTimeout = function(e, t) {
                        return i.longestTimeout = Math.max(t, i.longestTimeout || 0), n.apply(this, arguments);
                    }, this.clock.setInterval = function(e, t) {
                        return i.longestTimeout = Math.max(t, i.longestTimeout || 0), r.apply(this, arguments);
                    };
                }
                return e.fakeServer.addRequest.call(this, t);
            }, e.fakeServerWithClock.respond = function() {
                var t = e.fakeServer.respond.apply(this, arguments);
                return this.clock && (this.clock.tick(this.longestTimeout || 0), this.longestTimeout = 0, 
                this.resetClock && (this.clock.restore(), this.resetClock = !1)), t;
            }, e.fakeServerWithClock.restore = function() {
                return this.clock && this.clock.restore(), e.fakeServer.restore.apply(this, arguments);
            };
        }
        function t(t) {
            var n = t("./core");
            t("./fake_server"), t("./fake_timers"), e(n);
        }
        var n = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(t) : n ? t(require) : e(sinon);
    }(), function(e) {
        function t(e) {
            function t(e, t, n, i) {
                i && (!t.injectInto || n in t.injectInto ? r.call(e.args, i) : (t.injectInto[n] = i, 
                e.injectedKeys.push(n)));
            }
            function n(t) {
                var n = e.create(e.sandbox);
                return t.useFakeServer && ("object" == typeof t.useFakeServer && (n.serverPrototype = t.useFakeServer), 
                n.useFakeServer()), t.useFakeTimers && ("object" == typeof t.useFakeTimers ? n.useFakeTimers.apply(n, t.useFakeTimers) : n.useFakeTimers()), 
                n;
            }
            var r = [].push;
            return e.sandbox = e.extend(e.create(e.collection), {
                "useFakeTimers": function() {
                    return this.clock = e.useFakeTimers.apply(e, arguments), this.add(this.clock);
                },
                "serverPrototype": e.fakeServer,
                "useFakeServer": function() {
                    var t = this.serverPrototype || e.fakeServer;
                    return t && t.create ? (this.server = t.create(), this.add(this.server)) : null;
                },
                "inject": function(t) {
                    return e.collection.inject.call(this, t), this.clock && (t.clock = this.clock), 
                    this.server && (t.server = this.server, t.requests = this.server.requests), t.match = e.match, 
                    t;
                },
                "restore": function() {
                    if (arguments.length) throw new Error("sandbox.restore() does not take any parameters. Perhaps you meant stub.restore()");
                    e.collection.restore.apply(this, arguments), this.restoreContext();
                },
                "restoreContext": function() {
                    if (this.injectedKeys) {
                        for (var e = 0, t = this.injectedKeys.length; e < t; e++) delete this.injectInto[this.injectedKeys[e]];
                        this.injectedKeys = [];
                    }
                },
                "create": function(r) {
                    if (!r) return e.create(e.sandbox);
                    var i = n(r);
                    i.args = i.args || [], i.injectedKeys = [], i.injectInto = r.injectInto;
                    var o, s, a = i.inject({});
                    if (r.properties) for (var u = 0, c = r.properties.length; u < c; u++) t(i, r, o = r.properties[u], s = a[o] || "sandbox" === o && i); else t(i, r, "sandbox", s);
                    return i;
                },
                "match": e.match
            }), e.sandbox.useFakeXMLHttpRequest = e.sandbox.useFakeServer, e.sandbox;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            e("./extend"), e("./util/fake_server_with_clock"), e("./util/fake_timers"), e("./collection"), 
            r.exports = t(i);
        }
        var r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : r ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon), function(e) {
        function t(e) {
            function t(t) {
                function r() {
                    var r = e.getConfig(e.config);
                    r.injectInto = r.injectIntoThis && this || r.injectInto;
                    var i, o, s = e.sandbox.create(r), a = n.call(arguments), u = a.length && a[a.length - 1];
                    "function" == typeof u && (a[a.length - 1] = function(e) {
                        e ? s.restore() : s.verifyAndRestore(), u(e);
                    });
                    try {
                        o = t.apply(this, a.concat(s.args));
                    } catch (e) {
                        i = e;
                    }
                    if (void 0 !== i) throw s.restore(), i;
                    return "function" != typeof u && s.verifyAndRestore(), o;
                }
                var i = typeof t;
                if ("function" !== i) throw new TypeError("sinon.test needs to wrap a test function, got " + i);
                return t.length ? function(e) {
                    return r.apply(this, arguments);
                } : r;
            }
            var n = Array.prototype.slice;
            return t.config = {
                "injectIntoThis": !0,
                "injectInto": null,
                "properties": [ "spy", "stub", "mock", "clock", "server", "requests" ],
                "useFakeTimers": !0,
                "useFakeServer": !0
            }, e.test = t, t;
        }
        function n(e, n, r) {
            var i = e("./util/core");
            e("./sandbox"), r.exports = t(i);
        }
        var r = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(n) : r ? n(require, module.exports, module) : e && t(e);
    }("object" == typeof sinon && sinon || null), function(e) {
        function t(e, t, n) {
            return function() {
                t && t.apply(this, arguments);
                var r, i;
                try {
                    i = e.apply(this, arguments);
                } catch (e) {
                    r = e;
                }
                if (n && n.apply(this, arguments), r) throw r;
                return i;
            };
        }
        function n(e) {
            function n(n, r) {
                if (!n || "object" != typeof n) throw new TypeError("sinon.testCase needs an object with test functions");
                r = r || "test";
                var i, o, s, a = new RegExp("^" + r), u = {}, c = n.setUp, l = n.tearDown;
                for (i in n) n.hasOwnProperty(i) && !/^(setUp|tearDown)$/.test(i) && ("function" == typeof (o = n[i]) && a.test(i) ? (s = o, 
                (c || l) && (s = t(o, c, l)), u[i] = e.test(s)) : u[i] = n[i]);
                return u;
            }
            return e.testCase = n, n;
        }
        function r(e, t, r) {
            var i = e("./util/core");
            e("./test"), r.exports = n(i);
        }
        var i = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(r) : i ? r(require, module.exports, module) : e && n(e);
    }("object" == typeof sinon && sinon), function(e, t) {
        function n(e) {
            function n() {
                for (var e, t = 0, r = arguments.length; t < r; ++t) (e = arguments[t]) || u.fail("fake is not a spy"), 
                e.proxy && e.proxy.isSinonProxy ? n(e.proxy) : ("function" != typeof e && u.fail(e + " is not a function"), 
                "function" != typeof e.getCall && u.fail(e + " is not stubbed"));
            }
            function r(e, t) {
                switch (e) {
                  case "notCalled":
                  case "called":
                  case "calledOnce":
                  case "calledTwice":
                  case "calledThrice":
                    0 !== t.length && u.fail(e + " takes 1 argument but was called with " + (t.length + 1) + " arguments");
                }
            }
            function o(e, n) {
                ((e = e || t).fail || u.fail).call(e, n);
            }
            function s(e, t, s) {
                2 === arguments.length && (s = t, t = e), u[e] = function(a) {
                    n(a);
                    var c = i.call(arguments, 1);
                    r(e, c);
                    ("function" == typeof t ? !t(a) : "function" == typeof a[t] ? !a[t].apply(a, c) : !a[t]) ? o(this, (a.printf || a.proxy.printf).apply(a, [ s ].concat(c))) : u.pass(e);
                };
            }
            function a(e, t) {
                return !e || /^fail/.test(t) ? t : e + t.slice(0, 1).toUpperCase() + t.slice(1);
            }
            var u;
            return u = {
                "failException": "AssertError",
                "fail": function(e) {
                    var t = new Error(e);
                    throw t.name = this.failException || u.failException, t;
                },
                "pass": function() {},
                "callOrder": function() {
                    n.apply(null, arguments);
                    var t = "", r = "";
                    if (e.calledInOrder(arguments)) u.pass("callOrder"); else {
                        try {
                            t = [].join.call(arguments, ", ");
                            for (var s = i.call(arguments), a = s.length; a; ) s[--a].called || s.splice(a, 1);
                            r = e.orderByFirstCall(s).join(", ");
                        } catch (e) {}
                        o(this, "expected " + t + " to be called in order but were called as " + r);
                    }
                },
                "callCount": function(t, r) {
                    if (n(t), t.callCount !== r) {
                        var i = "expected %n to be called " + e.timesInWords(r) + " but was called %c%C";
                        o(this, t.printf(i));
                    } else u.pass("callCount");
                },
                "expose": function(e, t) {
                    if (!e) throw new TypeError("target is null or undefined");
                    var n = t || {}, r = void 0 === n.prefix && "assert" || n.prefix, i = void 0 === n.includeFail || !!n.includeFail;
                    for (var o in this) "expose" === o || !i && /^(fail)/.test(o) || (e[a(r, o)] = this[o]);
                    return e;
                },
                "match": function(t, n) {
                    e.match(n).test(t) ? u.pass("match") : o(this, [ "expected value to match", "    expected = " + e.format(n), "    actual = " + e.format(t) ].join("\n"));
                }
            }, s("called", "expected %n to have been called at least once but was never called"), 
            s("notCalled", function(e) {
                return !e.called;
            }, "expected %n to not have been called but was called %c%C"), s("calledOnce", "expected %n to be called once but was called %c%C"), 
            s("calledTwice", "expected %n to be called twice but was called %c%C"), s("calledThrice", "expected %n to be called thrice but was called %c%C"), 
            s("calledOn", "expected %n to be called with %1 as this but was called with %t"), 
            s("alwaysCalledOn", "expected %n to always be called with %1 as this but was called with %t"), 
            s("calledWithNew", "expected %n to be called with new"), s("alwaysCalledWithNew", "expected %n to always be called with new"), 
            s("calledWith", "expected %n to be called with arguments %*%C"), s("calledWithMatch", "expected %n to be called with match %*%C"), 
            s("alwaysCalledWith", "expected %n to always be called with arguments %*%C"), s("alwaysCalledWithMatch", "expected %n to always be called with match %*%C"), 
            s("calledWithExactly", "expected %n to be called with exact arguments %*%C"), s("alwaysCalledWithExactly", "expected %n to always be called with exact arguments %*%C"), 
            s("neverCalledWith", "expected %n to never be called with arguments %*%C"), s("neverCalledWithMatch", "expected %n to never be called with match %*%C"), 
            s("threw", "%n did not throw exception%C"), s("alwaysThrew", "%n did not always throw exception%C"), 
            e.assert = u, u;
        }
        function r(e, t, r) {
            var i = e("./util/core");
            e("./match"), e("./format"), r.exports = n(i);
        }
        var i = Array.prototype.slice, o = "undefined" != typeof module && module.exports && "function" == typeof require;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(r) : o ? r(require, module.exports, module) : e && n(e);
    }("object" == typeof sinon && sinon, "undefined" != typeof global ? global : self), 
    sinon;
});

var NL = function(e) {
    return e.assertLastRequestMethod = function(e) {
        var t = this.getLastRequest();
        expect(t.method).toEqual(e);
    }, e.assertLastRequestRoute = function(e) {
        var t = this.getLastRequest();
        expect(URI(t.url).path()).toEqual(e);
    }, e.assertLastRequestHasGetParameter = function(e, t) {
        var n = this.getLastRequest();
        t ? expect(URI(n.url).hasQuery(e, t)).toBeTruthy() : expect(URI(n.url).hasQuery(e, !0)).toBeTruthy();
    }, e.assertNotLastRequestHasGetParameter = function(e, t) {
        var n = this.getLastRequest();
        expect(URI(n.url).hasQuery(e, !1)).toBeTruthy();
    }, e;
}(NL || {}), NL = function(e) {
    return e.assertMapFocus = function(e, t) {
        expect(this.v.map.map.getCenter().lon).toEqual(e), expect(this.v.map.map.getCenter().lat).toEqual(t);
    }, e.assertMapZoom = function(t) {
        expect(e.getMapZoom()).toEqual(t);
    }, e.assertMapDynamicQuery = function() {
        this.assertLastRequestRoute(Neatline.g.neatline.record_api), this.assertLastRequestMethod("GET"), 
        this.assertLastRequestHasGetParameter("extent"), this.assertLastRequestHasGetParameter("zoom");
    }, e.assertMapStaticQuery = function() {
        this.assertLastRequestRoute(Neatline.g.neatline.record_api), this.assertLastRequestMethod("GET"), 
        this.assertNotLastRequestHasGetParameter("extent"), this.assertNotLastRequestHasGetParameter("zoom");
    }, e.assertVectorLayerCount = function(e) {
        expect(this.v.map.getVectorLayers().length).toEqual(e);
    }, e.assertWmsLayerCount = function(e) {
        expect(this.v.map.getWmsLayers().length).toEqual(e);
    }, e.assertDefaultIntent = function(e) {
        _.each(e.features, function(e) {
            expect(e.renderIntent).toEqual("default");
        });
    }, e.assertTemporaryIntent = function(e) {
        _.each(e.features, function(e) {
            expect(e.renderIntent).toEqual("temporary");
        });
    }, e.assertSelectIntent = function(e) {
        _.each(e.features, function(e) {
            expect(e.renderIntent).toEqual("select");
        });
    }, e;
}(NL || {}), NL = function(e) {
    return e.assertPaginationPrevEnabled = function() {
        var e = this.v.records.$el.find(".pagination .prev");
        expect($(e[0]).parent("li")).not.toHaveClass("disabled"), expect($(e[1]).parent("li")).not.toHaveClass("disabled");
    }, e.assertPaginationPrevDisabled = function() {
        var e = this.v.records.$el.find(".pagination .prev");
        expect($(e[0]).parent("li")).toHaveClass("disabled"), expect($(e[1]).parent("li")).toHaveClass("disabled");
    }, e.assertPaginationNextEnabled = function() {
        var e = this.v.records.$el.find(".pagination .next");
        expect($(e[0]).parent("li")).not.toHaveClass("disabled"), expect($(e[1]).parent("li")).not.toHaveClass("disabled");
    }, e.assertPaginationNextDisabled = function() {
        var e = this.v.records.$el.find(".pagination .next");
        expect($(e[0]).parent("li")).toHaveClass("disabled"), expect($(e[1]).parent("li")).toHaveClass("disabled");
    }, e.assertPaginationPrevRoute = function(e) {
        var t = this.v.records.$el.find(".pagination .prev");
        expect($(t[0])).toHaveAttr("href", e), expect($(t[1])).toHaveAttr("href", e);
    }, e.assertPaginationNextRoute = function(e) {
        var t = this.v.records.$el.find(".pagination .next");
        expect($(t[0])).toHaveAttr("href", e), expect($(t[1])).toHaveAttr("href", e);
    }, e;
}(NL || {}), NL = function(e) {
    return e.assertActiveTab = function(e) {
        var t = this.v.record.$('a[href="#record-' + e + '"]'), n = this.v.record.$("#record-" + e);
        expect(t.parent("li")).toHaveClass("active"), expect(n).toHaveClass("active");
    }, e;
}(NL || {}), NL = function(e) {
    return e.assertRoute = function(e) {
        expect(Backbone.history.fragment).toEqual(e);
    }, e;
}(NL || {}), NL = function(e) {
    return e.assertEventNotCalled = function(e, t) {
        var n = _.map(e.calls.allArgs(), function(e) {
            return e[0];
        });
        expect(_.contains(n, t)).toBeFalsy();
    }, e;
}(NL || {}), NL = function(e) {
    return e.getLastRequest = function() {
        return _.last(this.server.requests);
    }, e.getLastRequestParams = function() {
        return $.parseJSON(this.getLastRequest().requestBody);
    }, e.respond200 = function(e, t, n) {
        e.respond(200, {
            "Content-Type": n || "application/json"
        }, t);
    }, e.respondAll200 = function(e) {
        _.each(this.server.requests, _.bind(function(t) {
            this.respond200(t, e);
        }, this));
    }, e.respondLast200 = function(e, t) {
        var n = this.getLastRequest();
        return this.respond200(n, e, t), n;
    }, e.respondMap200 = function(e) {
        _.each(this.server.requests, _.bind(function(t) {
            var n = URI(t.url), r = n.hasQuery("extent", !0), i = n.hasQuery("zoom", !0);
            r && i && this.respond200(t, e);
        }, this));
    }, e.respondRecordList200 = function(e) {
        _.each(this.server.requests, _.bind(function(t) {
            var n = URI(t.url), r = n.hasQuery("limit", !0), i = n.hasQuery("start", !0);
            r && i && this.respond200(t, e);
        }, this));
    }, e.respondItemSearch200 = function(e) {
        _.each(this.server.requests, _.bind(function(t) {
            URI(t.url).path() == Neatline.g.neatline.item_search_api && this.respond200(t, e);
        }, this));
    }, e.itemsHaveBeenRequested = function() {
        return _.any(_.pluck(e.server.requests, "url"), function(e) {
            return URI(e).path() == Neatline.g.neatline.item_search_api;
        });
    }, e.respond500 = function(e) {
        e.respond(500);
    }, e.respondLast500 = function() {
        var e = this.getLastRequest();
        return this.respond500(e), e;
    }, e;
}(NL || {}), NL = function(e) {
    return e.aliasNeatline = function() {
        this.v = {
            "map": Neatline.Map.__controller.view,
            "bubble": Neatline.Presenter.StaticBubble.__controller.view
        };
    }, e.aliasEditor = function() {
        this.v = {
            "map": Neatline.Map.__controller.view,
            "bubble": Neatline.Presenter.StaticBubble.__controller.view,
            "editor": Neatline.Editor.__controller.view,
            "exhibit": Neatline.Editor.Exhibit.__controller.view,
            "search": Neatline.Editor.Exhibit.Search.__controller.view,
            "records": Neatline.Editor.Exhibit.Records.__controller.view,
            "styles": Neatline.Editor.Exhibit.Styles.__controller.view,
            "record": Neatline.Editor.Record.__controller.view,
            "textTab": Neatline.Editor.Record.Text.__controller.view,
            "itemTab": Neatline.Editor.Record.Item.__controller.view,
            "mapTab": Neatline.Editor.Record.Map.__controller.view
        };
    }, e;
}(NL || {});

jasmine.getFixtures().fixturesPath = "tests/jasmine/fixtures", jasmine.getStyleFixtures().fixturesPath = "views/shared/css/dist/development";

var read = readFixtures, NL = function(e) {
    return e.triggerMapMoveStart = function() {
        this.v.map.map.events.triggerEvent("movestart"), this.v.map.map.dragging = !0;
    }, e.triggerMapMoveEnd = function() {
        this.v.map.map.events.triggerEvent("moveend"), this.v.map.map.dragging = !1;
    }, e.triggerMapMouseout = function() {
        this.v.map.map.events.triggerEvent("mouseout");
    }, e.refreshMap = function(e) {
        this.triggerMapMoveEnd(), this.respondLast200(e);
    }, e.clickOnMapFeature = function(e) {
        _.each(this.v.map.getVectorLayers(), function(t) {
            t.getFeatureFromEvent = function(t) {
                return e;
            };
        });
        var t = {
            "xy": new OpenLayers.Pixel(1, 2),
            "type": "click"
        };
        this.v.map.map.events.triggerEvent("click", t);
    }, e.clickOffMapFeature = function() {
        _.each(this.v.map.getVectorLayers(), function(e) {
            e.getFeatureFromEvent = function(e) {
                return null;
            };
        }), this.v.map.map.events.triggerEvent("click", {
            "xy": new OpenLayers.Pixel(1, 2)
        });
    }, e.hoverOnMapFeature = function(e) {
        _.each(this.v.map.getVectorLayers(), function(t) {
            t.getFeatureFromEvent = function(t) {
                return e;
            };
        }), this.v.map.map.events.triggerEvent("mousemove", {
            "xy": new OpenLayers.Pixel(1, 2)
        });
    }, e.unHoverOnMapFeature = function() {
        _.each(this.v.map.getVectorLayers(), function(e) {
            e.getFeatureFromEvent = function(e) {
                return null;
            };
        }), this.v.map.map.events.triggerEvent("mousemove", {
            "xy": new OpenLayers.Pixel(1, 2)
        });
    }, e.setMapCenter = function(e, t, n) {
        this.v.map.map.setCenter([ e, t ], n);
    }, e.setMapZoom = function(e) {
        this.v.map.map.zoomTo(e);
    }, e.getMapZoom = function(e) {
        return this.v.map.map.getZoom();
    }, e.getVectorLayer = function(e) {
        return _.find(this.v.map.getVectorLayers(), function(t) {
            return t.name == e;
        });
    }, e.getWmsLayer = function(e) {
        return _.find(this.v.map.getWmsLayers(), function(t) {
            return t.name == e;
        });
    }, e;
}(NL || {}), NL = function(e) {
    return e.recordFromJson = function(e) {
        return new Neatline.Shared.Record.Model(JSON.parse(e));
    }, e.getRecordFormElements = function() {
        var e = this.v.record;
        return {
            "id": e.$("p.lead span.id"),
            "titleHeader": e.$("p.lead span.title"),
            "itemId": e.$('input[name="item-id"]'),
            "slug": e.$('input[name="slug"]'),
            "titleInput": e.$('textarea[name="title"]'),
            "body": e.$('textarea[name="body"]'),
            "coverage": e.$('textarea[name="coverage"]'),
            "tags": e.$('input[name="tags"]'),
            "widgets": e.$('select[name="widgets"]'),
            "presenter": e.$('select[name="presenter"]'),
            "fillColor": e.$('input[name="fill-color"]'),
            "fillColorSelect": e.$('input[name="fill-color-select"]'),
            "strokeColor": e.$('input[name="stroke-color"]'),
            "strokeColorSelect": e.$('input[name="stroke-color-select"]'),
            "fillOpacity": e.$('input[name="fill-opacity"]'),
            "fillOpacitySelect": e.$('input[name="fill-opacity-select"]'),
            "strokeOpacity": e.$('input[name="stroke-opacity"]'),
            "strokeOpacitySelect": e.$('input[name="stroke-opacity-select"]'),
            "strokeWidth": e.$('input[name="stroke-width"]'),
            "pointRadius": e.$('input[name="point-radius"]'),
            "zindex": e.$('input[name="zindex"]'),
            "weight": e.$('input[name="weight"]'),
            "startDate": e.$('input[name="start-date"]'),
            "endDate": e.$('input[name="end-date"]'),
            "afterDate": e.$('input[name="after-date"]'),
            "beforeDate": e.$('input[name="before-date"]'),
            "pointImage": e.$('input[name="point-image"]'),
            "wmsAddress": e.$('input[name="wms-address"]'),
            "wmsLayers": e.$('input[name="wms-layers"]'),
            "minZoom": e.$('input[name="min-zoom"]'),
            "maxZoom": e.$('input[name="max-zoom"]'),
            "mapFocus": e.$('input[name="map-focus"]'),
            "mapZoom": e.$('input[name="map-zoom"]')
        };
    }, e.getRoutableTabSlugs = function() {
        var e = _.map(this.v.record.__ui.tabs, function(e) {
            return $(e).attr("data-slug");
        });
        return _.without(e, "text");
    }, e.clickTab = function(t) {
        e.v.record.$('a[href="#record-' + t + '"]').trigger("click");
    }, e;
}(NL || {}), NL = function(e) {
    return e.getRecordListRows = function() {
        return this.v.records.$el.find(".list-group a");
    }, e.getRecordListModelAtIndex = function(e) {
        return Neatline.Editor.Exhibit.Records.__controller.view.records.at(e);
    }, e.getRecordListModelByTitle = function(e) {
        return Neatline.Editor.Exhibit.Records.__controller.view.records.findWhere({
            "title": e
        });
    }, e;
}(NL || {}), NL = function(e) {
    return e.getEventSpy = function() {
        return spyOn(Neatline.vent, "trigger").and.callThrough();
    }, e.getCommandSpy = function() {
        return spyOn(Neatline, "execute").and.callThrough();
    }, e;
}(NL || {}), NL = function(e) {
    return e.loadNeatline = function(e) {
        this.server && this.server.restore(), loadFixtures(e || "SharedHtml.exhibit.html"), 
        loadStyleFixtures("neatline-public.css"), this.__initNeatline();
    }, e.loadEditor = function(e) {
        this.server && this.server.restore(), loadFixtures(e || "SharedHtml.editor.html"), 
        loadStyleFixtures("neatline-editor.css"), this.__initEditor();
    }, e.__initNeatline = function() {
        this.server = sinon.fakeServer.create(), this.startApplication(), this.aliasNeatline();
    }, e.__initEditor = function() {
        this.server = sinon.fakeServer.create(), this.startApplication(), this.aliasEditor();
    }, e.startApplication = function() {
        Backbone.history.stop(), window.location.hash = "", this.stopApplication(), Neatline.start();
    }, e.stopApplication = function() {
        _.each(Neatline.submodules, function(e) {
            e.stop();
        }), Neatline._initCallbacks.reset(), Neatline.commands.removeAllHandlers(), Neatline.reqres.removeAllHandlers(), 
        Neatline.vent._events = {};
    }, e.navigate = function(e) {
        Backbone.history.fragment = null, Backbone.history.navigate(e, !0);
    }, e.click = function(e) {
        e.click(), this.navigate(e.attr("href"));
    }, e.showRecordList = function(e) {
        this.navigate("browse"), this.respondLast200(e);
    }, e.showRecordForm = function(e) {
        this.navigate("edit/" + JSON.parse(e).id), this.respondLast200(e);
    }, e.showStyles = function(e) {
        this.navigate("styles"), this.respondLast200(e);
    }, e;
}(NL || {});