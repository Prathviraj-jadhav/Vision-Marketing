(()=>{
    var $t = (s=1e3)=>{
        window.requestIdleCallback = window.requestIdleCallback || function(n) {
            let a = Date.now();
            return setTimeout(function() {
                n({
                    didTimeout: !1,
                    timeRemaining: function() {
                        return Math.max(0, 50 - (Date.now() - a))
                    }
                })
            }, 1)
        }
        ;
        let t, e = [], r = (n,a)=>{
            e.push(n),
            i()
        }
        , i = ()=>{
            t || (t = window.requestIdleCallback(o, {
                timeout: s
            }))
        }
        , o = n=>{
            if (!n.timeRemaining && e.length)
                for (; e.length; )
                    e.shift()();
            else
                for (; n.timeRemaining() > 0 && e.length; )
                    e.shift()();
            t = null,
            e.length && i()
        }
        ;
        return r
    }
    ;
    window.idly = $t();
    var G = s=>s === void 0
      , J = s=>s.constructor === Array
      , K = (s,t,e)=>e.indexOf(s) === t;
    var m = (s,t=document)=>t.querySelector(s)
      , A = (s,t=document)=>[...t.querySelectorAll(s)]
      , U = s=>{
        let {top: t, right: e, bottom: r, left: i, width: o, height: n, x: a, y: h} = s.getBoundingClientRect();
        return {
            top: t,
            right: e,
            bottom: r,
            left: i,
            width: o,
            height: n,
            x: a,
            y: h
        }
    }
      , w = s=>G(s) ? [] : s === window || s === document ? [s] : typeof s == "string" ? A(s) : J(s) ? s : [s];
    var D = (s,t,e)=>(1 - e) * s + e * t;
    var Q = (s,t,e,r,i)=>(s - t) * (i - r) / (e - t) + r
      , P = (s,t,e)=>Math.min(Math.max(t, s), e)
      , H = (s,t=1e3)=>Math.round(s * t) / t;
    var y = (s,t)=>{
        for (let e of t)
            s[e] = s[e].bind(s)
    }
    ;
    var L = ()=>({
        create: t=>{
            let e = (i,o)=>{
                i.forEach(n=>{
                    let a = h=>o.unobserve(h);
                    t.callback(n.target, n.isIntersecting, a, n)
                }
                )
            }
              , r = new IntersectionObserver(e,{
                root: null,
                rootMargin: `${t.offset || "0px"}`,
                threshold: t.threshold || 0
            });
            return {
                observe: i=>{
                    w(i).forEach(n=>{
                        r.observe(n)
                    }
                    )
                }
                ,
                unobserve: ()=>r.unobserve(target),
                disconnect: ()=>r.disconnect()
            }
        }
    });
    var I = {
        images: {},
        textures: {},
        dom: !1
    };
    var Z = ({arr: s, update: t, complete: e})=>{
        let r = s.length;
        if (r === 0) {
            t && t(null, 0, 100),
            e && e([]);
            return
        }
        let i = 0
          , o = new Array(r)
          , n = new Array(r);
        s.forEach((a,h)=>{
            let l;
            if (I.images[a])
                return l = I.images[a],
                t && t(l, h, ++i / r * 100),
                l;
            {
                l = new Image,
                l.src = a;
                let d = new Promise(f=>{
                    l.onload = ()=>{
                        l.decode().catch(x=>{
                            console.log(x, a)
                        }
                        ).finally(()=>{
                            t && t(l, h, ++i / r * 100),
                            n[h] = l,
                            I.images[a] = l,
                            f()
                        }
                        )
                    }
                }
                );
                o[h] = d
            }
        }
        ),
        Promise.all(o).then(()=>{
            e && e(n)
        }
        )
    }
    ;
    var ct = class {
        constructor() {}
        load(t="[data-lazy-src]:not(.media-ready)") {
            this.els = w(t),
            this.fetchAll()
        }
        async fetchAll() {
            this.els.forEach(this.fetchOne)
        }
        async fetchOne(t) {
            if (t.decoding = "async",
            I[t.dataset.lazySrc])
                t = I[t.dataset.lazySrc];
            else {
                t.src = t.dataset.lazySrc;
                try {
                    await t.decode(),
                    I.images[t.src] = t
                } catch {}
            }
            t.classList.add("media-ready")
        }
    }
      , dt = new ct;
    var pt = class {
        constructor() {
            this.uA = navigator.userAgent.toLowerCase(),
            this.pf = navigator.platform.toLowerCase(),
            this.safari = /^((?!chrome|android).)*safari/.test(this.uA),
            this.safariVersion = +(this.uA.match(/version\/[\d\.]+.*safari/) || ["-1"])[0].replace(/^version\//, "").replace(/ safari$/, ""),
            this.firefox = this.uA.indexOf("firefox") > -1,
            this.chrome = /chrome/.test(this.uA),
            this.ie = /msie|trident/.test(this.uA),
            this.webkit = /webkit/.test(this.uA),
            this.edge = /edge\/\d./.test(this.uA),
            this.ios = /ip(hone|[ao]d)/.test(this.uA),
            this.mac = this.pf.indexOf("mac") > -1,
            this.windows = this.pf.indexOf("win") > -1,
            this.android = /android/.test(this.uA),
            this.androidMobile = /android.*mobile/.test(this.uA),
            this.mobile = this.androidMobile || this.ios || navigator.platform === "MacIntel" && 1 < navigator.maxTouchPoints,
            this.touchDevice = "ontouchstart"in window,
            this.mutationObserver = "MutationObserver"in window
        }
    }
      , c = new pt;
    var _ = ({delay: s=200, update: t, onlyAtEnd: e=!1})=>{
        let r = 0
          , i = 0;
        return ()=>{
            let o = !0
              , n = performance.now();
            r && n < r + s || o ? (o = !1,
            clearTimeout(i),
            i = setTimeout(()=>{
                r = n,
                t()
            }
            , s)) : (r = n,
            e || (o = !1,
            t()))
        }
    }
    ;
    var S = class {
        constructor() {
            this.train = [],
            this.id = 0
        }
        add(t) {
            return this.id++,
            this.train.push({
                id: this.id,
                ...t
            }),
            this.id
        }
        remove(t) {
            for (let e = this.train.length - 1; e >= 0; e--)
                if (this.train[e].id === t)
                    return this.train.splice(e, 1);
            return !1
        }
    }
    ;
    var B = class {
        constructor(t, e=.001) {
            this.obj = t,
            this.threshold = e,
            y(this, ["update"])
        }
        needsUpdate() {
            return this.delta = Math.abs(this.obj.cur - this.obj.target),
            this.delta > this.threshold
        }
        update() {
            this.obj.target = D(this.obj.target, this.obj.cur, this.obj.inertia)
        }
    }
    ;
    var ft = class {
        constructor() {
            this.defaultOpts = {
                passive: !0,
                once: !1
            }
        }
        add(t, e, r, i) {
            let o = w(t)
              , n = i ? {
                ...this.defaultOpts,
                ...i
            } : this.defaultOpts;
            for (let a = o.length - 1; a >= 0; a--)
                o[a].addEventListener(e, r, n);
            return ()=>{
                this.remove(o, e, r)
            }
        }
        remove(t, e, r) {
            let i = w(t);
            for (let o = i.length - 1; o >= 0; o--)
                i[o].removeEventListener(e, r, !1)
        }
    }
      , v = new ft;
    var ut = class extends S {
        constructor() {
            super();
            this.instance = {
                lastFrameTime: 0,
                nextFrame: null,
                targetFPS: 60
            },
            this.targetDelta = 1e3 / this.instance.targetFPS,
            this.delta = this.targetDelta,
            this.maxDelta = this.targetDelta * 2,
            this.listeners(),
            y(this, ["run"]),
            this.paused = !0,
            this.play()
        }
        run(t=0) {
            this.delta = t - (this.instance.lastFrameTime || 0),
            this.instance.nextFrame = requestAnimationFrame(this.run),
            this.instance.lastFrameTime = t,
            this.delta = Math.min(this.delta, this.maxDelta);
            for (let e = 0, r = this.train.length; e < r; e++)
                this.train[e]?.update(this.delta, t)
        }
        pause() {
            this.paused || !this.instance || (cancelAnimationFrame(this.instance.nextFrame),
            this.instance.nextFrame = null,
            this.paused = !0)
        }
        play() {
            !this.paused || (this.paused = !1,
            this.instance.lastFrameTime = performance.now(),
            this.instance.nextFrame = requestAnimationFrame(this.run))
        }
        listeners() {
            v.add(document, "visibilitychange", ()=>{
                document.visibilityState === "hidden" ? this.pause() : this.play()
            }
            ),
            !c.safari && v.add(window, "pagehide", this.pause)
        }
    }
      , j = new ut;
    var gt = class extends S {
        constructor() {
            super();
            y(this, ["update"]),
            this.throttledUpdate = _({
                update: this.update,
                onlyAtEnd: !0
            }),
            this.listen()
        }
        listen() {
            let t = c.mobile ? "orientationchange" : "resize";
            v.add(window, t, this.throttledUpdate)
        }
        update() {
            let t = {
                vw: window.innerWidth,
                vh: window.innerHeight
            }
              , e = this.train.length;
            for (let r = 0; r < e; r++)
                this.train[r].update(t)
        }
    }
      , T = new gt;
    var tt = {
        linear: s=>s,
        i1: s=>-Math.cos(s * (Math.PI / 2)) + 1,
        o1: s=>Math.sin(s * (Math.PI / 2)),
        io1: s=>-.5 * (Math.cos(Math.PI * s) - 1),
        i2: s=>s * s,
        o2: s=>s * (2 - s),
        io2: s=>s < .5 ? 2 * s * s : -1 + (4 - 2 * s) * s,
        i3: s=>s * s * s,
        o3: s=>--s * s * s + 1,
        io3: s=>s < .5 ? 4 * s * s * s : (s - 1) * (2 * s - 2) * (2 * s - 2) + 1,
        i4: s=>s * s * s * s,
        o4: s=>1 - --s * s * s * s,
        io4: s=>s < .5 ? 8 * s * s * s * s : 1 - 8 * --s * s * s * s,
        i5: s=>s * s * s * s * s,
        o5: s=>1 + --s * s * s * s * s,
        io5: s=>s < .5 ? 16 * s * s * s * s * s : 1 + 16 * --s * s * s * s * s,
        i6: s=>s === 0 ? 0 : Math.pow(2, 10 * (s - 1)),
        o6: s=>s === 1 ? 1 : 1 - Math.pow(2, -10 * s),
        io6: s=>s === 0 ? 0 : s === 1 ? 1 : (s /= .5) < 1 ? .5 * Math.pow(2, 10 * (s - 1)) : .5 * (-Math.pow(2, -10 * --s) + 2)
    };
    var $ = class {
        constructor({duration: t, update: e, complete: r, reverse: i=!1}) {
            this.config = {
                complete: r,
                update: e,
                duration: t,
                reverse: i
            },
            y(this, ["run", "play", "pause", "restart"]),
            this.destroy = this.pause,
            this.init()
        }
        init() {
            this.completed = !1,
            this.elapsed = this.config.reverse ? this.config.duration : 0,
            this.progress = this.config.reverse ? 1 : 0,
            this.paused = !0,
            this.play()
        }
        run(t=j.delta) {
            let e = this.config;
            this.progress >= 1 && !e.reverse || this.progress <= 0 && e.reverse ? (this.pause(),
            this.completed = !0,
            e.complete && e.complete()) : (this.elapsed += e.reverse ? -t : t,
            this.progress = P(this.elapsed / e.duration, 0, 1),
            e.update && e.update({
                progress: this.progress,
                elapsed: this.elapsed
            }))
        }
        play() {
            !this.paused || (this.paused = !1,
            this.id = j.add({
                update: this.run
            }))
        }
        pause() {
            this.paused || (this.paused = !0,
            j.remove(this.id))
        }
        restart() {
            this.pause(),
            this.init()
        }
        reverse() {
            this.config.reverse = !this.config.reverse
        }
    }
    ;
    var N = class {
        constructor({x: t=null, y: e=null, xu: r="px", yu: i="px", sx: o=null, sy: n=null, r: a=null}) {
            this.props = {
                x: t,
                xu: r,
                y: e,
                yu: i,
                sx: o,
                sy: n,
                r: a
            },
            this.flags = {
                t: !1,
                s: !1,
                r: !1
            },
            this.setFlags(),
            this.setTransform(this.props)
        }
        setFlags() {
            let {x: t, y: e, sx: r, sy: i, r: o} = this.props;
            (t || e || t === 0 || e === 0) && (!t && t !== 0 && (this.props.x = 0),
            !e && e !== 0 && (this.props.y = 0),
            this.flags.t = !0),
            (r || i || r === 0 || i === 0) && (!r && r !== 0 && (this.props.sx = 1),
            !i && i !== 0 && (this.props.sy = 1),
            this.flags.s = !0),
            o && (!o[0] && o[0] !== 0 && (this.props.r[0] = 0),
            !o[1] && o[1] !== 0 && (this.props.r[1] = 0),
            !o[2] && o[2] !== 0 && (this.props.r[2] = 0),
            !o[3] && o[3] !== 0 && (this.props.r[3] = 0),
            this.flags.r = !0)
        }
        setTransform(t) {
            let e = this.props;
            if (Object.assign(e, t),
            this.transform = "",
            this.flags.t) {
                let {x: r, y: i, xu: o, yu: n} = e;
                this.transform += `translate3d(${r}${o}, ${i}${n}, 0) `
            }
            if (this.flags.s && (this.transform += `scale3d(${e.sx}, ${e.sy}, 1) `),
            this.flags.r) {
                let {rx: r, ry: i, rz: o, rv: n} = t;
                this.transform += `rotate3d(${r}, ${i}, ${o}, ${n}deg)`
            }
        }
        convert2d() {
            let {x: t, y: e, sx: r, sy: i, xu: o, yu: n, rx: a, ry: h, rz: l, rv: d} = this.props;
            this.transform = "",
            this.flags.t && (t === 0 && e === 0 && !this.flags.s && !this.flags.r ? this.transform = "translate(0)" : this.transform = `translate(${t}${o}, ${e}${n})`),
            this.flags.s && (this.transform += ` scale(${r}, ${i})`),
            this.flags.r && d !== 0 && (this.transform += ` rotate3d(${a}, ${h}, ${l}, ${d}deg)`)
        }
        destroy() {
            this.transform = null
        }
    }
    ;
    var V = ({vals: s, duration: t, easing: e="linear", update: r, complete: i, reverse: o})=>{
        let n = tt[e]
          , a = new Float32Array(s.length)
          , h = 0;
        return new $({
            duration: t,
            update: ({progress: l})=>{
                h = n(l);
                for (let d = s.length - 1; d >= 0; d--) {
                    let f = s[d];
                    f[0] === f[1] ? a[d] = f[0] : a[d] = D(f[0], f[1], h)
                }
                r({
                    progress: l,
                    progressEase: h,
                    cur: a
                })
            }
            ,
            complete: i,
            reverse: o
        })
    }
      , et = ({val: s, duration: t, easing: e, update: r, complete: i})=>V({
        duration: t,
        vals: [s],
        easing: e,
        update: ({progress: o, progressEase: n, cur: a})=>{
            r({
                progress: o,
                progressEase: n,
                cur: a[0]
            })
        }
        ,
        complete: i
    })
      , O = class {
        constructor({targets: t=null, duration: e=0, delay: r=0, easing: i="linear", transform: o=null, opacity: n=null, begin: a=null, complete: h=null, update: l=null, autoplay: d=!0, reverse: f=!1}) {
            this.config = {
                targets: t,
                duration: e,
                easing: i,
                begin: a,
                update: l,
                complete: h,
                transform: o,
                opacity: n,
                delay: r,
                autoplay: d,
                reverse: f
            },
            this.flags = {
                t: !!o,
                o: !!n
            },
            y(this, ["run", "restart", "pause", "play", "reverse", "destroy"]),
            this.init()
        }
        init() {
            let t = this.config;
            if (this.flags.t) {
                let e = t.transform;
                this.t3d = new N({
                    ...e,
                    x: e.x && e.x[0],
                    y: e.y && e.y[0],
                    r: e.r && e.r[0]
                })
            }
            this.flags.o && (this.o = t.opacity),
            this.setupProps(),
            this.setTargets(),
            this.start()
        }
        setTargets(t=this.config.targets) {
            t = w(t),
            this.configure({
                targets: t,
                targetsLength: t.length,
                targetsStyles: t.map(e=>e.style)
            })
        }
        setupProps() {
            this.keys = [],
            this.vals = [];
            let e = this.config.transform;
            if (this.flags.t) {
                let r = this.t3d.flags;
                if (r.t && (e.x && (this.keys.push("x"),
                this.vals.push(new Float32Array(e.x))),
                e.y && (this.keys.push("y"),
                this.vals.push(new Float32Array(e.y)))),
                r.s && (e.sx && (this.keys.push("sx"),
                this.vals.push(new Float32Array(e.sx))),
                e.sy && (this.keys.push("sy"),
                this.vals.push(new Float32Array(e.sy)))),
                r.r) {
                    let i = e.r
                      , o = i[0]
                      , n = i[1];
                    this.keys.push("rx", "ry", "rz", "rv"),
                    this.vals.push(new Float32Array([o[0], n[0]]), new Float32Array([o[1], n[1]]), new Float32Array([o[2], n[2]]), new Float32Array([o[3], n[3]]))
                }
            }
            this.flags.o && (this.keys.push("o"),
            this.vals.push(new Float32Array(this.o))),
            this.props = {},
            this.cur = [],
            this.vals.forEach((r,i)=>{
                this.cur[i] = r[0]
            }
            )
        }
        start(t={}) {
            this.configure(t);
            let e = this.config;
            this.tweens = V({
                vals: t.vals || this.vals,
                duration: e.duration,
                easing: e.easing,
                update: this.run,
                complete: ()=>{
                    e.complete && e.complete(),
                    this.destroy()
                }
            }),
            this.tweens.pause(),
            this.delay = new $({
                duration: e.delay,
                complete: ()=>{
                    this.tweens.play(),
                    e.begin && e.begin()
                }
            }),
            e.autoplay || this.delay.pause()
        }
        run({progress: t, progressEase: e, cur: r}) {
            this.cur = r;
            for (let i = 0, o = this.keys.length; i < o; i++) {
                let n = this.keys[i];
                this.props[n] = H(r[i])
            }
            this.flags.t && this.t3d.setTransform(this.props);
            for (let i = 0, o = this.config.targetsLength; i < o; i++) {
                let n = this.config.targetsStyles[i];
                this.flags.t && (n.transform = this.t3d.transform),
                this.flags.o && (n.opacity = this.props.o)
            }
            this.config.update && this.config.update({
                progress: t,
                progressEase: e,
                props: this.props,
                config: this.config
            })
        }
        unset3d() {
            if (!!this.flags.t) {
                this.t3d.convert2d();
                for (let t of this.config.targets)
                    t.style.transform = this.t3d.transform
            }
        }
        restart(t={}) {
            this.delay.destroy(),
            this.tweens.destroy(),
            this.start(t)
        }
        pause() {
            this.delay.pause(),
            this.tweens.pause()
        }
        play() {
            this.delay.play(),
            this.delay.completed && this.tweens.play()
        }
        configure(t={}) {
            Object.assign(this.config, t)
        }
        reverse(t={}) {
            this.tweens.destroy(),
            this.configure(t);
            let e = this.config;
            e.reverse = !e.reverse;
            let r = e.reverse ? 0 : 1
              , i = new Array(this.vals.length);
            for (let o = this.vals.length - 1; o >= 0; o--)
                i[o] = [this.cur[o], this.vals[o][r]];
            this.start({
                vals: i
            })
        }
        destroy() {
            this.delay.destroy(),
            this.tweens.destroy(),
            idly(()=>{
                this.unset3d(),
                this.t3d && this.t3d.destroy()
            }
            )
        }
    }
      , st = class extends S {
        constructor() {
            super()
        }
        do(t, e) {
            this.train.forEach(r=>r.anim[t](e))
        }
    }
      , C = class extends st {
        constructor(t) {
            super();
            this.delay = 0,
            this.defaults = t || {}
        }
        add(t) {
            t = {
                ...this.defaults,
                ...t
            };
            let e = new O(t)
              , r = super.add({
                anim: e
            });
            return {
                anim: e,
                id: r
            }
        }
        play() {
            this.do("play")
        }
        pause() {
            this.do("pause")
        }
    }
    ;
    var q = ({targets: s, invert: t, duration: e, easing: r, begin: i, update: o, complete: n, reverse: a})=>{
        let h = w(s)
          , l = [];
        h.forEach(p=>{
            l.push(...A("path", p))
        }
        ),
        h = l;
        let d = h.length
          , f = new Float32Array(d)
          , x = [];
        for (let p = 0; p < d; p++) {
            let g = h[p]
              , u = g.getTotalLength();
            f[p] = u,
            g.style.strokeDasharray = u,
            g.style.strokeDashoffset = u,
            t ? x.push([0, u]) : x.push([-u, 0])
        }
        return i && i(),
        V({
            vals: x,
            duration: e,
            easing: r,
            reverse: a,
            complete: n,
            update: ({cur: p})=>{
                for (let g = 0; g < d; g++)
                    h[g].style.strokeDashoffset = p[g];
                o && o({
                    cur: p
                })
            }
        })
    }
    ;
    var rt = {
        essential: ["../static/about.jpg", "../static/team.png", "../static/compass/main.jpg", "../static/compass/bottom.png", "../static/compass/left.png", "../static/compass/center.png"],
        fonts: ["sans", "sans-serif"]
    };
    var mt = class {
        constructor({begin: t=()=>{}
        , update: e, complete: r=()=>{}
        }={}) {
            Object.assign(this, {
                begin: t,
                update: e,
                complete: r
            })
        }
        async init() {
            await Promise.all([this.begin(), await Promise.all([this.images(), this.fonts(), this.videos()])]),
            await this.complete()
        }
        async fonts() {
            "fonts"in document && await Promise.all(rt.fonts.map(t=>document.fonts.load(`1em ${t}`)))
        }
        images() {
            let t = m("#img-preload")
              , r = A("img", t).map(i=>i.dataset.lazySrc).filter(K);
            return rt.essential.push(...r),
            new Promise(i=>{
                Z({
                    arr: rt.essential,
                    update: (o,n,a)=>{
                        this.update && this.update(a)
                    }
                    ,
                    complete: ()=>{
                        i(),
                        t.remove()
                    }
                })
            }
            )
        }
        async videos() {}
    }
      , it = m("#loader")
      , Rt = m("#loader-wrapper", it)
      , yt = m("#loader-percent", it)
      , wt = m("#loadbar", it)
      , Yt = window.innerHeight
      , Ut = window.innerWidth
      , vt = Ut / (c.mobile ? 375 : 1440)
      , xt = (c.mobile ? 58 : 105) * vt
      , bt = Yt - (c.mobile ? 85 : 120) * vt
      , kt = xt - bt
      , Tt = bt / xt
      , At = new mt({
        update: s=>{
            yt.innerText = Math.floor(s)
        }
        ,
        complete: async()=>{
            await new Promise(s=>{
                new O({
                    targets: wt,
                    transform: {
                        sy: [0, Tt]
                    },
                    duration: 1250,
                    easing: "io6"
                }),
                new O({
                    targets: wt,
                    transform: {
                        sy: [Tt, 1],
                        y: [0, kt]
                    },
                    duration: 1500,
                    easing: "io6",
                    delay: 1100
                }),
                new O({
                    targets: Rt,
                    transform: {
                        y: [0, kt]
                    },
                    duration: 1500,
                    easing: "io6",
                    delay: 1100,
                    complete: s
                }),
                new O({
                    targets: yt,
                    transform: {
                        y: [0, -100],
                        yu: "%"
                    },
                    duration: 1750,
                    easing: "o6",
                    delay: 1800
                })
            }
            ),
            it.remove()
        }
    });
    var ot = m("#text-reveal")
      , Vt = ot.style
      , z = class {
        constructor({targets: t, stagger: e=0, delay: r=0, auto: i=!1, threshold: o=.5, easing: n="o6", duration: a=1750, indent: h=0, indentFrom: l=0, indentTo: d=1, from: f=102, to: x=0, char: p=!1, skipGuarantee: g=!1, rotate: u=!1, insert: M=[]}) {
            Object.assign(this, {
                targets: w(t),
                stagger: e,
                delay: r,
                auto: i,
                threshold: o,
                easing: n,
                duration: a,
                indent: h,
                indentFrom: l,
                indentTo: d,
                from: f,
                to: x,
                char: p,
                skipGuarantee: g,
                rotate: u
            }),
            this.cache = new Map,
            this.targets.forEach((F,k)=>{
                this.cache.set(k, F.textContent.replace(/\s\s+/g, " ").trim())
            }
            ),
            this.triggered = !1,
            y(this, ["resize", "play", "destroy"]),
            this.bounds = {
                vw: window.innerWidth,
                vh: window.innerHeight
            },
            T.add({
                update: this.resize
            }),
            this.auto && this.observe(),
            this.tween = new C,
            M.length && (this.insert = M),
            this.resize()
        }
        resize(t={
            vw: window.innerWidth,
            vh: window.innerHeight
        }) {
            this.bounds = t,
            this.destroy(),
            this.indent && (this.compIndent = this.indent * t.vw * .01);
            let e = this.targets.length;
            for (let r = 0; r < e; r++) {
                let i = this.targets[r]
                  , o = [];
                if (this.skipGuarantee || i.dataset.skipGuarantee)
                    o.push(this.cache.get(r));
                else {
                    let x = i.offsetWidth
                      , p = window.getComputedStyle(i)
                      , g = Vt;
                    g.fontFamily = p.getPropertyValue("font-family"),
                    g.fontSize = p.getPropertyValue("font-size"),
                    g.fontWeight = p.getPropertyValue("font-weight"),
                    g.letterSpacing = p.getPropertyValue("letter-spacing"),
                    g.textTransform = p.getPropertyValue("text-transform");
                    let u = []
                      , M = this.cache.get(r).split(" ")
                      , F = M.length;
                    for (let k = 0; k < F; k++) {
                        let X = M[k];
                        if (X === " ")
                            continue;
                        u.push(X),
                        ot.textContent = u.join(" ");
                        let W = x;
                        this.compIndent > 0 && o.length >= this.indentFrom && o.length < this.indentTo && (W = x - this.compIndent),
                        ot.offsetWidth >= W && (u.pop(),
                        o.push(u.join(" ")),
                        u = [X]),
                        X === "XBRX" && (u.pop(),
                        o.push(u.join(" ")),
                        u = [])
                    }
                    o.push(u.join(" "))
                }
                let n = document.createDocumentFragment()
                  , a = o.length
                  , h = 0
                  , l = 0
                  , d = 0
                  , f = 0;
                for (let x = 0; x < a; x++) {
                    let p = o[x];
                    if (p.length === 0)
                        continue;
                    let g = document.createElement("span");
                    if (this.char) {
                        g.classList.add("l-char--wrapper");
                        let u = p.length;
                        for (let M = 0; M < u; M++) {
                            let F = p[M]
                              , k = document.createElement("span");
                            k.classList.add("l-char"),
                            this.visible && (k.style.transform = "none"),
                            F === " " && k.classList.add("l-space"),
                            k.innerText = F,
                            g.appendChild(k)
                        }
                    } else {
                        g.classList.add("l-wrapper");
                        let u = document.createElement("span");
                        if (u.classList.add("l-line"),
                        this.visible && (u.style.transform = "none"),
                        this.insert && h < this.insert.length) {
                            l += p.length,
                            f = 0;
                            let M = !1;
                            for (let F = h; F < this.insert.length; F++) {
                                let k = this.insert[F]
                                  , X = k.index - d + f
                                  , W = k.token;
                                if (k.index < l)
                                    p = p.substring(0, X) + W + p.substring(X),
                                    u.innerHTML = p,
                                    f += W.length,
                                    h = F + 1,
                                    M = !0;
                                else {
                                    M ? u.innerHTML = p : u.innerText = p + " ";
                                    break
                                }
                            }
                            d = l
                        } else
                            u.innerText = p + " ";
                        g.appendChild(u)
                    }
                    n.appendChild(g)
                }
                i.innerHTML = null,
                i.appendChild(n),
                ot.textContent = ""
            }
            if (this.targetLines = this.getTargets(this.targets),
            this.indent) {
                let r = Math.min(this.indentTo, this.targetLines.length);
                for (let i = 0; i < e; i++) {
                    let o = this.targets[i];
                    for (let n = this.indentFrom; n < r; n++)
                        o.children[0].children[n].style.textIndent = `${this.compIndent}px`
                }
            }
            this.auto && !this.visible && this.observeTargets(),
            this.isResizing = !1
        }
        getTargets(t) {
            let e = [];
            return t = w(t),
            t.forEach(r=>{
                [...r.children].forEach(i=>{
                    this.char ? e = [...e, ...i.children] : e.push(i.children[0])
                }
                )
            }
            ),
            e
        }
        play({targets: t=this.targetLines, delay: e=this.delay, to: r=this.to, from: i=this.from, duration: o=this.duration, easing: n=this.easing, stagger: a=this.stagger, reverse: h=!1, reverseDelay: l=0, visible: d=!0, autoplay: f=!0}={}) {
            if (h && this.tween)
                this.tween.do("reverse", {
                    targets: t,
                    delay: l || 0
                });
            else {
                this.tween = new C({
                    duration: o,
                    easing: n
                });
                let x = t.length;
                this.visible = d;
                for (let p = 0; p < x; p++) {
                    let g = t[p];
                    this.tween.add({
                        targets: g,
                        delay: e + p * a,
                        autoplay: f,
                        transform: {
                            y: [i, r],
                            yu: "%",
                            r: this.rotate ? [[1, 0, 0, -90], [1, 0, 0, 0]] : !1
                        }
                    })
                }
            }
        }
        playTo({delay: t=this.delay, to: e=this.to, duration: r=this.duration, easing: i=this.easing, stagger: o=this.stagger, visible: n=!0}={}) {
            if (this.visible = n,
            !this.tween.train.length)
                return this.play({
                    delay: this.delay,
                    to: this.to,
                    duration: this.duration,
                    easing: this.easing,
                    stagger: this.stagger,
                    visible: n
                });
            let a = this.tween.train.map(l=>l.anim.cur)
              , h = a.length;
            this.tween.do("destroy"),
            this.tween = new C({
                targets: this.targetLines,
                duration: r,
                easing: i
            });
            for (let l = 0; l < h; l++) {
                let d = this.targetLines[l]
                  , f = a[l];
                this.tween.add({
                    targets: d,
                    delay: t + l * o,
                    transform: {
                        y: [f[0], e],
                        yu: "%",
                        r: this.rotate ? [[f[1], f[2], f[3], f[4]], [1, 0, 0, e === 0 ? 0 : 90]] : !1
                    }
                })
            }
            return this.tween
        }
        observe() {
            this.observer?.disconnect(),
            this.observer = L().create({
                callback: (t,e,r)=>{
                    e && (this.play({
                        targets: this.getTargets(t),
                        from: this.from
                    }),
                    r(t),
                    this.triggered = !0)
                }
                ,
                threshold: this.threshold
            })
        }
        observeTargets() {
            this.observer.observe(this.targets)
        }
        destroy() {
            this.observer?.disconnect(),
            this.tween?.do("destroy")
        }
    }
    ;
    var St = class extends S {
        constructor() {
            super();
            this.scrollContent = m("[data-scroll-content]"),
            this.state = this.getScroll(),
            this.vw = window.innerWidth,
            this.vh = window.innerHeight,
            y(this, ["update", "resize", "lock", "unlock"]),
            this.resize(),
            this.listen(),
            this.locked = !1,
            j.add({
                update: this.update
            }),
            T.add({
                update: this.resize
            })
        }
        getScroll() {
            return {
                x: window.pageXOffset,
                y: window.pageYOffset
            }
        }
        setScroll({x: t=this.state.x, y: e=this.state.y}={}) {
            this.locked || (this.state.y = P(e, 0, this.scrollHeight),
            this.state.x = 0)
        }
        listen() {
            this.wheel(),
            this.key()
        }
        lock() {
            this.locked = !0
        }
        unlock() {
            this.locked = !1
        }
        wheel() {
            v.add(window, "wheel", t=>{
                let e = t.deltaX
                  , r = t.deltaY;
                c.firefox && t.deltaMode === 1 && (e *= 60,
                r *= 60),
                this.setScroll({
                    x: this.state.x + e,
                    y: this.state.y + r
                })
            }
            )
        }
        key() {
            v.add(document, "keydown", t=>{
                switch (t.key) {
                case "ArrowDown":
                    this.setScroll({
                        y: this.state.y + 100
                    });
                    break;
                case "ArrowUp":
                    this.setScroll({
                        y: this.state.y - 100
                    });
                    break;
                case "PageDown":
                    this.setScroll({
                        y: this.state.y + this.vh
                    });
                    break;
                case "PageUp":
                    this.setScroll({
                        y: this.state.y - this.vh
                    });
                    break;
                case " ":
                    if (t.target.nodeName === "INPUT" || t.target.nodeName === "TEXTAREA")
                        return;
                    this.setScroll({
                        y: this.state.y + (this.vh - 40) * (t.shiftKey ? -1 : 1)
                    })
                }
            }
            )
        }
        resize({vw: t, vh: e}={
            vw: window.innerWidth,
            vh: window.innerHeight
        }) {
            this.vh = e,
            this.vw = t,
            this.scrollHeight = Math.max(U(this.scrollContent).height, e) - e,
            this.setScroll()
        }
        update() {
            for (let t = 0, e = this.train.length; t < e; t++)
                this.train[t].update(this.state)
        }
    }
      , b = new St;
    var nt = .002
      , Et = class extends S {
        constructor(t) {
            super();
            this.settings = t,
            this.clearState(),
            this.scrollSections = [],
            this.scrollCover = m("#scroll-cover"),
            this.lerp = {
                needsUpdate: ()=>{}
            },
            this.style(),
            this.listen(),
            y(this, ["update", "resize"]),
            b.add({
                update: this.update
            }),
            T.add({
                update: this.resize
            })
        }
        clearState() {
            this.state = {
                scroll: {
                    inertia: this.settings.inertia,
                    target: nt,
                    cur: 0
                },
                drag: {
                    isDragging: !1,
                    snap: {
                        x: 0,
                        y: 0
                    },
                    cur: {
                        x: 0,
                        y: 0
                    },
                    last: {
                        x: 0,
                        y: 0
                    },
                    inertia: .01,
                    speed: this.settings.dragSpeed
                },
                locked: !1
            }
        }
        init({linearGuarantee: t=!0}={}) {
            this.scrollContent = b.scrollContent,
            this.scrollSections = A("[data-scroll-section]", this.scrollContent),
            this.scrollSections = this.scrollSections.length === 0 ? [this.scrollContent] : this.scrollSections,
            this.clearState(),
            this.linearGuarantee = t,
            b.unlock(),
            b.setScroll({
                x: 0,
                y: 0
            }),
            b.resize(),
            this.lerp = new B(this.state.scroll),
            this.anchors(),
            (c.firefox || c.safari) && (this.badBrowsers && this.badBrowsers.forEach(e=>e()),
            this.badBrowsers = [],
            A("a").forEach(e=>{
                if (m("img", e)) {
                    let r = v.add(e, "dragstart", i=>{
                        i.preventDefault()
                    }
                    , {
                        passive: !1
                    });
                    this.badBrowsers.push(r)
                }
            }
            )),
            this.resize()
        }
        style() {
            c.touchDevice || (document.body.style.overscrollBehavior = "none",
            b.scrollContent.style.position = "fixed",
            c.firefox && v.add("img", "dragstart", t=>{
                t.preventDefault()
            }
            , {
                passive: !1
            }))
        }
        clamp(t) {
            return P(t, 0, this.scrollHeight)
        }
        getXY(t) {
            let e = t.changedTouches ? t.changedTouches[0].clientX : t.clientX
              , r = t.changedTouches ? t.changedTouches[0].clientY : t.clientY;
            return {
                x: e,
                y: r
            }
        }
        listen() {
            if (c.touchDevice)
                return;
            let t = this.state.drag;
            v.add(window, "pointerdown", e=>{
                this.state.locked || (t.isDragging = !0,
                t.snap = this.getXY(e),
                t.last = {
                    ...b.state
                })
            }
            ),
            v.add(window, "pointermove", e=>{
                if (!t.isDragging || this.state.locked)
                    return;
                t.cur = this.getXY(e);
                let r = (t.cur.y - t.snap.y) * t.speed;
                Math.abs(r) < 15 || b.setScroll({
                    y: t.last.y - r
                })
            }
            ),
            v.add(window, "pointerup", e=>{
                !t.isDragging || (t.isDragging = !1)
            }
            )
        }
        anchors() {
            this.unlistenAnchors && this.unlistenAnchors(),
            this.unlistenAnchors = v.add("[data-scroll-to]", "click", t=>{
                let e = t.target.closest("[data-scroll-to]");
                this.scrollByAnchor(e)
            }
            )
        }
        resize() {
            if (!c.touchDevice) {
                this.cache = [];
                for (let t of this.scrollSections)
                    t.style.transform = "none";
                for (let t of this.scrollSections) {
                    let e = U(t)
                      , r = e.bottom
                      , i = e.top - b.vh
                      , {progress: o, visible: n} = this.getIntersection({
                        top: i,
                        bottom: r
                    })
                      , a = t.dataset
                      , h = a.scrollSpeed !== void 0 ? parseFloat(a.scrollSpeed) : 1
                      , l = a.scrollContainer
                      , d = a.hide !== void 0
                      , f = a.scrollPreserve !== void 0;
                    this.cache.push({
                        dom: t,
                        top: i,
                        bottom: r,
                        visible: n,
                        progress: o,
                        speed: h,
                        container: l,
                        hide: d,
                        freeze: !1,
                        preserve: f
                    })
                }
                this.state.scroll.target += nt,
                this.update(),
                requestAnimationFrame(()=>b.resize())
            }
        }
        scrollByAnchor(t, e=!1) {
            if (!t)
                return;
            let r = t.dataset.scrollTo
              , i = parseFloat(t.dataset.scrollOffset) || 0
              , o = m(r);
            if (!o)
                return;
            let n = 0
              , a = o;
            for (; a; )
                n += a.offsetTop,
                a = a.offsetParent;
            let h = this.state.scroll.target
              , l = Math.abs(h - n)
              , d = Q(l, 0, b.scrollHeight, 2, 6)
              , f = `io ${P(Math.round(d), 2, 6)}`;
            this.scrollToTween?.destroy(),
            e ? this.snapTo({
                y: n + i
            }) : this.scrollToTween = et({
                val: [h, n + i],
                duration: d * 100,
                easing: f,
                update: ({cur: x})=>{
                    this.scrollTo({
                        y: x
                    })
                }
            })
        }
        scrollTo({x: t, y: e}) {
            c.touchDevice ? window.scrollTo({
                left: t,
                top: e,
                behavior: "smooth"
            }) : b.setScroll({
                x: t,
                y: e
            })
        }
        snapTo({x: t, y: e}) {
            c.touchDevice ? window.scrollTo({
                left: t,
                top: e,
                behavior: "auto"
            }) : (b.setScroll({
                x: t,
                y: e
            }),
            this.state.scroll.cur = e,
            this.state.scroll.target = e + nt)
        }
        getIntersection({top: t, bottom: e, y: r=this.state.scroll.target}) {
            let i = {
                progress: 0,
                visible: !1
            };
            return r > t && r < e && (i.visible = !0,
            i.progress = (r - t) / (e - t + b.vh)),
            i
        }
        update(t=b.state) {
            if (this.state.locked || c.touchDevice)
                return;
            let e = this.state;
            if (e.scroll.cur = t.y,
            this.scrollCover.style.pointerEvents = this.lerp.delta > 1 ? "all" : "none",
            !!this.lerp.needsUpdate()) {
                this.lerp.update();
                for (let r of this.cache) {
                    let i = H(e.scroll.target) * r.speed
                      , o = this.getIntersection({
                        top: r.top,
                        bottom: r.bottom,
                        y: i
                    });
                    r.visible = o.visible,
                    r.progress = o.progress,
                    this.render(r, i)
                }
                for (let r of this.train)
                    r.update(e, this.cache)
            }
        }
        render(t, e) {
            let r = t.dom.style;
            t.visible || t.preserve ? (t.freeze = !1,
            Object.assign(r, {
                transform: `translate3d(0, ${-e}px, 0)`,
                pointerEvents: "all",
                opacity: 1
            })) : t.hide ? t.freeze || (t.freeze = !0,
            Object.assign(r, {
                transform: `translateY(${-e}px)`,
                pointerEvents: "none",
                opacity: 0
            })) : Object.assign(r, {
                transform: "none",
                pointerEvents: "none",
                opacity: 0
            })
        }
        lock() {
            this.state.locked = !0,
            b.lock()
        }
        unlock() {
            this.state.locked = !1,
            b.unlock()
        }
    }
      , Mt = new Et({
        inertia: c.touchDevice ? .125 : .075,
        dragSpeed: 3
    });
    var R = Mt;
    var E = class {
        constructor({dom: t, speed: e=1.5, down: r=!1, scale: i=1.5, rotate: o={
            start: 0,
            end: 0
        }, offset: n={
            start: 0,
            end: 0
        }, offsetX: a=0}) {
            this.dom = w(t)[0],
            this.id = this.dom.dataset.scrollWatch,
            this.speed = e,
            this.offset = n,
            this.offsetX = a,
            this.scale = i,
            this.rotate = o,
            this.down = r ? -1 : 1,
            this.range = (e - 1) * 100,
            this.current = 0,
            this.currentRotate = 0,
            this.needsRotate = this.rotate.start !== this.rotate.end || this.rotate.start !== 0 || this.rotate.end !== 0,
            y(this, ["update", "resize"]),
            this.scrollid = R.add({
                update: this.update
            }),
            this.rsize = T.add({
                update: this.resize
            }),
            this.resize()
        }
        resize() {
            this.render(),
            this.update(R.state, R.cache)
        }
        update(t, e=[]) {
            for (let r = 0, i = e.length; r < i; r++) {
                let o = e[r];
                if (o.visible && o.container === this.id) {
                    this.current = D(-this.range + this.offset.start, this.range + this.offset.end, o.progress),
                    this.needsRotate && (this.currentRotate = D(this.rotate.start, this.rotate.end, o.progress)),
                    this.render();
                    break
                }
            }
        }
        render() {
            this.dom.style.transform = `scale(${this.scale}) translate3d(${this.offsetX}%, ${this.current * this.down}%, 0) rotate(${this.currentRotate}deg)`
        }
        destroy() {
            R.remove(this.scrollid),
            T.remove(this.rsize)
        }
    }
    ;
    var Wt = (s,t,e)=>{
        requestAnimationFrame(()=>{
            t ? (s.classList.contains("fx-once") && e(s),
            s.classList.add("fx-on")) : s.classList.remove("fx-on")
        }
        )
    }
      , zt = class {
        constructor({callback: t}={}) {
            this.o = L().create({
                callback: t || Wt
            })
        }
        add(t=".fx") {
            this.o.observe(t)
        }
        remove(t) {
            this.o.unobserve(t)
        }
        destroy() {
            this.o.disconnect()
        }
    }
      , at = new zt;
    var Y = new C, Ft, Lt, Ct, lt, ht = {
        build: ()=>{
            Y.add({
                targets: "#logo-inner",
                transform: {
                    y: [100, 0],
                    yu: "%"
                },
                duration: 2e3,
                easing: "o6"
            }),
            Y.add({
                targets: "#nav-dash",
                transform: {
                    sx: [0, 1]
                },
                duration: 1500,
                easing: "io6",
                delay: 250
            }),
            Ft = new z({
                targets: ".nav-txt",
                stagger: 75,
                delay: 150,
                duration: 1750
            }),
            A(".nav-arr svg").map((i,o)=>Y.add({
                targets: i,
                transform: {
                    y: [100, 0],
                    yu: "%"
                },
                delay: 150 + o * 75,
                duration: 1750,
                easing: "o6"
            })),
            Lt = new z({
                targets: "#hero-desc",
                stagger: 100,
                delay: 750,
                duration: 2500
            }),
            Ct = new z({
                targets: "#hero-title",
                stagger: 200,
                delay: 250,
                duration: 1750,
                insert: [{
                    index: c.mobile ? 16 : 17,
                    token: '<span class="highlight">'
                }, {
                    index: c.mobile ? 24 : 25,
                    token: "</span>"
                }, {
                    index: c.mobile ? 24 : 26,
                    token: '<span class="highlight">'
                }, {
                    index: 32,
                    token: "</span>"
                }, {
                    index: c.mobile ? 32 : 33,
                    token: '<span class="highlight">'
                }, {
                    index: 34,
                    token: "</span>"
                }, {
                    index: 34,
                    token: '<span class="highlight">'
                }, {
                    index: 42,
                    token: "</span>"
                }]
            });
            let s = q({
                targets: "#hero-arr--svg",
                duration: 3e3,
                easing: "o6"
            });
            if (s.pause(),
            lt = new $({
                duration: 1e3,
                complete: ()=>{
                    s.play()
                }
            }),
            lt.pause(),
            Y.add({
                targets: "#scroll-hint--hero",
                transform: {
                    sx: [0, 1],
                    sy: [0, 1],
                    r: [[0, 0, 1, 90], [0, 0, 1, 0]]
                },
                delay: 1e3,
                duration: 2500,
                easing: "o6",
                begin: ()=>{
                    q({
                        targets: "#scroll-hint--svg",
                        duration: 2e3,
                        easing: "i2",
                        invert: !0,
                        reverse: !0
                    })
                }
            }),
            c.mobile)
                Y.add({
                    targets: "#nav-btn",
                    duration: 2500,
                    easing: "o6",
                    transform: {
                        sx: [0, 1]
                    }
                });
            else {
                new E({
                    dom: "#team-more",
                    speed: -.1,
                    rotate: {
                        start: -5,
                        end: -5
                    },
                    scale: 1,
                    offset: {
                        start: 0,
                        end: -50
                    }
                }),
                new E({
                    dom: "#team-picture",
                    speed: -.1,
                    rotate: {
                        start: 0,
                        end: 18
                    },
                    scale: 1,
                    offset: {
                        start: -25,
                        end: -25
                    }
                }),
                new E({
                    dom: "#team-picture img",
                    speed: 1,
                    scale: 1.25,
                    offset: {
                        start: -50,
                        end: 50
                    }
                }),
                new E({
                    dom: "#team-star--sm",
                    speed: 1,
                    rotate: {
                        start: 0,
                        end: 356
                    },
                    scale: 1
                }),
                new E({
                    dom: "#contact-btn",
                    speed: -1,
                    rotate: {
                        start: -6,
                        end: -6
                    },
                    scale: 1,
                    offset: {
                        start: -100,
                        end: -100
                    }
                }),
                new E({
                    dom: "#engage-list li:nth-of-type(2)",
                    speed: 1,
                    scale: 1,
                    offset: {
                        start: 125,
                        end: -100
                    }
                }),
                new E({
                    dom: "#compass",
                    speed: 1,
                    scale: 1,
                    rotate: {
                        start: 70,
                        end: -70
                    },
                    offset: {
                        start: -50,
                        end: -50
                    },
                    offsetX: -50
                }),
                new E({
                    dom: "#compass-bg",
                    speed: 1.1,
                    scale: 1,
                    offset: {
                        start: 20,
                        end: -10
                    }
                }),
                new E({
                    dom: "#compass-circle--bottom",
                    speed: 1,
                    scale: 1,
                    offset: {
                        start: -40,
                        end: 75
                    },
                    rotate: {
                        start: 90,
                        end: -90
                    }
                }),
                new E({
                    dom: "#compass-circle--left",
                    speed: 1,
                    scale: 1,
                    offset: {
                        start: -50,
                        end: 50
                    },
                    rotate: {
                        start: 90,
                        end: -90
                    }
                }),
                new E({
                    dom: "#compass-circle--right",
                    speed: 1,
                    scale: 1,
                    offset: {
                        start: 50,
                        end: -50
                    },
                    rotate: {
                        start: 90,
                        end: -90
                    }
                });
                let i = q({
                    targets: "#service-arr",
                    duration: 3500,
                    easing: "i2",
                    invert: !0,
                    reverse: !0
                })
                  , o = q({
                    targets: "#service-globe",
                    duration: 3e3,
                    easing: "o3"
                });
                o.pause(),
                i.pause();
                let n = L().create({
                    callback: (l,d,f)=>{
                        d && (i.play(),
                        o.play(),
                        f(l),
                        n.disconnect())
                    }
                    ,
                    threshold: 1
                });
                n.observe("#service-arr");
                let a = q({
                    targets: ".card-icon svg",
                    duration: 2e3,
                    easing: "o3"
                });
                a.pause();
                let h = L().create({
                    callback: (l,d,f)=>{
                        d && (a.play(),
                        f(l),
                        h.disconnect())
                    }
                    ,
                    threshold: 1
                });
                h.observe("#engage-list")
            }
            Y.pause();
            let t = new C
              , e = m("#service-title");
            A(".l-line", e).forEach((i,o)=>{
                t.add({
                    targets: i,
                    transform: {
                        y: [100, 0],
                        yu: "%"
                    },
                    easing: "o6",
                    duration: 1750,
                    delay: o * 75
                })
            }
            ),
            t.pause();
            let r = L().create({
                callback: (i,o,n)=>{
                    o && (t.play(),
                    n(i),
                    r.disconnect())
                }
                ,
                threshold: 1
            });
            r.observe(e),
            new z({
                targets: "#engage-title",
                auto: !0,
                stagger: 150,
                threshold: c.mobile ? .25 : 1,
                indent: c.mobile ? !1 : 13.19,
                insert: [{
                    index: 24,
                    token: '<span class="highlight">'
                }, {
                    index: 35,
                    token: "</span>"
                }]
            }),
            new z({
                targets: "#about-title",
                auto: !0,
                stagger: 150,
                indent: c.mobile ? !1 : 13.19,
                threshold: c.mobile ? .25 : 1
            }),
            new z({
                targets: "[data-reveal-std]",
                auto: !0,
                stagger: 75,
                threshold: c.mobile ? .25 : 1,
                delay: 125
            }),
            new z({
                targets: "[data-reveal-title]",
                auto: !0,
                stagger: 150,
                threshold: c.mobile ? .25 : 1
            }),
            new z({
                targets: "#service-web3",
                char: !0,
                auto: !0,
                stagger: 50
            }),
            at.add("#footer-bar > svg"),
            at.add("#about-picture")
        }
        ,
        play: ()=>{
            Y.play(),
            Ft.play(),
            Lt.play(),
            Ct.play(),
            lt.play()
        }
    };
    var Dt = class {
        constructor() {
            this.nav = m("#nav"),
            this.btn = m("#nav-btn"),
            this.bg = m("#nav-bg"),
            this.nl = m("#nav-list"),
            this.targets = [this.nav, this.btn, this.bg, this.nl],
            y(this, ["toggle"])
        }
        init() {
            this.btn.addEventListener("click", this.toggle),
            this.nl.addEventListener("click", this.toggle)
        }
        toggle() {
            this.targets.forEach(t=>{
                t.classList.toggle("active")
            }
            )
        }
    }
      , Pt = new Dt;
    var Bt = async()=>{
        if (await Promise.all([ht.build(), At.init()]),
        c.mobile) {
            let s = document.documentElement;
            T.add({
                update: ()=>{
                    s.style.setProperty("--screen-x", window.screenX),
                    s.style.setProperty("--screen-y", window.screenY)
                }
            }),
            Pt.init()
        }
        ht.play(),
        R.init()
    }
    ;
    v.add(window, "load", ()=>{
        console.log("Code by: Siddharth \u2014 https://siddharthsham.com"),
        console.log("Design by: Abhishek Jha \u2014 https://abhishekjha.me/"),
        Bt(),
        "serviceWorker"in navigator && window.location.hostname !== "localhost" && navigator.serviceWorker.register("../js/sw.js")
    }
    , {
        once: !0
    });
}
)();
