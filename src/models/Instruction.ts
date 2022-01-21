export default interface Instruction {
    folderId: string;
    drug: string;
    dose: number;
    doseUnits: string;
    frequency: number;
    frequencyUnits: string;
    startTime: Date;
    endTime: Date;    
    administrationType: string;
    clinicalIndication: string;
}