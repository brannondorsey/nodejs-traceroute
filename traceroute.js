'use strict';

const Process = require('./process');

class Traceroute extends Process {
    constructor() {
        super('traceroute', ['-q', 1, '-n', '-A']);
    }

    parseDestination(data) {
        const regex = /^traceroute\sto\s(?:[a-zA-Z0-9:.]+)\s\(([a-zA-Z0-9:.]+)\)/;
        const parsedData = new RegExp(regex, '').exec(data);

        let result = null;
        if (parsedData !== null) {
            result = parsedData[1];
        }

        return result;
    }

    parseHop(hopData) {
        const regex = /^\s*(\d+)\s+(?:([a-zA-Z0-9:.]+)\s\[(AS\d+|\*)\]\s+([0-9.]+\s+ms)|(\*))/;
        const parsedData = new RegExp(regex, '').exec(hopData);

        let result = null;
        if (parsedData !== null) {
            if (parsedData[5] === undefined) {
                result = {
                    hop: parseInt(parsedData[1], 10),
                    ip: parsedData[2],
                    rtt1: parsedData[4],
                    asn: parsedData[3] == '*' ? parsedData[3] : parsedData[3].substring(2)
                };
            }
            else {
                result = {
                    hop: parseInt(parsedData[1], 10),
                    ip: parsedData[5],
                    rtt1: parsedData[5],
                    asn: '*'
                };
            }
        }

        return result;
    }
}

module.exports = Traceroute;