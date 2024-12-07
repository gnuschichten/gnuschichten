// Init clipboard js
Drupal.behaviors.clipboardInit = {
  attach: function (context) {

    const items = context.querySelectorAll('pre');
    const initButton = document.getElementsByTagName('code');

    if (initButton) {
      for (const item of items) {

        const button = document.createElement("button");
        const content = item.innerText;
        const clipboard = new ClipboardJS(button);

        button.innerHTML = "In die Zwischenablage kopieren";
        button.classList.add("copy-code");
        button.setAttribute('data-clipboard-text', content);

        item.appendChild(button);

        button.addEventListener('click', () => {
          button.innerHTML = "Kopiert!";

          setTimeout(function(){
            button.innerHTML = "Erneut in die Zwischenablage kopieren";
          }, 1000);
        })

      }
    }

  }
};
