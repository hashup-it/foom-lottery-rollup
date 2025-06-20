function randomBytes(n) {
  const array = new Uint8Array(n);
  window.crypto.getRandomValues(array);
  return array;
}

//// bigint.js

// Generates a random BigInt of specified byte length
const rbigint = (nbytes) => leBufferToBigint(randomBytes(nbytes));

// Converts a hex string value to Bigint.
function hexToBigint(value) {
  if (typeof value === "string") {
    // If it's a hex string
    if (value.startsWith("0x")) {
      return BigInt(value);
    }
    return BigInt("0x" + value);
  }
  // If it's already a number or BigInt
  return BigInt(value);
}

// Converts a Bigint to hex string of specified length
const bigintToHex = (number, length = 32) =>
  "0x" + number.toString(16).padStart(length * 2, "0");
//const bigintToHex = (number, length = 32) =>
//  "0x" + number.toHexString().padStart(length * 2, "0");
// Converts a buffer of bytes into a BigInt, assuming little-endian byte order.
const leBufferToBigint = (buff) => {
  let res = 0n;
  for (let i = 0; i < buff.length; i++) {
    const n = BigInt(buff[i]);
    res = res + (n << BigInt(i * 8));
  }
  return res;
};

// Converts a BigInt to a little-endian Uint8Array of specified byte length.
function leBigintToBuffer(num, byteLength) {
  if (num < 0n) throw new Error("BigInt must be non-negative");
  // Validate that byteLength is sufficient to represent the number
  const requiredLength = Math.ceil(num.toString(2).length / 8);
  if (byteLength < requiredLength) {
    throw new Error(
      `The specified byteLength (${byteLength}) is too small to represent the number`
    );
  }
  const buffer = new Uint8Array(byteLength);
  // Fill the buffer with bytes from BigInt in little-endian order
  for (let i = 0; i < byteLength; i++) {
    buffer[i] = Number(num & 0xffn); // Get the lowest 8 bits
    num >>= 8n; // Shift by 8 bits to the right
  }
  return buffer;
}

// reverese bits
const reverseBits = (num, bitLength) => {
  let res = 0n;
  for (let i = 0; i < bitLength; i++) {
    res = (res << 1n) | (num & 1n);
    num >>= 1n;
  }
  return res;
};

export async function fl_new_ticket(secret, power) {
  if(secret == 0n) {
    secret = rbigint(31)-10000n;
  }
  let hash = 0n;
  let i = 0n;
  let secret_power = 0n;
  for(;;){
    console.log("calculating secret...");
    for(; i < 10000n; i++) {
      hash = await fl_pedersenHash(leBigintToBuffer(secret, 31));
      if((hash & 0x1fn)==0n) {
        break;
      }
      secret = secret + 1n;
    }
    if(i >= 10000n) { throw new Error("Failed to create ticket"); }
    secret_power = secret<<8n | BigInt(power);
    return bigintToHex(secret_power);
  }
}

async function fl_pedersenHash(data) {
  const pedersen = await window.circomlibjs.buildPedersenHash();
  const pedersenOutput = pedersen.hash(data);
  const babyJubOutput = leBufferToBigint(
    pedersen.babyJub.F.fromMontgomery(
      pedersen.babyJub.unpackPoint(pedersenOutput)[0]
    )
  );
  return babyJubOutput;
};

function fl_bet_min() {
  if(window.CHAIN == "BASE") {
    return "1000000";
  }
  throw new Error("CHAIN not set");
}

function fl_rpc_url() {
  if(window.CHAIN == "BASE") {
    return 'https://mainnet.base.org/';
  }
  throw new Error("CHAIN not set");
}

function fl_foom_url() {
  if(window.CHAIN == "BASE") {
    return 'https://foom.cash/files/base';
  }
  throw new Error("CHAIN not set");
}

function fl_gas_price_limit() {
  if(window.CHAIN == "BASE") {
    return "0.02";
  }
  throw new Error("CHAIN not set");
}

