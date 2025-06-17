import { ethers } from 'ethers';
import { fl_foom_address, fl_foom_abi, fl_lottery_address, fl_lottery_abi, fl_new_ticket } from './foom.js';

let provider, signer;

export async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask');
    return;
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById('accountAddress').textContent = address;
  document.getElementById('connectWallet').textContent = 'Connected';
  document.getElementById('connectWallet').disabled = true;

  getBalance();

  window.ethereum.on('accountsChanged', accounts => {
    if (accounts.length === 0) {
      location.reload();
    } else {
      document.getElementById('accountAddress').textContent = accounts[0];
      getBalance();
    }
  });
}

async function getBalance() {
  const balance = await provider.getBalance(await signer.getAddress());
  document.getElementById('accountBalance').textContent = ethers.utils.formatEther(balance);

  const lottery = new ethers.Contract(fl_lottery_address(), fl_lottery_abi(), signer);
  const walletBalance = await lottery.walletBalanceOf(await signer.getAddress());
  document.getElementById('lotteryBalance').textContent = ethers.utils.formatUnits(walletBalance, 18);

  const foom = new ethers.Contract(fl_foom_address(), fl_foom_abi(), signer);
  const foomBalance = await foom.balanceOf(await signer.getAddress());
  document.getElementById('foomBalance').textContent = ethers.utils.formatUnits(foomBalance, 18);
}

export async function createNewTicket() {
  const power = prompt("Enter ticket power (0-22)");
  const secret_power = await fl_new_ticket(0n, power);
  const lastIndex = "10"; // replace with real index logic
  document.getElementById('ticketSecret').textContent = `${secret_power},${lastIndex}`;
  document.getElementById('ticketPower').textContent = power;
  document.getElementById('ticketIndex').textContent = lastIndex;
}
