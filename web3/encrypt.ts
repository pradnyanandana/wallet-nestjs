import Web3 from 'web3';

declare let window: any;

if (typeof window.ethereum !== 'undefined') {
  new Web3(window.ethereum);

  window.ethereum
    .enable()
    .then((accounts: any) => {
      const metamaskPublicKey = accounts[0];

      alert(metamaskPublicKey);
    })
    .catch(() => {
      alert('Failed to retrieve Metamask public key');
    });
} else {
  alert('Metamask is not installed or not available');
}
