import Action from "../models/Action";

export default class ActionRepository {
    async push(action: Action): Promise<boolean> {
        console.log("pushing action");
        return true;
    }
}