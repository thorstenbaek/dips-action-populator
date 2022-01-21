/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import ActionFactory from '../factories/ActionFactory';

beforeAll(() => {        
});

afterAll((() => {
  
}))

describe("actionFactory.createActions", () => {
    it("null argument returns zero actions", () => {
        const actionFactory: ActionFactory = new ActionFactory();
        actionFactory.createActions(null);
        expect(window.fetch).toHaveBeenCalledWith("http://localhost:8080/price.json", {method: "GET"});
    });

    /*it("sets the price when API returned", async () => {
        fetchPrice();
        await tick();
        await tick();
        expect(get(price)).toEqual("99.99");
    });*/
});