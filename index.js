const fs = require('fs');
const path = require('path');
const axios = require('axios');
const qs = require('qs');

let filePath = `${__dirname}/mostProfitableGiver.txt`;
if (process.env.GIVER_PATH) {
  filePath = path.isAbsolute(process.env.GIVER_PATH) ? process.env.GIVER_PATH : path.join(process.cwd(), process.env.GIVER_PATH);
}
const DELAY = 1000 * 20; // 20 seconds

if (require.main.filename === __filename) {
  start();
}

let timeoutId;

async function start(delay) {
  try {
    const mostProfitableGiver = await getMostProfitableGiver();
    fs.writeFileSync(path.normalize(filePath), mostProfitableGiver);
    timeoutId = setTimeout(start, delay || DELAY, delay);
  } catch(err) {
    console.error(err);
    timeoutId = setTimeout(start, delay || DELAY, delay);
  }
}

function stop() {
  clearTimeout(timeoutId);
}

async function getMostProfitableGiver() {
  const url = 'https://tonmon.xyz/api/datasources/proxy/1/api/v1/query_range';
  const start = parseInt((Date.now() / 1000));
  const end = start + 86400;
  const data = {
    query: 'ton_giver_complexity / 10000000000000000000000000000000000000',
    start,
    end,
    step: 60,
  };

  const response = await axios({
    url,
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
  });

  let mostProfitableGiver = null;
  let mostProfitableGiverHs = 0;

  for (const { metric, values } of response.data.data.result) {
    const { giver } = metric;
    const currentHs = BigInt(values.pop()[1]);

    if (currentHs > mostProfitableGiverHs) {
      mostProfitableGiver = giver;
      mostProfitableGiverHs = currentHs;
    }
  }

  return mostProfitableGiver;
}

exports.getMostProfitableGiver = getMostProfitableGiver;
exports.start = start;
exports.stop = stop;
