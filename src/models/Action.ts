export default interface Action {
    folderId: string,
    time?: Date,
    planned: Date,
    drug: string,
    administrationType: string,
    doubleCheck?: boolean,
    comment?: string
}