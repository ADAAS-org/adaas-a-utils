import { A_Route } from "@adaas/a-utils/lib/A-Route/A-Route.entity";




jest.retryTimes(0);

describe('A-Route tests', () => {
    it('Should Allow to create a new A-Route', async () => {
        let route = new A_Route('/test/route');

        expect(route).toBeInstanceOf(A_Route);
        expect(route.path).toBe('/test/route');
    });
    it('Should properly parse and extract path params', async () => {
        let route = new A_Route('/test/route/:param1/:param2');

        expect(route).toBeInstanceOf(A_Route);
        expect(route.path).toBe('/test/route/:param1/:param2');
        expect(route.params).toEqual(['param1', 'param2']);

        const extractedParams = route.extractParams('/test/route/value1/value2');
        expect(extractedParams).toEqual({ param1: 'value1', param2: 'value2' });
    });
    it('Should properly parse received URL', async () => {
        let route = new A_Route('https://example.com/test/route?param1=value1&param2=value2');

        expect(route).toBeInstanceOf(A_Route);
        expect(route.path).toBe('/test/route');
        const query = route.extractQuery('https://example.com/test/route?param1=value1&param2=value2');
        expect(query).toEqual({ param1: 'value1', param2: 'value2' });
    });

})