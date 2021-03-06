import * as assert from 'assert';
import * as path from 'path';

import { Task } from '../managers/tasks';
import Settings, { Options } from '../settings';
import { MicromatchOptions } from '../types/index';
import Provider from './provider';

export class TestProvider extends Provider<Array<{}>> {
	public read(_task: Task): Array<{}> {
		return [];
	}
}

export function getProvider(options?: Options): TestProvider {
	const settings = new Settings(options);

	return new TestProvider(settings);
}

describe('Providers → Provider', () => {
	describe('Constructor', () => {
		it('should create instance of class', () => {
			const provider = getProvider();

			assert.ok(provider instanceof Provider);
		});
	});

	describe('.getRootDirectory', () => {
		it('should return root directory for reader with global base (.)', () => {
			const provider = getProvider();

			const expected = process.cwd();

			const actual = provider.getRootDirectory({ base: '.' } as Task);

			assert.strictEqual(actual, expected);
		});

		it('should return root directory for reader with non-global base (fixtures)', () => {
			const provider = getProvider();

			const expected = path.join(process.cwd(), 'fixtures');

			const actual = provider.getRootDirectory({ base: 'fixtures' } as Task);

			assert.strictEqual(actual, expected);
		});
	});

	describe('.getReaderOptions', () => {
		it('should return options for reader with global base (.)', () => {
			const provider = getProvider();

			const actual = provider.getReaderOptions({
				base: '.',
				dynamic: true,
				patterns: ['**/*'],
				positive: ['**/*'],
				negative: []
			});

			assert.strictEqual(actual.basePath, '');
			assert.strictEqual(actual.concurrency, Infinity);
			assert.strictEqual(typeof actual.deepFilter, 'function');
			assert.strictEqual(typeof actual.entryFilter, 'function');
			assert.strictEqual(typeof actual.errorFilter, 'function');
			assert.ok(actual.followSymbolicLinks);
			assert.strictEqual(typeof actual.fs, 'object');
			assert.ok(!actual.stats);
			assert.ok(!actual.throwErrorOnBrokenSymbolicLink);
			assert.strictEqual(typeof actual.transform, 'function');
		});

		it('should return options for reader with non-global base (fixtures)', () => {
			const provider = getProvider();

			const actual = provider.getReaderOptions({
				base: 'fixtures',
				dynamic: true,
				patterns: ['**/*'],
				positive: ['**/*'],
				negative: []
			});

			assert.strictEqual(actual.basePath, 'fixtures');
		});
	});

	describe('.getMicromatchOptions', () => {
		it('should return options for micromatch', () => {
			const provider = getProvider();

			const expected: MicromatchOptions = {
				dot: false,
				matchBase: false,
				nobrace: false,
				nocase: false,
				noext: false,
				noglobstar: false
			};

			const actual = provider.getMicromatchOptions();

			assert.deepStrictEqual(actual, expected);
		});
	});
});
