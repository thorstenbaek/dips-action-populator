import Action from "../models/Action"
import ActionRepository from "../repositories/ActionRepository"
import SmartEhrClient from "../repositories/SmartEhrClient"

describe("ActionRepository.pushAction", () => {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const actionRepository = new ActionRepository(new SmartEhrClient())

    it("push empty", async () => {
        
        const action: Action = {
            folderId: "Some folder id",
            patient: 123456,
            drug: "Paracetamol",
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