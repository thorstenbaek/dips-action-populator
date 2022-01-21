import Action from "../models/Action";
import Instruction from "../models/Instruction";

export default class ActionFactory {
    public createActions(instruction: Instruction): Action[] {    
        let actions: Action[] = [];

        console.log("Creating actions....");

        return actions;
    }
}