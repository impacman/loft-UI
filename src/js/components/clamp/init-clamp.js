import lineClamp from 'line-clamp';

const initClamp = () => {
    const clampEls = document.querySelectorAll('[data-clamp]');

    if (!clampEls.length) return;

    clampEls.forEach(el => {
        el.textContent.length > 240 
            ? el.innerHTML = `${el.textContent.split('', 230).join('')}...`
            : false;
    });
}

export { initClamp };