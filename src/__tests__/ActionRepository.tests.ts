import Action from "../models/Action"
import ActionRepository from "../repositories/ActionRepository"
import SmartEhrClient, { ISmartEhrClient } from "../repositories/SmartEhrClient"

class SmartEhrClientMock implements ISmartEhrClient{
    async SaveComposition(action: Action, composition: string): Promise<boolean> {
        console.log("mocking save composition.....");
        
        return true;
    }
}

describe("ActionRepository.pushAction", () => {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const actionRepository = new ActionRepository(new SmartEhrClientMock())

    it("push empty", async () => {
        
        const action: Action = {
            folderId: "Some folder id",
            patient: 123456,
            drug: "Paracetamol",
            dose: 100,
            doseUnits: "mg",
            administrationType: "Per os",
            planned: new Date(2022, 1, 1),
            comment: "Test action",
            doubleCheck: false,
            time: null
        }
        
        var test = await actionRepository.push(action)
        console.log(test);
    })

})