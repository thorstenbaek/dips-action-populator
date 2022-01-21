import fetch from 'node-fetch';

import { QueryBuilder } from "./models/QueryBuilder";
import { ResultSet } from "./models/ResultSet";
import Instruction from "./models/Instruction";
import ActionFactory from './factories/ActionFactory';


export async function poll(fromDate:string): Promise<null | string> {
    console.log(`Polling for new instructions after ${fromDate}`);

    const builder = new QueryBuilder(getAql(fromDate));
    const query = builder.build();

    try {
        const response = await fetch(
            ehrStoreUrl + "/api/v1/query",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(query)
            }
        );    

        if (response.ok) {        
            let latestDate: string | null = null;
            const resultSet = await response.json() as ResultSet;
            if (resultSet.totalResults > 0) {
                console.log("Found new instructions : n=" + resultSet.totalResults);
                if (resultSet.rows) {
                    const instructions: Instruction[] = [];
                    resultSet.rows.forEach(row => {
                        instructions.push(rowToInstruction(row));
                    })
                    if (instructions.length > 0) {
                        const actionFactory = new ActionFactory();

                        instructions.map(i => {
                            var actions = actionFactory.createActions(i);
                            console.log(actions);
                        });
                        
                        console.log(`${instructions.length} instructions ready for action generation`);
                        console.log(instructions[0]);
                        // const latestVaccine = vaccines[0];
                        // latestDate = latestVaccine.committed;
                        // const remins = vaccineToRemin(vaccines);
                        // postReminVaccines(appConfig, remins).then(() => {
    
                        // }).catch(err => {
                        //     console.error("Error posting REMIN vaccines" + err);
                        // })
    
                    } else {
    
                    }
                }
            } else {
                console.log("No new instructions");        
            }

            return latestDate;
        }        

    } catch (error) {
        console.error(error);
    }
}

function rowToInstruction(row: any[]): Instruction {
    return {
        folderId: cellToString(row[0]),
        drug: cellToString(row[1]),
        dose: cellToNumber(row[2]),
        doseUnits: cellToString(row[3]),
        frequency: cellToNumber(row[4]),
        frequencyUnits: cellToString(row[5]),
        startTime: cellToDate(row[6]),
        endTime: cellToDate(row[7]),
        administrationType: cellToString(row[8]),
        clinicalIndication: cellToString(row[9])        
    }
}

function cellToNumber(c: any): number {
    if (typeof c == "number") {
        return c;
    }
    else {
        return -1;
    }
}

function cellToDistinctString(c: any) {
    return c + "";
}

function cellToString(c: any): string | undefined {
    if (c == null) {
        return undefined;
    }
    return c + "";
}

function cellToDate(c: any): Date {
    if (typeof c == "string") {
        return new Date(Date.parse(c));
    } else if (typeof c == "object") {
        return new Date();
    } else {
        return new Date();
    }
}


const ehrStoreUrl: string = "https://vt-bc-dev04-sr.dips.local:4443";
//const ehrStoreUrl: string = "https://vt-bc-dev01-sr.dips.local:4443";

function getAql(datestring: string): string {
return `
    select     
        tag(c, 'FolderId') as folder,
        i/activities[at0001]/description[at0002]/items[at0070]/value/value AS Drug,
        i/activities[at0001]/description[at0002]/items[openEHR-EHR-CLUSTER.dosage.v1]/items[at0144]/value/magnitude AS Dose,
        i/activities[at0001]/description[at0002]/items[openEHR-EHR-CLUSTER.dosage.v1]/items[at0144]/value/Units AS DoseUnits,
        i/activities[at0001]/description[at0002]/items[openEHR-EHR-CLUSTER.dosage.v1]/items[openEHR-EHR-CLUSTER.timing_daily.v1]/items[at0003]/value/magnitude AS Frequency,
        i/activities[at0001]/description[at0002]/items[openEHR-EHR-CLUSTER.dosage.v1]/items[openEHR-EHR-CLUSTER.timing_daily.v1]/items[at0003]/value/units AS FrequencyUnits,
        i/activities[at0001]/description[at0002]/items[at0113]/items[at0012]/value/value as StartDateTime,
        i/activities[at0001]/description[at0002]/items[at0113]/items[at0013]/value/value as EndDateTime,
        i/activities[at0001]/description[at0002]/items[at0091]/value/value as medicationAdministrationType,
        i/activities[at0001]/description[at0002]/items[at0018]/value/value as clinicalIndicationForMedication
    from
        versioned_object vo
        -- [latest_version]
            contains version v 
                contains composition c
                    contains INSTRUCTION i[openEHR-EHR-INSTRUCTION.medication_order.v2]
    where    
        v/commit_audit/time_committed/value > '2022-01-20T20:00:00.000Z'
    order by v/commit_audit/time_committed/value desc 
`;}

//${datestring}