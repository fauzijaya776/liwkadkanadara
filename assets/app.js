/* =========================================================
   FZI STORE — Logika Frontend
   - Format nominal Rupiah
   - Nominal cepat + input manual
   - Generate Order ID unik
   - Redirect ke checkout Pakasir
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.FZI_CONFIG || {};
  var PK = CFG.pakasir || {};

  // ---------- Util ----------
  function rupiah(n) {
    n = Math.max(0, Math.floor(Number(n) || 0));
    return "Rp" + n.toLocaleString("id-ID");
  }
  function onlyDigits(s) {
    return (s || "").toString().replace(/[^\d]/g, "");
  }
  // Order ID: YYMMDDHHMM + 4 char acak (mirip format Pakasir)
  function makeOrderId() {
    var d = new Date();
    var p = function (x) { return String(x).padStart(2, "0"); };
    var stamp =
      String(d.getFullYear()).slice(2) +
      p(d.getMonth() + 1) + p(d.getDate()) +
      p(d.getHours()) + p(d.getMinutes());
    var rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return "FZI" + stamp + rand;
  }
  function buildPayUrl(amount, orderId) {
    var base = "https://app.pakasir.com/pay/" +
      encodeURIComponent(PK.slug || "fzistore") + "/" + amount;
    var q = ["order_id=" + encodeURIComponent(orderId)];
    if (PK.qrisOnly) q.push("qris_only=1");
    if (PK.redirectAfterPay) q.push("redirect=" + encodeURIComponent(PK.redirectAfterPay));
    return base + "?" + q.join("&");
  }

  // ---------- Elemen ----------
  var $ = function (id) { return document.getElementById(id); };
  var amountEl = $("amount");
  var quickEl = $("quick");
  var errEl = $("err");
  var sumAmount = $("sumAmount");
  var sumOid = $("sumOid");
  var sumTotal = $("sumTotal");
  var depositBtn = $("depositBtn");
  var modal = $("modal");
  var modalAmount = $("modalAmount");
  var modalOid = $("modalOid");
  var modalGo = $("modalGo");
  var modalCancel = $("modalCancel");

  var currentOrderId = makeOrderId();

  // ---------- Isi info config ke halaman ----------
  (function initStatic() {
    var y = $("year"); if (y) y.textContent = new Date().getFullYear();
    var nb = $("navBalance");
    if (nb) nb.textContent = rupiah(CFG.displayBalance || 0);
    var cl = $("contactLink");
    if (cl && CFG.supportEmail) cl.href = "mailto:" + CFG.supportEmail;
  })();

  // ---------- Nominal cepat ----------
  (function renderQuick() {
    if (!quickEl) return;
    var list = CFG.quickAmounts || [10000, 25000, 50000, 100000];
    quickEl.innerHTML = "";
    list.forEach(function (val) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = rupiah(val).replace("Rp", "Rp ");
      b.setAttribute("data-val", val);
      b.addEventListener("click", function () {
        setAmount(val);
        markActive(val);
      });
      quickEl.appendChild(b);
    });
  })();

  function markActive(val) {
    if (!quickEl) return;
    Array.prototype.forEach.call(quickEl.children, function (b) {
      b.classList.toggle("active", Number(b.getAttribute("data-val")) === Number(val));
    });
  }

  function currentAmount() {
    return Number(onlyDigits(amountEl ? amountEl.value : "0")) || 0;
  }

  function setAmount(val) {
    if (!amountEl) return;
    amountEl.value = Number(val).toLocaleString("id-ID");
    refresh();
  }

  function refresh() {
    var amt = currentAmount();
    if (sumAmount) sumAmount.textContent = rupiah(amt);
    if (sumTotal) sumTotal.textContent = rupiah(amt);
    if (sumOid) sumOid.textContent = amt > 0 ? currentOrderId : "—";
    validate(false);
  }

  function validate(showEmpty) {
    var amt = currentAmount();
    var min = PK.minAmount || 10000;
    var max = PK.maxAmount || 5000000;
    var msg = "";
    if (amt === 0) {
      if (showEmpty) msg = "Masukkan nominal deposit terlebih dahulu.";
    } else if (amt < min) {
      msg = "Minimum deposit " + rupiah(min) + ".";
    } else if (amt > max) {
      msg = "Maksimum deposit " + rupiah(max) + ".";
    }
    if (errEl) errEl.textContent = msg;
    return msg === "" && amt >= min;
  }

  // ---------- Event input ----------
  if (amountEl) {
    amountEl.addEventListener("input", function () {
      var digits = onlyDigits(amountEl.value);
      amountEl.value = digits ? Number(digits).toLocaleString("id-ID") : "";
      markActive(-1);
      refresh();
    });
  }

  // ---------- Tombol deposit -> modal ----------
  if (depositBtn) {
    depositBtn.addEventListener("click", function () {
      if (!validate(true)) {
        if (amountEl) amountEl.focus();
        return;
      }
      var amt = currentAmount();
      currentOrderId = makeOrderId(); // order id baru tiap konfirmasi
      if (sumOid) sumOid.textContent = currentOrderId;

      var url = buildPayUrl(amt, currentOrderId);
      if (modalAmount) modalAmount.textContent = rupiah(amt);
      if (modalOid) modalOid.textContent = "Order ID: " + currentOrderId;
      if (modalGo) modalGo.setAttribute("href", url);
      openModal();
    });
  }

  function openModal() { if (modal) modal.classList.add("open"); }
  function closeModal() { if (modal) modal.classList.remove("open"); }
  if (modalCancel) modalCancel.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  // ---------- Menu mobile (scroll ke nav) ----------
  var hamb = $("hamb");
  if (hamb) {
    hamb.addEventListener("click", function () {
      var t = document.getElementById("deposit");
      if (t) t.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ---------- Reveal on scroll ----------
  (function reveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  })();

  // init
  refresh();
})();
