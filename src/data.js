import { ethers } from 'ethers';

export async function loadPeriods() {
  console.log('Loading periods...');

  const periods = await fetch('period.csv')
  console.log('Periods loaded:', await periods.text());

  fetch('period.csv')
    .then(res => res.text())
    .then(data => {
      const rows = data.trim().split('\n').reverse();
      const table = document.querySelector('#periods table');

      rows.forEach(row => {
        const cells = row.split(',');
        if (cells.length < 3) return;

        let vol = +ethers.utils.formatEther("0x" + cells[1]) / 1_000_000;
        let shares = +ethers.utils.formatEther("0x" + cells[2]) / 1_000_000;
        let apy = (1 + 0.04 * vol / shares) ** ((365 * 24 * 3600) / (16384 * 2)) - 1;

        const tr = document.createElement('tr');
        [cells[0], `${vol.toFixed(0)} M`, `${shares.toFixed(0)} M`, `${(apy * 100).toFixed(2)}`].forEach(value => {
          const td = document.createElement('td');
          td.textContent = value;
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
    });
}

export function loadPrayers() {
  fetch('prayers.csv')
    .then(res => res.text())
    .then(data => {
      const rows = data.trim().split('\n').slice(-10).reverse();
      const table = document.querySelector('#lastbets table');

      rows.forEach(row => {
        const cells = row.split(',');
        if (cells.length < 4) return;
        if (cells.length > 4) {
          cells[3] = cells.slice(3).join(',');
          cells.length = 4;
        }

        const tr = document.createElement('tr');
        cells.forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
    });
}
