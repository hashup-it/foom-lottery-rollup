import { connectWallet, createNewTicket } from './wallet.js';
import { loadPeriods, loadPrayers } from './data.js';

(async () => {
  document.getElementById('connectWallet').addEventListener('click', connectWallet);
  document.getElementById('createNewTicket').addEventListener('click', createNewTicket);

  loadPeriods();
  loadPrayers();
})();
