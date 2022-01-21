import Action from "../models/Action";
import Instruction from "../models/Instruction";

const maxDays: number = 7;

export default class ActionFactory {
    
    public createActions(instruction: Instruction): Action[] {
        let actions: Action[] = [];

        if (instruction) {

            const interval: number = 24 / instruction.frequency;

            var currentTime: Date = instruction.startTime;
            const endTime: Date = instruction.endTime ?? new Date(instruction.startTime.getTime() + maxDays * 24 * 60 * 60 * 1000);

            while (currentTime < endTime) {
                var action = {
                    folderId: instruction.folderId,
                    time: null,
                    planned: currentTime,
                    drug: instruction.drug,
                    administrationType: instruction.administrationType,
                    doubleCheck: null,
                    comment: null
                }

                actions.push(action)
                currentTime = new Date(currentTime.getTime() + interval * 60 * 60 * 1000);
            }
        }

        return actions;
    }
}