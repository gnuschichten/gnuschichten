Drupal.behaviors.clipboardInit = {
  attach: function (context) {

    const items = context.querySelectorAll('pre');
    const initButton = document.getElementsByTagName('code');

    if (initButton) {
      for (const item of items) {

        const button = document.createElement("button");
        const content = item.innerText;
        const clipboard = new ClipboardJS(button);

        button.innerHTML = "copy";
        button.classList.add("btn");
        button.setAttribute('data-clipboard-text', content);

        item.appendChild(button);

      }
    }

  }
};

// const clipboard = new ClipboardJS('.copy-code');
//
// clipboard.on('success', function (e) {
//   console.info('Action:', e.action);
//   console.info('Text:', e.text);
//   console.info('Trigger:', e.trigger);
//
//   e.clearSelection();
// });
//
// clipboard.on('error', function (e) {
//   console.error('Action:', e.action);
//   console.error('Trigger:', e.trigger);
// });
