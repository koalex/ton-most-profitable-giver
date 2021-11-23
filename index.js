const fs = require('fs');
const axios = require('axios');
const qs = require('qs');

const DELAY = 1000 * 20; // 20 seconds

start();

async function start() {
	try {
		const mostProfitableGiver = await getMostProfitableGiver();
		fs.writeFileSync(`${__dirname}/mostProfitableGiver.txt`, mostProfitableGiver);
		setTimeout(start, DELAY);
	} catch(err) {
		console.error(err);
		setTimeout(start, DELAY);
	}
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
	}

	const response = await axios({
		url,
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: qs.stringify(data),
	});

	let mostProfitableGiver = null;
	let mostProfitableGiverHs = Infinity;

	for (const { metric, values } of response.data.data.result) {
		const { giver } = metric;
		const currentHs = BigInt(values.pop()[1]);

		if (currentHs < mostProfitableGiverHs) {
			mostProfitableGiver = giver;
			mostProfitableGiverHs = currentHs;
		}
	}

	return mostProfitableGiver;
}
