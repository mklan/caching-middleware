const cache = require('../index');

describe('cache', () => {
    it('should append primary result to default resultKey', async () => {

        const expectedResult = 'hello';

        const primary = () => expectedResult;
        const fallback = () => {};

        const req = {};
        const res = {};

        const callback = () => {
            expect(req.cacheResult).toEqual(expectedResult);
        }

        cache({ primary, fallback })(req, res, callback);

    });

    it('should append primary result to custom resultKey', async () => {

        const expectedResultKey = 'data';
        const expectedResult = 'hello';

        const primary = () => expectedResult;
        const fallback = () => {};

        const req = {};
        const res = {};

        const callback = () => {
            expect(req[expectedResultKey]).toEqual(expectedResult);
        }

        cache({ primary, fallback, resultKey: expectedResultKey })(req, res, callback);

    });

    it('should pass req to context callback', async () => {


        const primary = () => 'hallo';
        const fallback = () => {};
        const callback = () => {};

        const req = { some: 'data' };
        const res = {};

        const context = (passedReq) => expect(passedReq).toEqual(req);

        cache({ primary, fallback, context })(req, res, callback);
    });

    it('should pass context to to findAndUpdate ie. primary callback', async () => {

        const expectedContext = { some: 'data' };

        const context = () => expectedContext;

        const primary = (ctx) => expect(ctx).toEqual(expectedContext);
        const fallback = () => {};

        const req = {};
        const res = {};

        const callback = () => {}

        cache({ primary, fallback, context })(req, res, callback);

    });

    it('should throw error when primary callback missing', async () => {

        const fallback = () => {};

        const req = {};
        const res = {};

        const callback = () => {}

        try{
          await cache({ fallback })(req, res, callback);
        } catch(e) {
          expect(e).toBeDefined();
        }

    });

    it('should throw error when fallback callback missing', async () => {

        const primary = () => {};

        const req = {};
        const res = {};

        const callback = () => {}

        try{
          await cache({ primary })(req, res, callback);
        } catch(e) {
          expect(e).toBeDefined();
        }

    });

});