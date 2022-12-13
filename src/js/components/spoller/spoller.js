export class Spoller {
  constructor(props) {
    this.init = props.init;
    this.wrap = props.wrap;
    this.toggle = props.toggle;
    this.activeClass = props.activeClass;
    this.roll = props.roll;
    this.group = props.group;
    this.duration = props.duration || 200;
    this.showText = props.showText;
    this.hideText = props.hideText;
    this.toggleHandler = [];

    if (this.init) {
      this.render();
    }
  }

  render() {
    const wrap = document.querySelectorAll(this.wrap);

    for (let i = 0; i < wrap.length; i++) {
      if (wrap[i].classList.contains('initialized')) {
        continue;
      }
      wrap[i].classList.add('initialized');
      const toggles = wrap[i].querySelectorAll(this.toggle);
      const roll = wrap[i].querySelectorAll(this.roll);

      this.toggleHandler.push(() => this.toggleState(wrap[i], roll, this.duration, toggles));

      toggles.forEach((toggle) => {
        const toggleWrap = toggle.dataset.accordionToggle;
        if (toggleWrap) {
          toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const wraps = document.querySelectorAll(`[data-accordion-row=${toggleWrap}]`);
            wraps.forEach((el) => {
              el.dispatchEvent(new CustomEvent('show'));
            });
          });
        } else {
          toggle.addEventListener('click', () => {
            this.toggleState(wrap[i], roll, this.duration, toggles);
          });
        }
      });

      wrap[i].addEventListener('show', () => {
        for (let j = 0; j < roll.length; j++) {
          this.show(wrap[i], roll[j], this.duration);
        }
      });
    }
  }

  destroy() {
    const wrap = document.querySelectorAll(this.wrap);

    for (let i = 0; i < wrap.length; i++) {
      const toggles = wrap[i].querySelectorAll(this.toggle);
      const roll = wrap[i].querySelectorAll(this.roll);

      toggles.forEach((toggle) => {
        toggle.removeEventListener('click', this.toggleHandler[i]);
      });

      for (let j = 0; j < roll.length; j++) {
        wrap[i].classList.remove(this.activeClass);
        roll[j].style = null;
      }
    }
  }

  hide(wrap, target, duration, prevWrap = false) {
    if (prevWrap) {
      prevWrap.classList.remove(this.activeClass);
    }

    wrap.classList.remove(this.activeClass);
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = '0';
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;

    window.setTimeout(() => {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');

      window.dispatchEvent(new CustomEvent('update:scrollbar'));
    }, duration);
  }

  show(wrap, target, duration) {
    if (wrap.closest(this.group)) {
      const prevWrap = wrap.closest(this.group).querySelector(`${this.wrap}.${this.activeClass}`);

      if (prevWrap) {
        this.hide(wrap, prevWrap.querySelector(this.roll), this.duration, prevWrap);
      }
    }

    wrap.classList.add(this.activeClass);
    target.style.removeProperty('display');

    let {display} = window.getComputedStyle(target);

    if (display === 'none') {
      display = 'block';
    }

    target.style.display = display;

    const height = target.offsetHeight;

    target.style.overflow = 'hidden';
    target.style.height = '0';
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${height}px`;
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');

    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');

      if (target.querySelector('.photo-slider')) {
        window.dispatchEvent(new CustomEvent('init.photo-slider'));
      }
      if (target.querySelector('.car-list')) {
        window.dispatchEvent(new CustomEvent('slider.update'));
      }

      window.dispatchEvent(new CustomEvent('update:scrollbar'));
    }, duration);
  }

  toggleState(wrap, target, duration, toggles) {
    for (let i = 0; i < target.length; i++) {
      if (window.getComputedStyle(target[i]).display === 'none') {
        this.show(wrap, target[i], duration);

        if (this.showText && this.hideText) {
          toggles.forEach((toggle) => {
            const textField = toggle.querySelector(`[${this.showText}]`);
            textField.innerText = this.hideText;
          });
        }
      } else {
        this.hide(wrap, target[i], duration);

        if (this.showText && this.hideText) {
          toggles.forEach((toggle) => {
            const textField = toggle.querySelector(`[${this.showText}]`);
            textField.innerText = textField.getAttribute(this.showText);
          });
        }
      }
    }
  }
}
