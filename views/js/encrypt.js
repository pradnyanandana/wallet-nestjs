document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.ethereum !== 'undefined') {
    var monacoEditorEncrypt, monacoEditorDecrypt;
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

    window.ethereum.on('accountsChanged', function () {
      window.location.reload();
    });

    window.ethereum.on('disconnect', function () {
      window.location.reload();
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

    actionEncrypt.addEventListener('click', function () {
      var decryptedMessage = monacoEditorEncrypt.getValue();
      var address = addressPlaceholder.innerHTML;

      window.ethereum
        .request({
          method: 'eth_getEncryptionPublicKey',
          params: [address],
        })
        .then(function (publicKey) {
          fetch(encryptAPI, {
            method: 'POST',
            body: JSON.stringify({ publicKey, message: decryptedMessage }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(function (res) {
              return res.json();
            })
            .then(function (data) {
              monacoEditorDecrypt.setValue(data.data);
            })
            .catch(function (error) {
              alert(error.message);
            });
        })
        .catch(function (error) {
          alert(error.message);
        });
    });

    actionDecrypt.addEventListener('click', function () {
      var encryptedMessage = monacoEditorDecrypt.getValue();
      var address = addressPlaceholder.innerHTML;

      window.ethereum
        .request({
          method: 'eth_decrypt',
          params: [encryptedMessage, address],
        })
        .then(function (decryptedMessage) {
          monacoEditorEncrypt.setValue(decryptedMessage);
        })
        .catch(function (error) {
          alert(error.message);
        });
    });
  } else {
    alert('Metamask is not installed or not available');
  }

  require.config({
    paths: {
      vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs',
    },
  });

  require(['vs/editor/editor.main'], function () {
    monacoEditorEncrypt = monaco.editor.create(
      document.getElementById('editor-encrypt'),
      {
        value: '',
        language: 'javascripts',
        theme: 'vs-dark',
      },
    );

    monacoEditorDecrypt = monaco.editor.create(
      document.getElementById('editor-decrypt'),
      {
        value: '',
        language: 'javascripts',
        theme: 'vs-dark',
      },
    );
  });
});
