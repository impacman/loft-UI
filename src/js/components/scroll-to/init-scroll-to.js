import { ScrollTo } from './scroll-to';

const props = {
  init: true,
  links: `[data-scroll-link]`,
  blocks: `[data-scroll-block]`
};

const initScrollTo = () => new ScrollTo(props);

export { initScrollTo };
