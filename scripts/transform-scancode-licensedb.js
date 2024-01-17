// Script to transform the scancode-licensedb data and write it to scancodeMap.js

/**
 * @typedef {Object} LicenseEntry
 * @property {string} license_key - Unique key for the license.
 * @property {string} category - Category of the license.
 * @property {string} spdx_license_key - Corresponding SPDX license key.
 * @property {string[]} other_spdx_license_keys - Array of other SPDX license keys, if any.
 * @property {boolean} is_exception - Indicates if the entry is an exception.
 * @property {boolean} is_deprecated - Indicates if the license is deprecated.
 * @property {string} json - Relative path to the JSON file for the license.
 * @property {string} yaml - Relative path to the YAML file for the license.
 * @property {string} html - Relative path to the HTML file for the license.
 * @property {string} license - Relative path to the LICENSE file for the license.
 */

const fs = require('fs');

// Read the downloaded JSON file
const rawData = fs.readFileSync('scancode-licensedb.json');
const scancodeData = JSON.parse(rawData.toString());

// Transform the data
const transformedData = transformScancodeData(scancodeData);

// Write the transformed data to scancodeMap.js
fs.writeFileSync('lib/scancodeMap.js', generateScancodeMapContent(transformedData));

/**
 * @param {LicenseEntry[]} data
 * @returns {string[][]}
 */
function transformScancodeData(data) {
  // Map the data to the required format
  return data.map(entry => [entry.license_key, entry.spdx_license_key]);
}

/**
 * @param {string[][]} data
 */
function generateScancodeMapContent(data) {
  // Convert the array pairs into string format
  const content = data.map(([licenseKey, spdxLicenseKey]) => `  ['${licenseKey}', '${spdxLicenseKey}']`);
  return `// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

// *** THIS FILE IS AUTO-GENERATED by service/.github/workflows/transform-scancode-licensedb.js ***
// *** DO NOT EDIT MANUALLY ***
//
// This is a mapping from scancode key to SPDX identifier based on https://scancode-licensedb.aboutcode.org/index.json
// See licenses in https://github.com/nexB/scancode-toolkit/blob/develop/src/licensedcode/data/licenses/
module.exports = new Map([
${content.join(',\n')}
]);`;
}
