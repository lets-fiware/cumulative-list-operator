/* globals MockMP */

(function () {

    "use strict";

    describe("CumulativeList", function () {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'operator',
                prefs: {
                    "prop_name": "name",
                    "send_nulls": true,
                },
                inputs: ['indata'],
                outputs: ['outdata']
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.operator.outputs.outdata.connect({simulate: () => {}});
        });

        it("sort test 1", function () {
            valueList([1, 2, 3, 4, 5]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('outdata', [1, 3, 6, 10, 15]);
        });


        it("allowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", true);

            valueList(null);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('outdata', null);
        });

        it("disallowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", false);

            valueList(null);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                valueList("{");
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                valueList(123);
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });
    });
})();