function fl_wait_blocks() {
  if(window.CHAIN == "BASE") {
    return 5;
  }
  throw new Error("CHAIN not set");
}

function fl_log_start() {
  if(window.CHAIN == "BASE") {
    return 30899833;
  }
  throw new Error("CHAIN not set");
}

function fl_dex_address() {
  if(window.CHAIN == "BASE") {
    return '0xc5adb6F67c54D187a9FD8bA4994855e35963B69D';
  }
  throw new Error("CHAIN not set");
}

function fl_dex_abi() {
  if(window.CHAIN == "BASE") {
    return [
      "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
    ];
  }
  throw new Error("CHAIN not set");
}

function fl_weth_address() {
  if(window.CHAIN == "BASE") {
    return '0x4200000000000000000000000000000000000006';
  }
  throw new Error("CHAIN not set");
}

function fl_weth_abi() {
  return fl_foom_abi();
}

export function fl_foom_address() {
  if(window.CHAIN == "BASE") {
    return '0x02300aC24838570012027E0A90D3FEcCEF3c51d2';
  }
  throw new Error("CHAIN not set");
}

export function fl_foom_abi() {
  if(window.CHAIN == "BASE") {
    return [
      "function balanceOf(address) view returns (uint256)",
      "function approve(address,uint256) external returns (bool)",
      "function allowance(address,address) view returns (uint256)",
      "function walletBalanceOf(address) view returns (uint256)",
    ];
  }
  throw new Error("CHAIN not set");
}

export function fl_lottery_address() {
  if(window.CHAIN == "BASE") {
    return '0xdb203504ba1fea79164AF3CeFFBA88C59Ee8aAfD';
  }
  throw new Error("CHAIN not set");
}

