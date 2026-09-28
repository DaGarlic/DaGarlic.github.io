(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('animate' in Element.prototype)) return;

  function Accordion(el) {
    this.el = el;
    this.summary = el.querySelector('summary');
    this.content = el.querySelector('.proj-details-body');
    this.animation = null;
    this.contentAnimation = null;
    this.isClosing = false;
    this.isExpanding = false;
    el.classList.add('js-anim');
    this.summary.addEventListener('click', this.onClick.bind(this));
  }

  Accordion.prototype.onClick = function (e) {
    e.preventDefault();
    this.el.style.overflow = 'hidden';
    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  };

  Accordion.prototype.shrink = function () {
    this.isClosing = true;
    this.el.classList.remove('is-open');

    var startHeight = this.el.offsetHeight + 'px';
    var endHeight = this.summary.offsetHeight + 'px';

    if (this.animation) this.animation.cancel();

    this.animation = this.el.animate(
      { height: [startHeight, endHeight] },
      { duration: 250, easing: 'ease-out' }
    );
    if (this.contentAnimation) this.contentAnimation.cancel();
    this.contentAnimation = this.content.animate(
      { opacity: [1, 0] },
      { duration: 120, easing: 'ease-out', fill: 'forwards' }
    );
    this.animation.onfinish = this.onAnimationFinish.bind(this, false);
    this.animation.oncancel = function () { this.isClosing = false; }.bind(this);
  };

  Accordion.prototype.open = function () {
    this.el.style.height = this.el.offsetHeight + 'px';
    this.el.open = true;
    this.el.classList.add('is-open');
    window.requestAnimationFrame(this.expand.bind(this));
  };

  Accordion.prototype.expand = function () {
    this.isExpanding = true;
    var startHeight = this.el.offsetHeight + 'px';
    var contentStyle = getComputedStyle(this.content);
    var contentMargin = parseFloat(contentStyle.marginTop) + parseFloat(contentStyle.marginBottom);
    var endHeight = (this.summary.offsetHeight + this.content.offsetHeight + contentMargin) + 'px';

    if (this.animation) this.animation.cancel();

    this.animation = this.el.animate(
      { height: [startHeight, endHeight] },
      { duration: 300, easing: 'ease-out' }
    );
    if (this.contentAnimation) this.contentAnimation.cancel();
    this.contentAnimation = this.content.animate(
      { opacity: [0, 1] },
      { duration: 300, easing: 'ease-out', fill: 'forwards' }
    );
    this.animation.onfinish = this.onAnimationFinish.bind(this, true);
    this.animation.oncancel = function () { this.isExpanding = false; }.bind(this);
  };

  Accordion.prototype.onAnimationFinish = function (open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = '';
    this.el.style.overflow = '';
  };

  document.querySelectorAll('.proj-details').forEach(function (el) {
    new Accordion(el);
  });
})();
