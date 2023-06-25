document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.ethereum !== 'undefined') {
    var addressPlaceholder = document.querySelector('#account-address');
    var connectButton = document.querySelector('button.connect');

    addressPlaceholder.innerHTML = 'loading...';

    web3 = new Web3(window.web3.currentProvider);
    web3.eth.getAccounts().then(function (accounts) {
      addressPlaceholder.innerHTML = accounts[0];

      if (!accounts[0]) {
        connectButton.setAttribute('style', 'display:block');
      }
    });

    connectButton.addEventListener('click', function () {
      window.ethereum
        .enable()
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          alert('Failed to connect Metamask');
        });
    });

    window.ethereum.on('accountsChanged', () => window.location.reload());
    window.ethereum.on('disconnect', () => window.location.reload());
  } else {
    alert('Metamask is not installed or not available');
  }
});
