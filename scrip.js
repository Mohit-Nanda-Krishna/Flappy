(function() {
    const a = document.createElement("link").relList;
    if (a && a.supports && a.supports("modulepreload"))
        return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]'))
        c(r);
    new MutationObserver(r => {
        for (const s of r)
            if (s.type === "childList")
                for (const u of s.addedNodes)
                    u.tagName === "LINK" && u.rel === "modulepreload" && c(u)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function d(r) {
        const s = {};
        return r.integrity && (s.integrity = r.integrity),
        r.referrerPolicy && (s.referrerPolicy = r.referrerPolicy),
        r.crossOrigin === "use-credentials" ? s.credentials = "include" : r.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin",
        s
    }
    function c(r) {
        if (r.ep)
            return;
        r.ep = !0;
        const s = d(r);
        fetch(r.href, s)
    }
}
)();
const i = {
    gravity: .25,
    jump: -6,
    pipeSpeed: 3.5,
    pipeSpawnRate: 100,
    pipeGap: 180,
    pipeWidth: 60,
    bottomBasePadding: 50
};
let e = {
    score: 0,
    bestScore: localStorage.getItem("zoomScore") || 0,
    isPlaying: !1,
    player: {
        x: 50,
        y: 300,
        vy: 0,
        width: 45,
        height: 45,
        rotation: 0
    },
    pipes: [],
    frame: 0
};
const n = {
    player: new Image,
    onpillar: new Image,
    sounds: {
        jump: new Audio("jump.mp3"),
        score: new Audio("score.mp3"),
        hit: new Audio("hit.mp3"),
        background: new Audio("bhAAi.mp3"),
        rakesh_master: new Audio("Rakesh_Master_.mp3")
    }
};
n.sounds.background.loop = !0;
n.sounds.background.addEventListener("ended", function() {
    this.currentTime = 0,
    this.play()
});
n.player.src = "player.jpeg";
n.onpillar.src = "onpillar.jpeg";
const l = document.getElementById("game-canvas")
  , o = l.getContext("2d")
  , g = document.getElementById("start-screen")
  , h = document.getElementById("game-over-screen")
  , w = document.getElementById("score-board")
  , S = document.getElementById("current-score")
  , x = document.getElementById("final-score")
  , P = document.getElementById("best-score")
  , E = document.getElementById("start-btn")
  , I = document.getElementById("restart-btn");
function v() {
    const t = document.getElementById("game-container");
    if (!t)
        return;
    const {width: a, height: d} = t.getBoundingClientRect();
    l.width = a,
    l.height = d,
    e.player.x = l.width * .2
}
window.addEventListener("resize", v);
v();
function L() {
    e.score = 0,
    e.pipes = [],
    e.frame = 0,
    e.player.y = l.height / 2,
    e.player.vy = 0,
    e.player.rotation = 0,
    S.textContent = "0"
}
function B() {
    const a = l.height - i.pipeGap - 100 - i.bottomBasePadding
      , d = Math.floor(Math.random() * (a - 100 + 1)) + 100;
    e.pipes.push({
        x: l.width,
        top: d,
        passed: !1
    })
}
function p(t) {
    t && t.readyState >= 2 && (t.currentTime = 0,
    t.play().catch( () => {}
    ))
}
function C() {
    e.isPlaying && (e.player.vy += i.gravity,
    e.player.y += e.player.vy,
    e.player.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, e.player.vy * .1)),
    (e.player.y + e.player.height / 2 > l.height - i.bottomBasePadding || e.player.y - e.player.height / 2 < 0) && y(),
    e.frame % i.pipeSpawnRate === 0 && B(),
    e.pipes.forEach( (t, a) => {
        t.x -= i.pipeSpeed;
        const d = e.player.x
          , c = e.player.y
          , r = e.player.width * .7
          , s = e.player.height * .7;
        d + r / 2 > t.x && d - r / 2 < t.x + i.pipeWidth && (c - s / 2 < t.top || c + s / 2 > t.top + i.pipeGap) && y(),
        !t.passed && d > t.x + i.pipeWidth && (t.passed = !0,
        e.score++,
        S.textContent = e.score,
        p(n.sounds.score)),
        t.x + i.pipeWidth < 0 && e.pipes.splice(a, 1)
    }
    ),
    e.frame++)
}
function b() {
    o.clearRect(0, 0, l.width, l.height);
    const t = o.createLinearGradient(0, 0, 0, l.height);
    t.addColorStop(0, "#1a1a2e"),
    t.addColorStop(1, "#16213e"),
    o.fillStyle = t,
    o.fillRect(0, 0, l.width, l.height),
    e.pipes.forEach(a => {
        const d = o.createLinearGradient(a.x, 0, a.x + i.pipeWidth, 0);
        if (d.addColorStop(0, "#fff700"),
        d.addColorStop(.5, "#ffd900"),
        d.addColorStop(1, "#fff700"),
        o.fillStyle = d,
        o.fillRect(a.x, 0, i.pipeWidth, a.top),
        o.fillRect(a.x, a.top + i.pipeGap, i.pipeWidth, l.height - (a.top + i.pipeGap)),
        n.onpillar.complete && n.onpillar.naturalWidth !== 0) {
            const c = i.pipeWidth * .8
              , r = n.onpillar.naturalHeight / n.onpillar.naturalWidth * c
              , s = a.x + (i.pipeWidth - c) / 2;
            o.drawImage(n.onpillar, s, a.top - r - 10, c, r),
            o.drawImage(n.onpillar, s, a.top + i.pipeGap + 10, c, r)
        }
    }
    ),
    o.save(),
    o.translate(e.player.x, e.player.y),
    o.rotate(e.player.rotation),
    n.player.complete && n.player.naturalWidth !== 0 ? o.drawImage(n.player, -45 / 2, -45 / 2, e.player.width, e.player.height) : (o.fillStyle = "white",
    o.shadowBlur = 15,
    o.shadowColor = "#00f2ff",
    o.beginPath(),
    o.arc(0, 0, e.player.width / 2.5, 0, Math.PI * 2),
    o.fill()),
    o.restore(),
    requestAnimationFrame(b)
}
function m() {
    e.isPlaying && (e.player.vy = i.jump,
    p(n.sounds.jump))
}
function f() {
    L(),
    e.isPlaying = !0,
    g.classList.add("hidden"),
    h.classList.add("hidden"),
    w.classList.remove("hidden"),
    p(n.sounds.background),
    p(n.sounds.rakesh_master)
}
function y() {
    e.isPlaying && (e.isPlaying = !1,
    n.sounds.background && (n.sounds.background.pause(),
    n.sounds.background.currentTime = 0),
    p(n.sounds.hit),
    p(n.sounds.rakesh_master),
    h.classList.remove("hidden"),
    w.classList.add("hidden"),
    x.textContent = e.score,
    e.score > e.bestScore && (e.bestScore = e.score,
    localStorage.setItem("zoomScore", e.bestScore)),
    P.textContent = e.bestScore)
}
window.addEventListener("keydown", t => {
    t.code === "Space" && (e.isPlaying ? m() : (g.offsetParent !== null || h.offsetParent !== null) && f())
}
);
l.addEventListener("mousedown", () => e.isPlaying ? m() : null);
l.addEventListener("touchstart", t => {
    t.preventDefault(),
    e.isPlaying && m()
}
, {
    passive: !1
});
E.addEventListener("click", f);
I.addEventListener("click", f);
requestAnimationFrame(b);
setInterval(C, 1e3 / 60);

