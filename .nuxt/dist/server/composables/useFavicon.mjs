import { ref } from "vue";
function useFavicon() {
  const favicon = ref(null);
  let blinkInterval = null;
  let fadeTimeout = null;
  const initFavicon = () => {
    favicon.value = (void 0).querySelector("link[rel*='icon']");
    if (!favicon.value) {
      favicon.value = (void 0).createElement("link");
      favicon.value.type = "image/x-icon";
      favicon.value.rel = "shortcut icon";
      (void 0).head.appendChild(favicon.value);
    }
  };
  const createFavicon = (color) => {
    const canvas = (void 0).createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.fillRect(0, 0, 32, 32);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = color;
    const opacityMatch = color.match(/[\d.]+\)$/);
    const opacity = opacityMatch ? parseFloat(opacityMatch[0]) : 1;
    const baseRadius = 7;
    const radius = Math.max(1, baseRadius + (1 - opacity) * 1.5);
    const centerY = 16;
    const spacing = 10;
    const centerX = 16;
    ctx.beginPath();
    ctx.arc(centerX - spacing / 2, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX + spacing / 2, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    return canvas.toDataURL();
  };
  const startProcessing = () => {
    initFavicon();
    if (!favicon.value) return;
    let opacity = 1;
    let increasing = false;
    if (blinkInterval) clearInterval(blinkInterval);
    if (fadeTimeout) clearTimeout(fadeTimeout);
    blinkInterval = setInterval(() => {
      if (increasing) {
        opacity += 0.1;
        if (opacity >= 1) {
          opacity = 1;
          increasing = false;
        }
      } else {
        opacity -= 0.1;
        if (opacity <= 0.3) {
          opacity = 0.3;
          increasing = true;
        }
      }
      const color = `rgba(200, 0, 0, ${opacity})`;
      if (favicon.value) {
        favicon.value.href = createFavicon(color);
      }
    }, 50);
  };
  const completeProcessing = () => {
    if (!favicon.value) return;
    if (blinkInterval) {
      clearInterval(blinkInterval);
      blinkInterval = null;
    }
    favicon.value.href = createFavicon("#00ff00");
    let opacity = 1;
    if (fadeTimeout) clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      const fadeInterval = setInterval(() => {
        opacity -= 0.1;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          if (favicon.value) {
            favicon.value.href = createFavicon("#ffffff");
          }
          return;
        }
        const color = `rgba(0, 255, 0, ${opacity})`;
        if (favicon.value) {
          favicon.value.href = createFavicon(color);
        }
      }, 50);
    }, 500);
  };
  return {
    startProcessing,
    completeProcessing
  };
}
export {
  useFavicon
};
//# sourceMappingURL=useFavicon.mjs.map
