import fetch from 'node-fetch';

import { QueryBuilder } from "./models/QueryBuilder";
import { ResultSet } from "./models/ResultSet";
import Instruction from "./models/Instruction";
import ActionFactory from './factories/ActionFactory';
import ActionRepository from './repositories/ActionRepository';
import SmartEhrClient from './repositories/SmartEhrClient';

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
                        const smartEhrClient = new SmartEhrClient();
                        const actionFactory = new ActionFactory();
                        const actionRepository = new ActionRepository(smartEhrClient);
                        latestDate = instructions[0].committed;

                        instructions.map(i => {
                            var actions = actionFactory.createActions(i);
                            
                            actions.map(async (a, index) => {
                                console.log(`Saving action ${index + 1} of ${actions.length}...`);

                                const success = await actionRepository.push(a);
                                if (success) {
                                    console.log(`Successfully saved action ${index}.`);
                                }
                                else {
                                    console.error(`Failed to save action ${index}`);                                                            
                                }
                            });
                        });                                            
    
                    } else {
                        console.log("Result set had no instructions");
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

    console.log(row);

    return {
        folderId: cellToString(row[0]),
        patient: cellToNumber(row[1]),
        drug: cellToString(row[2]),
        dose: cellToNumber(row[3]),
        doseUnits: cellToString(row[4]),
        frequency: cellToNumber(row[5]),
        frequencyUnits: cellToString(row[6]),
        startTime: cellToDate(row[7]),
        endTime: cellToDate(row[8]),
        administrationType: cellToString(row[9]),
        clinicalIndication: cellToString(row[10]),
        committed: cellToDistinctString(row[11])     
    }
}

function cellToNumber(c: any): number {
    if (typeof c == "number") {
        return c;
    }
    else if (typeof c == "string") {
        return +c;
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

function getAql(datestring: string): string {
return `
    select     
        tag(c, 'FolderId') as folder,
        tag(c, 'PatientId') as patient,
        i/activities[at0001]/description[at0002]/items[at0070]/value/value AS Drug,
        i/activities[at0001]/description[at0002]/items[openEHR-EHR-CLUSTER.dosage.v1]/items[at0144]/value/magnitude AS Dose,
        i/activities[at0001]/description[at0002]/items[openEHR-EHR-CLUSTER.dosage.v1]/items[at0144]/value/Units AS DoseUnits,
        i/activities[at0001]/description[at0002]/items[openEHR-EHR-CLUSTER.dosage.v1]/items[openEHR-EHR-CLUSTER.timing_daily.v1]/items[at0003]/value/magnitude AS Frequency,
        i/activities[at0001]/description[at0002]/items[openEHR-EHR-CLUSTER.dosage.v1]/items[openEHR-EHR-CLUSTER.timing_daily.v1]/items[at0003]/value/units AS FrequencyUnits,
        i/activities[at0001]/description[at0002]/items[at0113]/items[at0012]/value/value as StartDateTime,
        i/activities[at0001]/description[at0002]/items[at0113]/items[at0013]/value/value as EndDateTime,
        i/activities[at0001]/description[at0002]/items[at0091]/value/value as medicationAdministrationType,
        i/activities[at0001]/description[at0002]/items[at0018]/value/value as clinicalIndicationForMedication,
        v/commit_audit/time_committed/value as TimeCommited,
    from
        versioned_object vo
        -- [latest_version]
            contains version v 
                contains composition c
                    contains INSTRUCTION i[openEHR-EHR-INSTRUCTION.medication_order.v2]
    where    
        v/commit_audit/time_committed/value > '${datestring}'
    order by v/commit_audit/time_committed/value desc 
`;}