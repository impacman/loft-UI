import { Spoller } from './spoller';

const dataAccordion = 'data-accordion';

const props = {
  init: true,
  group: `[${dataAccordion}]`,
  wrap: `[${dataAccordion}-row]`,
  toggle: `[${dataAccordion}-toggle]`,
  roll: `[${dataAccordion}-roll]`,
  activeClass: 'active',
  duration: 300,
};

const setAttributeFun = (el, attr, val) => el.setAttribute(attr, val);

const initSpoller = () =>  {
  const faq = document.querySelector('.faq__items');

  if (!faq) return;

  setAttributeFun(faq, dataAccordion, '');

  const faqItems = faq.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    setAttributeFun(item, `${dataAccordion}-row`, '');

    const header = item.querySelector('.item-faq__header');
    const body = item.querySelector('.item-faq__body');

    if (!header || !body) return;

    setAttributeFun(header, `${dataAccordion}-toggle`, '');
    setAttributeFun(body, `${dataAccordion}-roll`, '');
  });

  new Spoller(props);
};

export { initSpoller };
