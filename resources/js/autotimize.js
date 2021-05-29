+ function($) {
    'use strict';
    var Affix = function(element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)
        var target = this.options.target === Affix.DEFAULTS.target ? $(this.options.target) : $(document).find(this.options.target)
        this.$target = target.on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))
        this.$element = $(element)
        this.affixed = null
        this.unpin = null
        this.pinnedOffset = null
        this.checkPosition()
    }
    Affix.VERSION = '3.4.1'
    Affix.RESET = 'affix affix-top affix-bottom'
    Affix.DEFAULTS = {
        offset: 0,
        target: window
    }
    Affix.prototype.getState = function(scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        var targetHeight = this.$target.height()
        if (offsetTop != null && this.affixed == 'top')
            return scrollTop < offsetTop ? 'top' : false
        if (this.affixed == 'bottom') {
            if (offsetTop != null)
                return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
            return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
        }
        var initializing = this.affixed == null
        var colliderTop = initializing ? scrollTop : position.top
        var colliderHeight = initializing ? targetHeight : height
        if (offsetTop != null && scrollTop <= offsetTop)
            return 'top'
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom))
            return 'bottom'
        return false
    }
    Affix.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset)
            return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
    }
    Affix.prototype.checkPositionWithEventLoop = function() {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }
    Affix.prototype.checkPosition = function() {
        if (!this.$element.is(':visible'))
            return
        var height = this.$element.height()
        var offset = this.options.offset
        var offsetTop = offset.top
        var offsetBottom = offset.bottom
        var scrollHeight = Math.max($(document).height(), $(document.body).height())
        if (typeof offset != 'object')
            offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function')
            offsetTop = offset.top(this.$element)
        if (typeof offsetBottom == 'function')
            offsetBottom = offset.bottom(this.$element)
        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)
        if (this.affixed != affix) {
            if (this.unpin != null)
                this.$element.css('top', '')
            var affixType = 'affix' + (affix ? '-' + affix : '')
            var e = $.Event(affixType + '.bs.affix')
            this.$element.trigger(e)
            if (e.isDefaultPrevented())
                return
            this.affixed = affix
            this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null
            this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
        }
        if (affix == 'bottom') {
            this.$element.offset({
                top: scrollHeight - height - offsetBottom
            })
        }
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.affix')
            var options = typeof option == 'object' && option
            if (!data)
                $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string')
                data[option]()
        })
    }
    var old = $.fn.affix
    $.fn.affix = Plugin
    $.fn.affix.Constructor = Affix
    $.fn.affix.noConflict = function() {
        $.fn.affix = old
        return this
    }
    $(window).on('load', function() {
        $('[data-spy="affix"]').each(function() {
            var $spy = $(this)
            var data = $spy.data()
            data.offset = data.offset || {}
            if (data.offsetBottom != null)
                data.offset.bottom = data.offsetBottom
            if (data.offsetTop != null)
                data.offset.top = data.offsetTop
            Plugin.call($spy, data)
        })
    })
}(jQuery);;
(function() {
    var toggleNav = document.querySelector(".toggle-nav");
    if (toggleNav) {
        toggleNav.addEventListener('click', function(e) {
            toggleNav.classList.toggle('active');
            document.querySelector('.mobile-nav').classList.toggle('active');
            document.querySelector('.toggle-background').classList.toggle('active');
            e.preventDefault();
        });
    }
}());
jQuery("body").append('<style>.gotop{ position: fixed; bottom: 10px !important; top: unset; display: block; text-align: center; right: 10px; height: 32px; width: 32px; background: rgba(0,0,0,.5); color: #fff; line-height: 32px; font-size: 16px; z-index: 999; visibility: hidden; opacity: 0; -webkit-transition: all .25s ease; transition: all .25s ease;}.gotop:hover{ background: rgba(246,150,49,.95); color: #FFF; }.gotop.affix{ bottom: 10px;  opacity: 1; visibility: visible; }</style>' + '<a href="#" class="gotop" hidefocus="true" style="outline: none;"><i class="icon-up-open"></i></a>');
jQuery(".gotop").affix({
    offset: {
        top: 400,
    }
})
jQuery(".gotop").click(function(e) {
    e.preventDefault()
    jQuery('body,html').animate({
        scrollTop: 0
    }, 350)
});;
(function($) {
    if ($('.postlist.postlist-blog .post').length > 0) {
        var documentHeight = $('.postlist.postlist-blog .post').last().offset().top;
        var next_url = document.querySelector('link[rel="next"]') ? document.querySelector('link[rel="next"]').href : $(".next-link a").attr("href");
        var loading = false;
        var finished = false;
        var event = new Event('build');
        var count = 0;
        $(window).scroll(function() {
            var offset = $(document).scrollTop() + $(window).height();
            var scrollHeight = 0;
            if (!next_url)
                return false;
            if (count > 5) {
                if ($('.btn-next-page').length == 0) {
                    $('.postlist.postlist-blog').append('<div class="text-center btn-next-page" style="margin-top: 20px"><a class="btn btn-primary" href="' + next_url + '" style="max-width: 50%">Xem thêm</a></div>')
                }
                return false;
            }
            if (documentHeight < offset + 1000) {
                if (loading === false && finished === false) {
                    $.ajax({
                        url: next_url,
                        type: 'GET',
                        dataType: 'html',
                        beforeSend: function() {
                            $('.postlist.postlist-blog').append('<div class="k7-loading"><img class="center-block" src="../images/loader.gif" alt="Loading bar..."/></div>');
                        },
                        success: function(data, textResponse, jqXHR) {
                            count++
                            var post = $(data);
                            var styles = post.filter('style#mga-review-score');
                            if (styles.length) {
                                var reviewScoreCss = styles[0].innerText;
                                jQuery('style#mga-review-score').append(reviewScoreCss);
                            }
                            if (post.find(".next-link a").length == 0)
                                finished = true;
                            next_url = post.find(".next-link a").first().attr('href');
                            if ($('.banner-8').length >= 1) {
                                post.find('#banner-53').remove();
                                post.find('#banner-54').remove();
                            }
                            $('.postlist.postlist-blog').append(post.find('.postlist.postlist-blog').children());
                            $('.navigation.paging-navigation').remove();
                            var loadingBar = $('.k7-loading');
                            loadingBar.remove();
                            documentHeight = $('.postlist.postlist-blog .post').last().offset().top;
                            loading = false;
                            if (jQuery.fn.prettyPhoto) {
                                $('a[data-rel="prettyPhoto"]').prettyPhoto();
                            }
                            document.dispatchEvent(new Event('infiniteLoading:completed'));
                        }
                    });
                }
                loading = true;
            }
        });
    }
})(jQuery);