export function fl_lottery_abi() {
  return [
    { "inputs":
      [
        {"internalType":"contract IWithdraw","name":"_Withdraw","type":"address"},
        {"internalType":"contract ICancel","name":"_Cancel","type":"address"},
        {"internalType":"contract IUpdate1","name":"_Update1","type":"address"},
        {"internalType":"contract IUpdate3","name":"_Update3","type":"address"},
        {"internalType":"contract IUpdate5","name":"_Update5","type":"address"},
        {"internalType":"contract IUpdate11","name":"_Update11","type":"address"},
        {"internalType":"contract IUpdate21","name":"_Update21","type":"address"},
        {"internalType":"contract IUpdate44","name":"_Update44","type":"address"},
        {"internalType":"contract IUpdate89","name":"_Update89","type":"address"},
        {"internalType":"contract IUpdate179","name":"_Update179","type":"address"},
        {"internalType":"contract IERC20","name":"_Token","type":"address"},
        {"internalType":"contract ISwapRouter","name":"_Router","type":"address"},
        {"internalType":"uint256","name":"_BetMin","type":"uint256"}
      ],
      "stateMutability":"nonpayable",
      "type":"constructor"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"uint256","name":"index","type":"uint256"},
        {"indexed":true,"internalType":"uint256","name":"newHash","type":"uint256"}
      ],
      "name":"LogBetIn",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"uint256","name":"index","type":"uint256"}
      ],
      "name":"LogCancel",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"address","name":"owner","type":"address"},
        {"indexed":true,"internalType":"address","name":"newGenerator","type":"address"}
      ],
      "name":"LogChangeGenerator",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"address","name":"owner","type":"address"},
        {"indexed":true,"internalType":"address","name":"newOwner","type":"address"}
      ],
      "name":"LogChangeOwner",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"address","name":"owner","type":"address"}
      ],
      "name":"LogClose",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"uint256","name":"index","type":"uint256"},
        {"indexed":true,"internalType":"uint256","name":"commitIndex","type":"uint256"},
        {"indexed":true,"internalType":"uint256","name":"commitHash","type":"uint256"}
      ],
      "name":"LogCommit",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"uint256","name":"commitBlockHash","type":"uint256"}
      ],
      "name":"LogHash",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"uint256","name":"betId","type":"uint256"},
        {"indexed":false,"internalType":"bytes32[]","name":"prayer","type":"bytes32[]"}
      ],
      "name":"LogPrayer",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"address","name":"owner","type":"address"}
      ],
      "name":"LogReopen",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"address","name":"owner","type":"address"}
      ],
      "name":"LogResetCommit",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"uint256","name":"lastRoot","type":"uint256"},
        {"indexed":true,"internalType":"uint256","name":"revealSecret","type":"uint256"}
      ],
      "name":"LogSecret",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"uint256","name":"index","type":"uint256"},
        {"indexed":true,"internalType":"uint256","name":"newRand","type":"uint256"},
        {"indexed":true,"internalType":"uint256","name":"newRoot","type":"uint256"}
      ],
      "name":"LogUpdate",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"uint256","name":"nullifierHash","type":"uint256"},
        {"indexed":true,"internalType":"uint256","name":"reward","type":"uint256"},
        {"indexed":true,"internalType":"address","name":"recipient","type":"address"}
      ],
      "name":"LogWin",
      "type":"event"
    },
    { "anonymous":false,
      "inputs":
      [
        {"indexed":true,"internalType":"address","name":"owner","type":"address"}
      ],
      "name":"LogWithdraw",
      "type":"event"
    },
    { "stateMutability":"payable",
      "type":"fallback"
    },
    { "inputs":[],
      "name":"D",
      "outputs":[
        {"internalType":"uint64","name":"periodStartBlock","type":"uint64"},
        {"internalType":"uint64","name":"commitBlock","type":"uint64"},
        {"internalType":"uint32","name":"nextIndex","type":"uint32"},
        {"internalType":"uint16","name":"dividendPeriod","type":"uint16"},
        {"internalType":"uint8","name":"betsLimit","type":"uint8"},
        {"internalType":"uint8","name":"betsStart","type":"uint8"},
        {"internalType":"uint8","name":"betsIndex","type":"uint8"},
        {"internalType":"uint8","name":"commitIndex","type":"uint8"},
        {"internalType":"uint8","name":"status","type":"uint8"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"adminwithdraw",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":[],
      "name":"betMin",
      "outputs":
      [
        {"internalType":"uint128","name":"","type":"uint128"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"betPower1",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"betPower2",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"betPower3",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"betSum",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "name":"bets",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"betsIndex",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"betsLimit",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"betsMax",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"cancel",
      "outputs":
      [
        {"internalType":"contract ICancel","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},
        {"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},
        {"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},
        {"internalType":"uint256","name":"_betIndex","type":"uint256"},
        {"internalType":"address","name":"_recipient","type":"address"}
      ],
      "name":"cancelbet",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"address","name":"_who","type":"address"}
      ],
      "name":"changeGenerator",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"address","name":"_who","type":"address"}
      ],
      "name":"changeOwner",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"address","name":"_router","type":"address"}
      ],
      "name":"changeRouter",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":[],
      "name":"close",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},
        {"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},
        {"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},
        {"internalType":"uint256","name":"_root","type":"uint256"},
        {"internalType":"uint256","name":"_nullifierHash","type":"uint256"},
        {"internalType":"address","name":"_recipient","type":"address"},
        {"internalType":"address","name":"_relayer","type":"address"},
        {"internalType":"uint256","name":"_fee","type":"uint256"},
        {"internalType":"uint256","name":"_refund","type":"uint256"},
        {"internalType":"uint256","name":"_rewardbits","type":"uint256"},
        {"internalType":"uint256","name":"_invest","type":"uint256"}
      ],
      "name":"collect",
      "outputs":[],
      "stateMutability":"payable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"address","name":"_who","type":"address"}
      ],
      "name":"collectDividend",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"_commitHash","type":"uint256"},
        {"internalType":"uint256","name":"_maxUpdate","type":"uint256"}
      ],
      "name":"commit",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":[],
      "name":"commitBlockHash",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"commitHash",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"commitIndex",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"currentBalance",
      "outputs":
      [
        {"internalType":"uint128","name":"","type":"uint128"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"dividendFeePerCent",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"dividendPeriod",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"generator",
      "outputs":
      [
        {"internalType":"address","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"generatorFeePerCent",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"lastRoot",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"maxUpdate",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"nextIndex",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "name":"nullifier",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"owner",
      "outputs":
      [
        {"internalType":"address","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"_amount","type":"uint256"}
      ],
      "name":"payOut",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"period","type":"uint256"}
      ],
      "name":"periodBets",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"periodBlocks",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"period","type":"uint256"}
      ],
      "name":"periodShares",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "name":"periods",
      "outputs":
      [
        {"internalType":"uint128","name":"bets","type":"uint128"},
        {"internalType":"uint128","name":"shares","type":"uint128"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"_secrethash","type":"uint256"},
        {"internalType":"uint256","name":"_power","type":"uint256"}
      ],
      "name":"play",
      "outputs":[],
      "stateMutability":"payable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"_secrethash","type":"uint256"},
        {"internalType":"uint256","name":"_power","type":"uint256"},
        {"internalType":"string","name":"_prayer","type":"string"}
      ],
      "name":"playAndPray",
      "outputs":[],
      "stateMutability":"payable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"_secrethash","type":"uint256"},
        {"internalType":"uint256","name":"_power","type":"uint256"}
      ],
      "name":"playETH",
      "outputs":[],
      "stateMutability":"payable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"_secrethash","type":"uint256"},
        {"internalType":"uint256","name":"_power","type":"uint256"},
        {"internalType":"string","name":"_prayer","type":"string"}
      ],
      "name":"playETHAndPray",
      "outputs":[],
      "stateMutability":"payable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"_betId","type":"uint256"},
        {"internalType":"string","name":"_prayer","type":"string"}
      ],
      "name":"pray",
      "outputs":[],
      "stateMutability":"payable",
      "type":"function"
    },
    { "inputs":[],
      "name":"prayer",
      "outputs":
      [
        {"internalType":"string","name":"","type":"string"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"rememberHash",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":[],
      "name":"reopen",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":[],
      "name":"resetcommit",
      "outputs":[],
      "stateMutability":"payable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"_revealSecret","type":"uint256"},
        {"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},
        {"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},
        {"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},
        {"internalType":"uint256","name":"_newRoot","type":"uint256"}
      ],
      "name":"reveal",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    {
      "inputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "name":"roots",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"router",
      "outputs":
      [
        {"internalType":"contract ISwapRouter","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"uint256","name":"_revealSecret","type":"uint256"}
      ],
      "name":"secret",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":[],
      "name":"token",
      "outputs":
      [
        {"internalType":"contract IERC20","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"update1",
      "outputs":
      [
        {"internalType":"contract IUpdate1","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"update11",
      "outputs":
      [
        {"internalType":"contract IUpdate11","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"update179",
      "outputs":
      [
        {"internalType":"contract IUpdate179","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"update21",
      "outputs":
      [
        {"internalType":"contract IUpdate21","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"update3",
      "outputs":
      [
        {"internalType":"contract IUpdate3","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"update44",
      "outputs":
      [
        {"internalType":"contract IUpdate44","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"update5",
      "outputs":
      [
        {"internalType":"contract IUpdate5","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"update89",
      "outputs":
      [
        {"internalType":"contract IUpdate89","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"updateDividendPeriod",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"address","name":"_owner","type":"address"}
      ],
      "name":"walletBalanceOf",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"address","name":"_owner","type":"address"}
      ],
      "name":"walletDividendPeriodOf",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"address","name":"_owner","type":"address"}
      ],
      "name":"walletSharesOf",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":
      [
        {"internalType":"address","name":"_owner","type":"address"}
      ],
      "name":"walletWithdrawPeriodOf",
      "outputs":
      [
        {"internalType":"uint256","name":"","type":"uint256"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "inputs":[],
      "name":"withdraw",
      "outputs":
      [
        {"internalType":"contract IWithdraw","name":"","type":"address"}
      ],
      "stateMutability":"view",
      "type":"function"
    },
    { "stateMutability":"payable",
      "type":"receive"
    }
  ];
}
