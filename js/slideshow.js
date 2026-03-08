"use strict";

const MAX_DOTS = 8;
const advanceDuration_ms = 5000;

const slideshows = $(".slideshow");
const slideshowIndicators = $(".slideshow-indicator");

var isAnimating = [];   // one entry per slideshow, initialised in $(document).ready

/* ── Helpers ───────────────────────────────────────────────── */

function getImages(slideshowIndex) {
  return slideshows.eq(slideshowIndex).find("img");
}

function getCurrentImage(slideshowIndex) {
  return slideshows.eq(slideshowIndex).find("img.curr").eq(0);
}

/* Return the real image index (0-based) for a given img element */
function getImageIndex(slideshowIndex, imgEl) {
  return getImages(slideshowIndex).index(imgEl);
}

/* Return the dot <span> that corresponds to a real image index.
   With capping, dots 0..(n-2) map 1:1; the last dot covers all
   remaining images when there are more than MAX_DOTS images. */
function getDotForImageIndex(slideshowIndex, imageIndex) {
  const total = getImages(slideshowIndex).length;
  const dotIndex = total > MAX_DOTS
    ? Math.min(imageIndex, MAX_DOTS - 1)
    : imageIndex;
  return slideshowIndicators.eq(slideshowIndex).find("span").eq(dotIndex);
}

/* ── Core update ───────────────────────────────────────────── */

function update(slideshowIndex, currentImage, newImage) {
  currentImage.animate({ opacity: 0 }, 200, function () {

    // Remove curr class from old dot
    getDotForImageIndex(slideshowIndex, getImageIndex(slideshowIndex, currentImage))
      .removeClass("curr");

    currentImage.removeClass("curr");

    newImage.css("opacity", 0).addClass("curr").animate({ opacity: 1 }, 200, function () {
      // Add curr class to new dot
      getDotForImageIndex(slideshowIndex, getImageIndex(slideshowIndex, newImage))
        .addClass("curr");
      isAnimating[slideshowIndex] = false;   // ← release only this slideshow
    });
  });
}

/* ── Navigation ────────────────────────────────────────────── */

function previous(slideshowIndex) {
  if (isAnimating[slideshowIndex]) return;
  isAnimating[slideshowIndex] = true;
  const currentImage = getCurrentImage(slideshowIndex);
  var newImage = currentImage.prev("img");
  if (newImage.length === 0) {
    const images = getImages(slideshowIndex);
    newImage = images.eq(images.length - 1);
  }
  update(slideshowIndex, currentImage, newImage);
}

function next(slideshowIndex) {
  if (isAnimating[slideshowIndex]) return;
  isAnimating[slideshowIndex] = true;
  const currentImage = getCurrentImage(slideshowIndex);
  var newImage = currentImage.next("img");
  if (newImage.length === 0) {
    newImage = getImages(slideshowIndex).eq(0);
  }
  update(slideshowIndex, currentImage, newImage);
}

/* ── Initialise indicators ─────────────────────────────────── */

$(document).ready(function () {
    
    // Initialise one flag per slideshow
    slideshows.each(function (i) { isAnimating[i] = false; });

    slideshows.each(function (i) {
      const images   = $(this).find("img");
      const total    = images.length;
      const dotCount = Math.min(total, MAX_DOTS);
      const indicator = slideshowIndicators.eq(i);

      // Build dots
      let html = "";
      for (let d = 0; d < dotCount; d++) {
        html += "<span></span>\n";
      }
      indicator.html(html);

      // Mark first dot active (first image starts as curr)
      indicator.find("span").eq(0).addClass("curr");

      // Dot click: navigate to the first real image that dot represents
      indicator.find("span").each(function (dotIdx) {
        $(this).on("click", function () {
          if (isAnimating[i]) return;
          // For capped slideshows the last dot maps to image MAX_DOTS-1
          const targetImageIndex = dotIdx;
          const targetImage = images.eq(targetImageIndex);
          const current = getCurrentImage(i);
          if (current.is(targetImage)) return;
          isAnimating[i] = true;
          update(i, current, targetImage);
        });
      });
    });

  // Auto-advance all slideshows
  setInterval(function () {
    for (var i = 0; i < slideshows.length; i++) {
      next(i);   // next() itself checks isAnimating[i], so each is independent
      }
  }, advanceDuration_ms);
});
