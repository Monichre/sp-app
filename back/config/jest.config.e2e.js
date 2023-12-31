module.exports = {
	roots: ['<rootDir>/../e2e'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	testRegex: '\\.tsx?$',
	preset: '@shelf/jest-dynamodb'
}
