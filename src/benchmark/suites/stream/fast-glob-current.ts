import * as path from 'path';

import * as glob from '../../../index';
import Settings from '../../../settings';
import * as utils from '../../utils';

const settings = new Settings({
	cwd: path.join(process.cwd(), process.env.BENCHMARK_BASE_DIR as string),
	unique: false
});

const entries: string[] = [];

const timeStart = utils.timeStart();

const stream = glob.stream(process.env.BENCHMARK_PATTERN as string, settings);

stream.on('data', (data: string) => {
	entries.push(data);
});

stream.on('error', () => {
	process.exit(0);
});

stream.once('end', () => {
	const memory = utils.getMemory();
	const time = utils.timeEnd(timeStart);
	const measures = utils.getMeasures(entries.length, time, memory);

	console.info(measures);
});
