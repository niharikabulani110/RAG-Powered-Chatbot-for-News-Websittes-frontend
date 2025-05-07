// src/utils/typeEffect.js
export function typeEffect(fullText, onUpdate, onDone, delay = 20) {
    let i = 0;
  
    function type() {
      if (i <= fullText.length) {
        onUpdate(fullText.slice(0, i));
        i++;
        setTimeout(type, delay);
      } else {
        onDone?.();
      }
    }
  
    type();
  }
  