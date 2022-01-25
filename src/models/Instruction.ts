export default interface Instruction {
    folderId: string;
    patient: number;
    drug: string;
    dose: number;
    doseUnits: string;
    frequency: number;
    frequencyUnits: string;
    startTime: Date;
    endTime: Date;    
    administrationType: string;
    clinicalIndication: string;
    committed: string;
}