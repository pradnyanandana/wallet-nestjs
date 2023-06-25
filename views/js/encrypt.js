document.addEventListener('DOMContentLoaded', () => {
  function encryptData(data, key) {
    var keyBytes = hexToBytes(key);
    var dataBytes = utf8ToBytes(data);

    var encryptedBytes = [];

    for (var i = 0; i < dataBytes.length; i++) {
      var keyByte = keyBytes[i % keyBytes.length];
      var encryptedByte = dataBytes[i] ^ keyByte;

      encryptedBytes.push(encryptedByte);
    }

    var encryptedData = bytesToHex(encryptedBytes);

    return encryptedData;
  }

  function decryptData(encryptedData, key) {
    var keyBytes = hexToBytes(key);
    var encryptedBytes = hexToBytes(encryptedData);

    var decryptedBytes = [];

    for (var i = 0; i < encryptedBytes.length; i++) {
      var keyByte = keyBytes[i % keyBytes.length];
      var decryptedByte = encryptedBytes[i] ^ keyByte;

      decryptedBytes.push(decryptedByte);
    }

    var decryptedData = bytesToUtf8(decryptedBytes);

    return decryptedData;
  }

  function hexToBytes(hex) {
    var bytes = [];

    for (var i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    return bytes;
  }

  function bytesToHex(bytes) {
    return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function utf8ToBytes(utf8) {
    var bytes = [];

    for (var i = 0; i < utf8.length; i++) {
      var charCode = utf8.charCodeAt(i);

      if (charCode < 0x80) {
        bytes.push(charCode);
      } else if (charCode < 0x800) {
        bytes.push(0xc0 | (charCode >> 6));
        bytes.push(0x80 | (charCode & 0x3f));
      } else if (charCode < 0xd800 || charCode >= 0xe000) {
        bytes.push(0xe0 | (charCode >> 12));
        bytes.push(0x80 | ((charCode >> 6) & 0x3f));
        bytes.push(0x80 | (charCode & 0x3f));
      } else {
        i++;

        var surrogateCharCode =
          0x10000 + (((charCode & 0x3ff) << 10) | (utf8.charCodeAt(i) & 0x3ff));

        bytes.push(0xf0 | (surrogateCharCode >> 18));
        bytes.push(0x80 | ((surrogateCharCode >> 12) & 0x3f));
        bytes.push(0x80 | ((surrogateCharCode >> 6) & 0x3f));
        bytes.push(0x80 | (surrogateCharCode & 0x3f));
      }
    }

    return bytes;
  }

  function bytesToUtf8(bytes) {
    var utf8 = '';
    var i = 0;

    while (i < bytes.length) {
      var byte1 = bytes[i++];
      var charCode;

      if ((byte1 & 0x80) === 0x00) {
        charCode = byte1;
      } else if ((byte1 & 0xe0) === 0xc0) {
        var byte2 = bytes[i++] & 0x3f;
        charCode = ((byte1 & 0x1f) << 6) | byte2;
      } else if ((byte1 & 0xf0) === 0xe0) {
        var byte2 = bytes[i++] & 0x3f;
        var byte3 = bytes[i++] & 0x3f;
        charCode = ((byte1 & 0x0f) << 12) | (byte2 << 6) | byte3;
      } else if ((byte1 & 0xf8) === 0xf0) {
        var byte2 = bytes[i++] & 0x3f;
        var byte3 = bytes[i++] & 0x3f;
        var byte4 = bytes[i++] & 0x3f;
        var surrogateCharCode =
          (((byte1 & 0x07) << 18) | (byte2 << 12) | (byte3 << 6) | byte4) -
          0x10000;
        charCode = (surrogateCharCode >> 10) | 0xd800;
        var surrogateTrail = (surrogateCharCode & 0x3ff) | 0xdc00;
        utf8 += String.fromCharCode(charCode, surrogateTrail);
        continue;
      } else {
        continue;
      }

      utf8 += String.fromCharCode(charCode);
    }

    return utf8;
  }

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
      var value = monacoEditorEncrypt.getValue();
      var publicKey = addressPlaceholder.innerHTML;
      var decryptedValue = encryptData(value, publicKey);
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
