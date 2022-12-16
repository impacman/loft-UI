export class ScrollTo {
  constructor(props) {
    this.init = props.init;
    this.links = props.links;
    this.blocks = props.blocks;

    this.header = document.querySelector('.header');
    this.headerHeight = 0;

    this.hash = window.location.hash;

    this.init && this.render();
  }

  scrollToEl(el, pos) {
    window.scrollBy({
      top: el.getBoundingClientRect().top - pos,
      behavior: 'smooth',
    });
  };

  render() {
    const links = document.querySelectorAll(this.links);
    const blocks = document.querySelectorAll(this.blocks);

    if (this.hash !== '') {
      if (!blocks.length) return;

      blocks.forEach(block => {
        const name = block.dataset.scrollBlock;

        if (this.hash.replace('#', '') === block.dataset.scrollBlock) {
          if (name !== 'home') {
            this.headerHeight = this.header.offsetHeight - 20;
          }

          setTimeout(() => this.scrollToEl(block, this.headerHeight), 500);
        } else {
          return;
        }
      });
    }

    if (!links.length) return;

    const scrollToBlock = (name) => {
      blocks.forEach(block => {
        if (name === block.dataset.scrollBlock) {
          if (name !== 'home') {
            this.headerHeight = this.header.offsetHeight - 20;
          }

          window.location.hash = name;

          this.scrollToEl(block, this.headerHeight);
        } else {
          return;
        }
      });
    };

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const name = link.dataset.scrollLink;

        if (blocks.length) {
          scrollToBlock(name);
        } else {
          window.location = `${window.location.origin}#${name}`;
        }
      });
    });
  }
}