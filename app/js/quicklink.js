! function (n, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(n.quicklink = {})
}(this, function (n) {
    function e(n) {
        return new Promise(function (e, t, o) {
            (o = new XMLHttpRequest).open("GET", n, o.withCredentials = !0), o.onload = function () {
                200 === o.status ? e() : t()
            }, o.send()
        })
    }
    var t, o = (t = document.createElement("link")).relList && t.relList.supports && t.relList.supports("prefetch") ? function (n) {
            return new Promise(function (e, t, o) {
                (o = document.createElement("link")).rel = "prefetch", o.href = n, o.onload = e, o.onerror = t, document.head.appendChild(o)
            })
        } : e,
        i = window.requestIdleCallback || function (n) {
            var e = Date.now();
            return setTimeout(function () {
                n({
                    didTimeout: !1,
                    timeRemaining: function () {
                        return Math.max(0, 50 - (Date.now() - e))
                    }
                })
            }, 1)
        },
        r = new Set;

    function c(n, t, i) {
        if (!(i = navigator.connection) || !i.saveData && !/2g/.test(i.effectiveType)) return Promise.all([].concat(n).map(function (n) {
            if (!r.has(n)) return r.add(n), (t ? function (n) {
                return window.fetch ? fetch(n, {
                    credentials: "include"
                }) : e(n)
            } : o)(new URL(n, location.href).toString())
        }))
    }
    n.listen = function (n) {
        if (n || (n = {}), window.IntersectionObserver) {
            var e = function (n) {
                    n = n || 1;
                    var e = [],
                        t = 0;

                    function o() {
                        t < n && e.length > 0 && (e.shift()(), t++)
                    }
                    return [function (n) {
                        e.push(n) > 1 || o()
                    }, function () {
                        t--, o()
                    }]
                }(n.throttle || 1 / 0),
                t = e[0],
                o = e[1],
                u = n.limit || 1 / 0,
                f = n.origins || [location.hostname],
                s = n.ignores || [],
                a = n.timeoutFn || i,
                l = new IntersectionObserver(function (e) {
                    e.forEach(function (e) {
                        e.isIntersecting && (l.unobserve(e = e.target), r.size < u && t(function () {
                            c(e.href, n.priority).then(o).catch(function (e) {
                                o(), n.onError && n.onError(e)
                            })
                        }))
                    })
                });
            return a(function () {
                    (n.el || document).querySelectorAll("a").forEach(function (n) {
                        f.length && !f.includes(n.hostname) || function n(e, t) {
                            return Array.isArray(t) ? t.some(function (t) {
                                return n(e, t)
                            }) : (t.test || t).call(t, e.href, e)
                        }(n, s) || l.observe(n)
                    })
                }, {
                    timeout: n.timeout || 2e3
                }),
                function () {
                    r.clear(), l.disconnect()
                }
        }
    }, n.prefetch = c
});


window.addEventListener('load', () => {
    quicklink.listen();
});