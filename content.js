function addCopyButtonToTable(table) {
  if (table.dataset.hasCopyButton) {
      return; // Prevent adding multiple buttons
  }

  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy as Image';
  copyButton.style.cssText = `
      padding: 5px;
      margin: 5px;
      border: 1px solid black;
      cursor: pointer;
      font-size: 12px;
      z-index: 1000;
      background-color: white;
      opacity: 0.3; 
      border-radius: 5px; 
  `;

  copyButton.addEventListener('click', () => {
      html2canvas(table).then(canvas => {
          canvas.toBlob(blob => {
              navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
              ]).then(() => {
                  copyButton.textContent = 'Copied!';
                  setTimeout(() => copyButton.textContent = 'Copy as Image', 1500);
              }).catch(err => console.error('Failed to copy: ', err));
          }, 'image/png');
      });
  });

  // Insert button more reliably
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
      position: relative;
      display: inline-block;
  `;
  table.parentNode.insertBefore(wrapper, table);
  wrapper.appendChild(table);

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
  `;
  buttonContainer.appendChild(copyButton);
  wrapper.appendChild(buttonContainer);

  // Mark that the button has been added
  table.dataset.hasCopyButton = 'true';
}

function processTables(tables) {
  tables.forEach(table => {
      if (!table.closest('.no-copy-table')) { // Check for exclusion class
          addCopyButtonToTable(table);
      }
  });
}

function observeMutations() {
  const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                  if (node.tagName === 'TABLE') {
                      addCopyButtonToTable(node);
                  } else if (node.querySelectorAll) {
                      processTables(node.querySelectorAll('table'));
                  }
              }
          });
      });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Initial processing of existing tables
processTables(document.querySelectorAll('table'));

// Observe for dynamically added tables
observeMutations();
