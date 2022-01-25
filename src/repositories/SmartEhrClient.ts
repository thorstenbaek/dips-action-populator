import fetch from "node-fetch";
import Action from "../models/Action";
import DocumentRequest from "./DocumentRequest";

const SmartEhrTicket: string = "20886143-076c-4adc-9d6e-d0f64da91b2f";
//const SmartEhrUrl: string = "https://localhost:44311";
const SmartEhrUrl: string = "https://vt-bc-dev04-sr.dips.local/Arena-SmartEHR";


export interface ISmartEhrClient {
    SaveComposition(action: Action, composition: string): Promise<boolean>;
}



export default class SmartEhrClient implements ISmartEhrClient{

    dateToISOButLocal(date: Date): string {
        return date.toLocaleString('sv').replace(' ', 'T');
    }

    async SaveComposition(action: Action, composition: string): Promise<boolean> {
        var buffer = Buffer.from(composition);
        var base64string = buffer.toString("base64");

        var documentRequest: DocumentRequest = {
            content: base64string,
            contentType: "application/json",
            templateId: 1003061,
            documentTypeId: -3443,
            patientId: action.patient,
            authorId: 1004745, //Rekvirent: Thor Stenbæk 
            eventTime: this.dateToISOButLocal(action.planned),
            documentFormat: 16,
            folderId: action.folderId
        }

        var body = JSON.stringify(documentRequest);
        const response = await fetch(
            SmartEhrUrl + "/document", 
            {
                method: "POST",
                headers: {
                    "TicketHeader": SmartEhrTicket,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: body
            });

        return response.ok;
    }
}