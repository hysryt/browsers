import { readFile, writeFile } from 'fs/promises';
import dateFormat, { masks } from "dateformat";

const data = JSON.parse(
    await readFile('./node_modules/caniuse-db/fulldata-json/data-2.0.json')
);

const jpUsage = JSON.parse(
    await readFile('./node_modules/caniuse-db/region-usage-json/JP.json')
);

const targets = [
    'chrome',
    'firefox',
    'safari',
    'ios_saf',
    'and_chr',
    'and_ff',
];

const browsers = {};
targets.forEach(target => {
    const versions = [];
    data.agents[target].version_list.forEach(version => {
        let usage_in_jp = null;
        if ( jpUsage.data[target][version.version] != null) {
            usage_in_jp = Math.ceil(jpUsage.data[target][version.version]*1000)/1000;
        }
        versions.push({
            version: version.version,
            release_date: yyyymmdd(version.release_date),
            usage_in_jp,
        });
    })

    const browser = {
        name: data.agents[target].long_name,
        current_version: data.agents[target].current_version,
        versions,
    };

    browsers[target] = browser;
});

console.log(JSON.stringify(
    {
        updated: yyyymmdd(data.updated),
        usage_date: jpUsage.month.replace('-','/'),
        browsers,
    }
));


function yyyymmdd(d) {
    if (d) {
        return dateFormat(d * 1000, 'yyyy/mm/dd')
    }
    return null;
}