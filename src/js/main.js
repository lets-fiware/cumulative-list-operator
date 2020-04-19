/*
 * Cumulative list operator
 * https://github.com/lets-fiware/cumulative-list-operator
 *
 * Copyright (c) 2020 Kazuhito Suda
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    var parseInputEndpointData = function parseInputEndpointData(data) {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new MashupPlatform.wiring.EndpointTypeError();
            }
        }

        if (data != null && !Array.isArray(data)) {
            throw new MashupPlatform.wiring.EndpointTypeError();
        }

        return data;
    };

    var pushEvent = function pushEvent(data) {
        if (MashupPlatform.operator.outputs.outdata.connected) {
            MashupPlatform.wiring.pushEvent("outdata", data);
        }
    }

    var valueList = function valueList(indata) {
        indata = parseInputEndpointData(indata);

        var send_nulls = MashupPlatform.prefs.get("send_nulls");
        if (indata == null && send_nulls) {
            return pushEvent(null);
        } else if (indata == null) {
            return; // do nothing
        }

        var sum = 0;
        var outdata = indata.map(data => {
            if (data == null) {
                return null;
            }
            sum += data;
            return sum;
        });
        pushEvent(outdata);
    };

    /* TODO
     * this if is required for testing, but we have to search a cleaner way
     */
    if (window.MashupPlatform != null) {
        MashupPlatform.wiring.registerCallback("indata", valueList);
    }

    /* test-code */
    window.valueList = valueList;
    /* end-test-code */
})();
