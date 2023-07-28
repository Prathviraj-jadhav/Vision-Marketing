(()=>{
    var e = {
        essential: ["../static/about.jpg", "../static/team.png", "../static/compass/main.jpg", "../static/compass/bottom.png", "../static/compass/left.png", "../static/compass/center.png"],
        fonts: ["sans", "sans-serif"]
    };
    var a = "sw-v1"
      , n = e.essential;
    self.addEventListener("install", t=>{
        t.waitUntil(caches.open(a).then(s=>s.addAll(n)))
    }
    );
    self.addEventListener("fetch", t=>{
        t.respondWith(caches.match(t.request).then(s=>s || fetch(t.request)))
    }
    );
}
)();
