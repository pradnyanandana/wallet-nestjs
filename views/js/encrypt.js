document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.ethereum !== 'undefined') {
    var addressPlaceholder = document.querySelector('#account-address');
    var connectButton = document.querySelector('button.connect');
    var actions = document.querySelector('.actions');
    var actionEncrypt = actions.querySelector('button.encrypt');
    var actionDecrypt = actions.querySelector('button.decrypt');

    addressPlaceholder.innerHTML = 'loading...';

    web3 = new Web3(window.web3.currentProvider);
    web3.eth.getAccounts().then(function (accounts) {
      addressPlaceholder.innerHTML = accounts[0];

      if (!accounts[0]) {
        connectButton.setAttribute('style', 'display:block');
      } else {
        actions.setAttribute('style', 'display:flex');
      }
    });

    connectButton.addEventListener('click', function () {
      window.ethereum
        .enable()
        .then(function () {
          window.location.reload();
        })
        .catch(() => {
          alert('Failed to connect Metamask');
        });
    });

    window.ethereum.on('accountsChanged', function () {
      window.location.reload();
    });

    window.ethereum.on('disconnect', function () {
      window.location.reload();
    });
  } else {
    alert('Metamask is not installed or not available');
  }

  require.config({
    paths: {
      vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs',
    },
  });
  require(['vs/editor/editor.main'], () => {
    monaco.editor.create(document.getElementById('editor'), {
      value: '',
      language: 'javascripts',
      theme: 'vs-dark',
    });
  });
});
