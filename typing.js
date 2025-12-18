// Typing animation functionality
const rawLines = [
    { text: "Delicious\nfood for you!", highlight: "food" },
    { text: "Satisfy your\nhunger now!", highlight: "hunger" },
    { text: "Freshly cooked\nmeals made daily!", highlight: "meals" },
    { text: "Small chops, big \nhappiness!", highlight: "chops," },
    { text: "Swallow dey\nwe no dey play!", highlight: "Swallow" },
    { text: "Place your\nadverts here!", highlight: "adverts" }
];

document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('.disp-text');
    if (!h1) return;
    
    let lineIndex = 0;
    let charIndex = 0;
    let typing = true;
    
    function getTypedHTML(line, charIndex) {
        const { text, highlight } = line;
        const highlightStart = text.indexOf(highlight);
        const highlightEnd = highlightStart + highlight.length;
        
        let html = "";
        
        for (let i = 0; i < charIndex; i++) {
            const char = text[i];
            if (i >= highlightStart && i < highlightEnd) {
                html += `<span class="color-changing">${char}</span>`;
            } else {
                html += char === "\n" ? "<br>" : char;
            }
        }
        
        return html;
    }
    
    function typeLoop() {
        const line = rawLines[lineIndex];
        
        if (typing) {
            if (charIndex <= line.text.length) {
                h1.innerHTML = getTypedHTML(line, charIndex++);
                setTimeout(typeLoop, 100);
            } else {
                typing = false;
                setTimeout(typeLoop, 5000);
            }
        } else {
            if (charIndex > 0) {
                h1.innerHTML = getTypedHTML(line, --charIndex);
                setTimeout(typeLoop, 60);
            } else {
                typing = true;
                lineIndex = (lineIndex + 1) % rawLines.length;
                setTimeout(typeLoop, 500);
            }
        }
    }
    
    typeLoop();
}); 