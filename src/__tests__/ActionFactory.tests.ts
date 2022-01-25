/**
 * @jest-environment jsdom
 */

import Instruction from '../models/Instruction';
import ActionFactory from '../factories/ActionFactory';

describe("actionFactory.createActions", () => {
    const someFolderId: string = "some folder id";
    const somePatientId: number = 123456;
    const actionFactory: ActionFactory = new ActionFactory();

    it("null argument returns zero actions", () => {
        
        var actions = actionFactory.createActions(null);
        expect(actions.length).toEqual(0);
    }); 
    
    const instruction: Instruction = {
        folderId: someFolderId,
        patient: somePatientId,
        drug: "drug",
        dose: 123,
        doseUnits: "units",
        frequency: 1,
        frequencyUnits: "PerDay",
        administrationType: "Per/os",
        clinicalIndication: "",
        startTime: new Date(2022, 1, 1, 12),
        endTime: new Date(2022, 1, 15, 12),
        committed: "2022/1/1"
    }

    it("instruction with start- and endTime 14 days - frequence once per day - returns 14 actions", () => {
        var actions = actionFactory.createActions(instruction);
        expect(actions.length).toEqual(14);    
    })

    it("instruction with folderId - returns actions with same folderId", () => {
        var actions = actionFactory.createActions(instruction);
        actions.map(a => {
            expect(a.folderId).toEqual(someFolderId) })
    })

    it("instruction without endTime - returns actions for 7 days", () => {
        instruction.endTime = null;

        var actions = actionFactory.createActions(instruction);
        expect(actions.length).toEqual(7);        
    })
});