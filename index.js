const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

// Banner
function showBanner() {
  console.clear();
  console.log(chalk.magentaBright(`
========================================
  █████╗ ██╗   ██╗████████╗ ██████╗ 
 ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗
 ███████║██║   ██║   ██║   ██║   ██║
 ██╔══██║██║   ██║   ██║   ██║   ██║
 ██║  ██║╚██████╔╝   ██║   ╚██████╔╝
 ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ 
SAT SET 
                           [by Chandra]
========================================
`));
}

showBanner();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(
  chalk.cyanBright('Pilih jenis file rawdata yang ingin diproses:\n') +
  chalk.greenBright('[1] JSON (format array objek)\n') +
  chalk.yellowBright('[2] Teks (format Wallet 1, Wallet 2, dst)\n')
);

rl.question(chalk.blue('Masukkan nomor pilihan (1 / 2): '), (choice) => {
  try {
    const rawData = fs.readFileSync('rawdata.txt', 'utf-8');
    const cleanData = rawData.trim();

    const addresses = [];
    const privateKeys = [];
    const mnemonics = [];

    if (choice === '1') {
      const parsed = JSON.parse(cleanData);
      parsed.forEach(item => {
        addresses.push(item.address);
        privateKeys.push(item.privateKey.replace(/^0x/, ''));
        mnemonics.push(item.mnemonic);
      });

    } else if (choice === '2') {
      const wallets = cleanData.split('----------------------------------').filter(Boolean);

      wallets.forEach(wallet => {
        const addressMatch = wallet.match(/Address:\s*(0x[a-fA-F0-9]+)/);
        const pkMatch = wallet.match(/Private Key:\s*(0x[a-fA-F0-9]+)/);
        const mnemonicMatch = wallet.match(/Mnemonic:\s*(.+)/);

        if (addressMatch) addresses.push(addressMatch[1]);
        if (pkMatch) privateKeys.push(pkMatch[1].replace(/^0x/, ''));
        if (mnemonicMatch) mnemonics.push(mnemonicMatch[1]);
      });

    } else {
      console.log(chalk.red('Pilihan tidak valid. Harus 1 atau 2.'));
      rl.close();
      return;
    }

    fs.writeFileSync('address.txt', addresses.join('\n'));
    fs.writeFileSync('privateKey.txt', privateKeys.join('\n'));
    fs.writeFileSync('mnemonic.txt', mnemonics.join('\n'));

    console.log(chalk.green('\nBerhasil ekstrak!'));
    console.log(chalk.cyanBright('Address tetap pakai 0x, PrivateKey tanpa 0x.'));
  } catch (err) {
    console.error(chalk.red('Gagal ekstrak:'), err.message);
  }

  rl.close();
});
