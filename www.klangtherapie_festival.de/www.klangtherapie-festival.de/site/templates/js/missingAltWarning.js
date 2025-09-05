// js/missingAltWarning.js

document.addEventListener("alpine:init", () => {
  Alpine.store("missingAlts", {
    images: [],
    add(img) {
      if (!this.images.find((i) => i.src === img.src)) {
        this.images.push(img)
      }
    },
  })

  Alpine.directive("missing-alt", (el) => {
    // Only run if user is logged in (set a global JS var in PHP)
    if (!window.isLoggedIn) return
    Alpine.nextTick(() => {
      const alt = el.getAttribute("alt")
      if (!alt || alt.trim() === "") {
        // Use file url (src) as unique identifier for warning list
        let id = el.getAttribute("data-missing-alt")
        if (!id) {
          id =
            "missing-alt-" +
            btoa(el.src)
              .replace(/[^a-zA-Z0-9]/g, "")
              .slice(-8) +
            "-" +
            Math.floor(Math.random() * 100000)
          el.setAttribute("data-missing-alt", id)
        }
        // Add warning badge
        if (!el.parentNode.querySelector(".alpine-missing-alt-badge")) {
          const badge = document.createElement("span")
          badge.textContent = "⚠️ Missing alt!"
          badge.className = "alpine-missing-alt-badge"
          el.style.position = "relative"
          el.parentNode.insertBefore(badge, el)
        }
        // Add to global store (by src only)
        Alpine.store("missingAlts").add({
          id, // still keep id for focus
          src: el.src,
          outerHTML: el.outerHTML,
        })
      }
    })
  })

  // Expose a global function to focus and highlight an image by src (file url)
  window.focusMissingAltImage = function (src) {
    console.log("Focusing image with src:", src)
    // Find all images and compare their absolute src
    const images = document.querySelectorAll("img")
    let el = null
    images.forEach((img) => {
      if (img.src === src) {
        el = img
      }
    })
    console.log("Found element:", el)

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      el.classList.add("ring-4", "ring-yellow-400", "transition")
      setTimeout(function () {
        el.classList.remove("ring-4", "ring-yellow-400", "transition")
      }, 2000)
    }
  }
})
