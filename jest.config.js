module.exports = {
  testURL: 'http://localhost',
  roots: [
    './'
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: [
    "**/?(*.)+(spec|test).(j|t)s?(x)"
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}