! function(t, s) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = s() : "function" == typeof define && define.amd ? define(s) : (t = t || self).stickybits = s()
}(this, function() {
    "use strict";
    var e = function() {
        function t(t, s) {
            var e = void 0 !== s ? s : {};
            this.version = "3.6.6",
                this.userAgent = window.navigator.userAgent || "no `userAgent` provided by the browser",
                this.props = {
                    customStickyChangeNumber: e.customStickyChangeNumber || null,
                    noStyles: e.noStyles || !1,
                    stickyBitStickyOffset: e.stickyBitStickyOffset || 0,
                    parentClass: e.parentClass || "js-stickybit-parent",
                    scrollEl: "string" == typeof e.scrollEl ? document.querySelector(e.scrollEl) : e.scrollEl || window,
                    stickyClass: e.stickyClass || "js-is-sticky",
                    stuckClass: e.stuckClass || "js-is-stuck",
                    stickyChangeClass: e.stickyChangeClass || "js-is-sticky--change",
                    useStickyClasses: e.useStickyClasses || !1,
                    useFixed: e.useFixed || !1,
                    useGetBoundingClientRect: e.useGetBoundingClientRect || !1,
                    verticalPosition: e.verticalPosition || "top"
                },
                this.props.positionVal = this.definePosition() || "fixed",
                this.instances = [];
            var i = this.props,
                n = i.positionVal,
                o = i.verticalPosition,
                r = i.noStyles,
                a = i.stickyBitStickyOffset,
                l = "top" !== o || r ? "" : a + "px",
                c = "fixed" !== n ? n : "";
            this.els = "string" == typeof t ? document.querySelectorAll(t) : t,
                "length" in this.els || (this.els = [this.els]);
            for (var f = 0; f < this.els.length; f++) {
                var u = this.els[f];
                u.style[o] = l,
                    u.style.position = c,
                    this.instances.push(this.addInstance(u, this.props))
            }
        }
        var s = t.prototype;
        return s.definePosition = function() {
                var t;
                if (this.props.useFixed)
                    t = "fixed";
                else {
                    for (var s = ["", "-o-", "-webkit-", "-moz-", "-ms-"], e = document.head.style, i = 0; i < s.length; i += 1)
                        e.position = s[i] + "sticky";
                    t = e.position ? e.position : "fixed",
                        e.position = ""
                }
                return t
            },
            s.addInstance = function(t, s) {
                var e = this,
                    i = {
                        el: t,
                        parent: t.parentNode,
                        props: s
                    };
                if ("fixed" === s.positionVal || s.useStickyClasses) {
                    this.isWin = this.props.scrollEl === window;
                    var n = this.isWin ? window : this.getClosestParent(i.el, i.props.scrollEl);
                    this.computeScrollOffsets(i),
                        i.parent.className += " " + s.parentClass,
                        i.state = "default",
                        i.stateContainer = function() {
                            return e.manageState(i)
                        },
                        n.addEventListener("scroll", i.stateContainer)
                }
                return i
            },
            s.getClosestParent = function(t, s) {
                var e = s,
                    i = t;
                if (i.parentElement === e)
                    return e;
                for (; i.parentElement !== e;)
                    i = i.parentElement;
                return e
            },
            s.getTopPosition = function(t) {
                if (this.props.useGetBoundingClientRect)
                    return t.getBoundingClientRect().top + (this.props.scrollEl.pageYOffset || document.documentElement.scrollTop);
                for (var s = 0; s = t.offsetTop + s,
                    t = t.offsetParent;)
                ;
                return s
            },
            s.computeScrollOffsets = function(t) {
                var s = t,
                    e = s.props,
                    i = s.el,
                    n = s.parent,
                    o = !this.isWin && "fixed" === e.positionVal,
                    r = "bottom" !== e.verticalPosition,
                    a = o ? this.getTopPosition(e.scrollEl) : 0,
                    l = o ? this.getTopPosition(n) - a : this.getTopPosition(n),
                    c = null !== e.customStickyChangeNumber ? e.customStickyChangeNumber : i.offsetHeight,
                    f = l + n.offsetHeight;
                s.offset = a + e.stickyBitStickyOffset,
                    s.stickyStart = r ? l - s.offset : 0,
                    s.stickyChange = s.stickyStart + c,
                    s.stickyStop = r ? f - (i.offsetHeight + s.offset) : f - window.innerHeight
            },
            s.toggleClasses = function(t, s, e) {
                var i = t,
                    n = i.className.split(" ");
                e && -1 === n.indexOf(e) && n.push(e);
                var o = n.indexOf(s); -
                1 !== o && n.splice(o, 1),
                    i.className = n.join(" ")
            },
            s.manageState = function(t) {
                var s = t,
                    e = s.el,
                    i = s.props,
                    n = s.state,
                    o = s.stickyStart,
                    r = s.stickyChange,
                    a = s.stickyStop,
                    l = e.style,
                    c = i.noStyles,
                    f = i.positionVal,
                    u = i.scrollEl,
                    p = i.stickyClass,
                    h = i.stickyChangeClass,
                    d = i.stuckClass,
                    y = i.verticalPosition,
                    k = "bottom" !== y,
                    m = function(t) {
                        t()
                    },
                    g = this.isWin && (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame) || m,
                    C = this.toggleClasses,
                    v = this.isWin ? window.scrollY || window.pageYOffset : u.scrollTop,
                    S = k && v <= o && ("sticky" === n || "stuck" === n),
                    w = a <= v && "sticky" === n;
                o < v && v < a && ("default" === n || "stuck" === n) ? (s.state = "sticky",
                    g(function() {
                        C(e, d, p),
                            l.position = f,
                            c || (l.bottom = "",
                                l[y] = i.stickyBitStickyOffset + "px")
                    })) : S ? (s.state = "default",
                    g(function() {
                        C(e, p),
                            C(e, d),
                            "fixed" === f && (l.position = "")
                    })) : w && (s.state = "stuck",
                    g(function() {
                        C(e, p, d),
                            "fixed" !== f || c || (l.top = "",
                                l.bottom = "0",
                                l.position = "absolute")
                    }));
                var b = r <= v && v <= a;
                v < r / 2 || a < v ? g(function() {
                    C(e, h)
                }) : b && g(function() {
                    C(e, "stub", h)
                })
            },
            s.update = function(t) {
                void 0 === t && (t = null);
                for (var s = 0; s < this.instances.length; s += 1) {
                    var e = this.instances[s];
                    if (this.computeScrollOffsets(e),
                        t)
                        for (var i in t)
                            e.props[i] = t[i]
                }
                return this
            },
            s.removeInstance = function(t) {
                var s = t.el,
                    e = t.props,
                    i = this.toggleClasses;
                s.style.position = "",
                    s.style[e.verticalPosition] = "",
                    i(s, e.stickyClass),
                    i(s, e.stuckClass),
                    i(s.parentNode, e.parentClass)
            },
            s.cleanup = function() {
                for (var t = 0; t < this.instances.length; t += 1) {
                    var s = this.instances[t];
                    s.stateContainer && s.props.scrollEl.removeEventListener("scroll", s.stateContainer),
                        this.removeInstance(s)
                }
                this.manageState = !1,
                    this.instances = []
            },
            t
    }();
    return function(t, s) {
        return new e(t, s)
    }
});;
(function() {
    var isActive = false;
    var playerIds = {};
    window.addEventListener('scroll', function(e) {
        var offset = document.querySelector('html').scrollTop;
        var players = document.querySelectorAll('.mga-player');
        if (players.length == 0) {
            return
        }
        if (isActive) {
            return;
        }
        if (offset <= 100) {
            return
        }
        isActive = true;
        var tag = document.createElement('script');
        tag.src = "https://youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });

    function addResponsiveItem(id) {
        var d = document.querySelector('#' + id)
        if (d) {
            d.classList.add('embed-responsive-item');
            d.classList.add('square-video');
        }
    }

    function handleScroll(id) {
        var p = document.querySelector('#' + id);
        var player = playerIds[id];
        return function(e) {
            var offsetTop = p.getBoundingClientRect().top
            if (offsetTop <= 350 && offsetTop >= -150) {
                player.playVideo();
                player.mute();
            } else {}
        }
    }

    function createPlayer(id, videoId) {
        var player = new YT.Player(id, {
            height: '360',
            width: '270',
            videoId: videoId,
            events: {
                onReady: function() {
                    addResponsiveItem(id);
                }
            }
        });
        playerIds[id] = player;
    }
    window.onYouTubeIframeAPIReady = function() {
        var players = document.querySelectorAll('.mga-player');
        if (players.length == 0) {}
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            var id = 'mga-player-' + (i + 1);
            var videoId = player.dataset.src;
            var div = document.createElement('div');
            div.id = id;
            player.appendChild(div);
            createPlayer(id, videoId);
        }
    }
}());;
(function($) {
    function setSlideBannerOffset() {
        var delta = 10;
        var width = 160;
        var offset = ((jQuery('body').outerWidth() - jQuery('.main-row>.container').outerWidth()) / 2) - width - delta;
        jQuery('.k7-sticky-scroll.left').css({
            left: offset
        });
        jQuery('.k7-sticky-scroll.right').css({
            right: offset
        });
    }

    function runSlideBanner() {
        var delta = 0;
        var offset = jQuery('.content-row').first().offset().top;
        if (jQuery('.breadcrumb').length > 0)
            delta = delta + jQuery('.breadcrumb').height();
        jQuery('.k7-sticky-scroll').css({
            position: 'absolute',
            top: offset + delta,
            display: 'block',
            'z-index': 9999
        });
        setSlideBannerOffset();
    }
    jQuery(document).ready(function() {
        jQuery(window).resize(setSlideBannerOffset);
        // stickybits('.sticky');
        // $('body').on('alnp-post-loaded', function(e) {
        //     stickybits('.sticky');
        // });
        runSlideBanner();
        jQuery('.k7-sticky-scroll').affix({
            offset: {
                top: function() {
                    var delta = 40;
                    if (jQuery('.breadcrumb').length > 0)
                        delta = delta + jQuery('.breadcrumb').height();
                    return jQuery('.content-row').first().offset().top + delta;
                },
                bottom: function() {
                    var delta = 40;
                    return jQuery(document).height() - jQuery('.site-footer').offset().top + delta;
                }
            }
        }).on('affix-top.bs.affix', function() {
            runSlideBanner();
        }).on('affix.bs.affix', function() {
            jQuery(this).removeAttr('style');
            setSlideBannerOffset();
        });
    });
})(jQuery);
"use strict";
var BJLL_options = BJLL_options || {},
    BJLL = {
        _ticking: !1,
        check: function() {
            if (!BJLL._ticking) {
                BJLL._ticking = !0,
                    void 0 === BJLL.threshold && (void 0 !== BJLL_options.threshold ? BJLL.threshold = parseInt(BJLL_options.threshold) : BJLL.threshold = 200);
                var e = document.documentElement.clientHeight || body.clientHeight,
                    t = !1,
                    n = document.getElementsByClassName("lazy-hidden");
                [].forEach.call(n, function(n, a, i) {
                        var s = n.getBoundingClientRect();
                        e - s.top + BJLL.threshold > 0 && (BJLL.show(n),
                            t = !0)
                    }),
                    BJLL._ticking = !1,
                    t && BJLL.check()
            }
        },
        show: function(e) {
            e.className = e.className.replace(/(?:^|\s)lazy-hidden(?!\S)/g, ""),
                e.addEventListener("load", function() {
                    e.className += " lazy-loaded",
                        BJLL.customEvent(e, "lazyloaded")
                }, !1);
            var t = e.getAttribute("data-lazy-type");
            if ("image" == t)
                null != e.getAttribute("data-lazy-srcset") && e.setAttribute("srcset", e.getAttribute("data-lazy-srcset")),
                null != e.getAttribute("data-lazy-sizes") && e.setAttribute("sizes", e.getAttribute("data-lazy-sizes")),
                e.setAttribute("src", e.getAttribute("data-lazy-src"));
            else if ("iframe" == t) {
                var n = e.getAttribute("data-lazy-src"),
                    a = document.createElement("div");
                a.innerHTML = n;
                var i = a.firstChild;
                e.parentNode.replaceChild(i, e)
            }
        },
        customEvent: function(e, t) {
            var n;
            document.createEvent ? (n = document.createEvent("HTMLEvents")).initEvent(t, !0, !0) : (n = document.createEventObject()).eventType = t,
                n.eventName = t,
                document.createEvent ? e.dispatchEvent(n) : e.fireEvent("on" + n.eventType, n)
        }
    };
window.addEventListener("load", BJLL.check, !1),
    window.addEventListener("scroll", BJLL.check, !1),
    window.addEventListener("resize", BJLL.check, !1),
    document.getElementsByTagName("body").item(0).addEventListener("post-load", BJLL.check, !1);