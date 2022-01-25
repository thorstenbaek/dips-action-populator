export default interface Action {
    folderId: string,
    patient: number,
    time?: Date,
    planned: Date,
    drug: string,
    administrationType: string,
    doubleCheck?: boolean,
    comment?: string
}