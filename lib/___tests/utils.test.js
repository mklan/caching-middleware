const { find, findAndUpdate } = require('../utils');

describe('find', () => {
    it('should return primary result if result is defined', async () => {

        const context = {};

        const expectedResult = { result: 'hello', origin: 'primary' };

        const primary = () => expectedResult.result;
        
        const result = await find(context, { primary });

        expect(result).toEqual(expectedResult);
    });

    it('should return fallback result if primary result is undefined', async () => {

        const context = {};

        const expectedResult = { result: 'hello', origin: 'fallback' };

        const primary = () => null;
        const fallback = () => expectedResult.result;
        
        const result = await find(context, { primary, fallback });

        expect(result).toEqual(expectedResult);
    });

    it('should pass context into primary', async () => {

        const context = { some: 'context' };

        const primary = (ctx) => expect(ctx).toEqual(context);
        const fallback = () => {};
        
        await find(context, { primary, fallback });

    });

    it('should pass context into fallback', async () => {

        const context = { some: 'context' };

        const primary = () => null;
        const fallback = (ctx) => expect(ctx).toEqual(context);
        
        await find(context, { primary, fallback });

    });

    it('should return undefined if fallback undefined', async () => {

        const context = { some: 'context' };

        const primary = () => null;
        const fallback = (ctx) => null;
        
        const result = await find(context, { primary, fallback });

        expect(result.result).toBe(null);
        expect(result.origin).toBe('fallback');
    });
});

describe('findAndUpdate', () => {
    it('should return primary result if found', async () => {

        const context = {};

        const expectedResult = { result: 'hello', origin: 'primary' };

        const primary = () => expectedResult.result;
        
        const result = await findAndUpdate(context, { primary });

        expect(result).toEqual(expectedResult);
    });

    it('should return fallback result if primary not found', async () => {

        const context = {};

        const expectedResult = { result: 'hello', origin: 'fallback' };

        const primary = () => null;
        const fallback = () => expectedResult.result;
        
        const result = await findAndUpdate(context, { primary, fallback });

        expect(result).toEqual(expectedResult);
    });

    
    it('should call update callback when fallback result found', async () => {

        const context = {};

        const expectedResult = { result: 'hello', origin: 'fallback' };

        const primary = () => null;
        const fallback = () => expectedResult.result;
        const update = (result) =>  expect(result).toEqual(expectedResult.result);
        
        const result = await findAndUpdate(context, { primary, fallback, update });
    });

        
    it('should pass context into update callback', async () => {

        const context = { some: 'context' };

        const expectedResult = { result: 'hello', origin: 'fallback' };

        const primary = () => null;
        const fallback = () => expectedResult.result;
        const update = (result, ctx) =>  expect(ctx).toEqual(context);
        
        await findAndUpdate(context, { primary, fallback, update });
    });

    
});