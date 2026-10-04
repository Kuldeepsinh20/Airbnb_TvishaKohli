import React, { useEffect } from "react";
import listingMarkup from "./listingMarkup";
import "./styles.css";

export default function App() {
  useEffect(() => {
    const root = document.getElementById("listing-root");
    if (!root) return;
    const tour = root.querySelector("#_KpcKWX");
    const lightbox = root.querySelector("#lightbox");
    const photos = [...root.querySelectorAll("#tourRooms button[data-idx]")].map((button) => ({
      src: button.querySelector("img")?.getAttribute("src"),
      alt: button.querySelector("img")?.getAttribute("alt") || "Listing photo",
      room: button.closest("section")?.querySelector("._AnkvRF")?.textContent || "Photo tour",
    })).filter((photo) => photo.src);
    let current = 0;
    let nearbyPage = 0;
    const show = (element, visible) => {
      if (!element) return;
      element.classList.toggle("_PjnNJs", visible);
      element.setAttribute("aria-hidden", String(!visible));
    };
    const updateLightbox = () => {
      const photo = photos[current];
      const stage = root.querySelector("#lbStage");
      if (stage && photo) stage.innerHTML = `<img src="${photo.src}" alt="${photo.alt.replaceAll('"','&quot;')}" />`;
      const title = root.querySelector("#lbTitle"), counter = root.querySelector("#lbCounter");
      if (title) title.textContent = photo?.room || "";
      if (counter) counter.textContent = `${current + 1} / ${photos.length}`;
      const prev = root.querySelector("#lbPrev"), next = root.querySelector("#lbNext");
      if (prev) prev.disabled = current <= 0;
      if (next) next.disabled = current >= photos.length - 1;
    };
    const openLightbox = (idx) => { current = Math.max(0, Math.min(idx, photos.length - 1)); updateLightbox(); show(lightbox, true); };
    const closeLightbox = () => show(lightbox, false);
    const reservePopup = document.createElement("div");
    reservePopup.className = "airbnb-reserve-overlay";
    reservePopup.setAttribute("aria-hidden", "true");
    reservePopup.innerHTML = `<section class="airbnb-reserve-dialog" role="dialog" aria-modal="true" aria-label="Reservation details"><button type="button" class="airbnb-reserve-close" aria-label="Close">×</button><h2>Reserve this stay</h2><p>Choose your dates and guests in the reservation card to continue.</p><div class="airbnb-reserve-summary"><strong>₹28,499</strong><span> · 5 nights</span><br><small>18 Oct 2026 – 23 Oct 2026</small></div><button type="button" class="airbnb-reserve-continue">Review your trip</button></section>`;
    root.appendChild(reservePopup);
    const openReserve = () => { reservePopup.classList.add("is-open"); reservePopup.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
    const closeReserve = () => { reservePopup.classList.remove("is-open"); reservePopup.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
    const updateNearby = () => {
      const track = root.querySelector("#simTrack"), prev = root.querySelector("#simPrev"), next = root.querySelector("#simNext"), counter = root.querySelector("._klVRbI");
      if (!track) return;
      const maxPage = 1;
      nearbyPage = Math.max(0, Math.min(nearbyPage, maxPage));
      track.scrollTo({ left: nearbyPage * track.clientWidth, behavior: "smooth" });
      if (prev) prev.disabled = nearbyPage === 0;
      if (next) next.disabled = nearbyPage === maxPage;
      if (counter) counter.textContent = `${nearbyPage + 1} / 2`;
    };
    const onClick = (event) => {
      const button = event.target.closest("button");
      if (button && (button.id === "showAllPhotos")) { event.preventDefault(); show(tour, true); document.body.style.overflow = "hidden"; return; }
      if (button && button.id === "tourBack") { event.preventDefault(); show(tour, false); document.body.style.overflow = ""; return; }
      if (button && button.id === "lbClose") { closeLightbox(); return; }
      if (button && button.id === "lbGrid") { closeLightbox(); return; }
      if (button && button.id === "lbPrev") { if (current > 0) { current--; updateLightbox(); } return; }
      if (button && button.id === "lbNext") { if (current < photos.length - 1) { current++; updateLightbox(); } return; }
      if (button && button.dataset.idx !== undefined && button.closest("#tourRooms")) { openLightbox(Number(button.dataset.idx)); return; }
      if (button && button.closest("#heroGrid")) { openLightbox(0); return; }
      if (button && button.id === "saveBtn" || button?.getAttribute("aria-label") === "Save") {
        event.preventDefault();
        const save = button.id === "saveBtn" ? button : button;
        const saved = save.getAttribute("aria-pressed") !== "true";
        save.setAttribute("aria-pressed", String(saved));
        save.classList.toggle("is-saved", saved);
        save.classList.remove("save-pulse"); void save.offsetWidth; save.classList.add("save-pulse");
        const heart = save.querySelector("svg path");
        if (heart) { heart.style.fill = saved ? "#ff385c" : "none"; heart.style.stroke = saved ? "#ff385c" : "currentColor"; }
        const label = save.querySelector("._uOQIyx"); if (label) label.textContent = saved ? "Saved" : "Save";
        return;
      }
      if (button && (button.id === "reserveBtn" || button.textContent.trim() === "Reserve")) { event.preventDefault(); openReserve(); return; }
      if (event.target === reservePopup || (button && button.classList.contains("airbnb-reserve-close"))) { closeReserve(); return; }
      if (button && button.classList.contains("airbnb-reserve-continue")) { closeReserve(); root.querySelector("#bookingSticky")?.scrollIntoView({behavior:"smooth",block:"center"}); return; }
      if (button && button.id === "descMore") {
        const text = root.querySelector("#descText"); const expanded = button.dataset.expanded === "true";
        button.dataset.expanded = String(!expanded); if (text) text.classList.toggle("_kfKUOt", expanded);
        const label = button.childNodes[0]; if (label) label.textContent = expanded ? "Show more " : "Show less "; return;
      }
      if (button && button.id === "showAmen") { show(root.querySelector("#amenModal"), true); document.body.style.overflow = "hidden"; return; }
      if (button && button.id === "amenClose") { show(root.querySelector("#amenModal"), false); document.body.style.overflow = ""; return; }
      if (button && button.id === "simPrev") { nearbyPage = 0; updateNearby(); return; }
      if (button && button.id === "simNext") { nearbyPage = 1; updateNearby(); return; }
      if (button && button.classList.contains("_gKVFNL")) {
        const index = [...root.querySelectorAll("#tourNav ._gKVFNL")].indexOf(button);
        const section = root.querySelector(`#tour-room-${index}`);
        if (section) { event.preventDefault(); section.scrollIntoView({behavior:"smooth",block:"start"}); }
        return;
      }
      const link = event.target.closest('a[data-target]');
      if (link) { const section = root.querySelector(`#${CSS.escape(link.dataset.target)}`); if (section) { event.preventDefault(); section.scrollIntoView({behavior:"smooth",block:"start"}); } }
    };
    const onScroll = () => {
      const nav = root.querySelector("#_JXzroy"), hero = root.querySelector("#heroGrid");
      if (!nav || !hero) return;
      const reveal = hero.getBoundingClientRect().bottom < 88;
      nav.classList.toggle("_fTQmRt", reveal); nav.setAttribute("aria-hidden", String(!reveal));
    };
    const onKey = (event) => {
      if (event.key === "Escape" && reservePopup.classList.contains("is-open")) { closeReserve(); return; }
      if (lightbox?.classList.contains("_PjnNJs")) {
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowLeft" && current > 0) { current--; updateLightbox(); }
        if (event.key === "ArrowRight" && current < photos.length - 1) { current++; updateLightbox(); }
      } else if (tour?.classList.contains("_PjnNJs") && event.key === "Escape") { show(tour, false); document.body.style.overflow = ""; }
    };
    root.addEventListener("click", onClick); window.addEventListener("keydown", onKey); window.addEventListener("scroll", onScroll, {passive:true});
    onScroll();
    return () => { root.removeEventListener("click", onClick); window.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll); reservePopup.remove(); document.body.style.overflow = ""; };
  }, []);
  return <div id="listing-root" dangerouslySetInnerHTML={{ __html: listingMarkup }} />;
}
