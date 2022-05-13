import Action from "../models/Action";
import {ISmartEhrClient} from "./SmartEhrClient";
import { v4 as uuidv4 } from 'uuid';

export default class ActionRepository {

    smartEhrClient: ISmartEhrClient;

    constructor(smartEhrClient: ISmartEhrClient) {
        this.smartEhrClient = smartEhrClient;
    }
    
    async push(action: Action): Promise<boolean> {        
        const composition = this.getComposition(action);
        console.log("saving composition");
        var response = await this.smartEhrClient.SaveComposition(action, composition);
        console.log("saved composition");
        return response;
    }

    getComposition(action: Action): string {
        return `
        {
            "_type": "COMPOSITION",
            "archetype_node_id": "openEHR-EHR-COMPOSITION.encounter.v1",
            "name": {
              "value": "Klinisk kontakt"
            },
            "uid": {
              "_type": "OBJECT_VERSION_ID",
              "value": "${uuidv4()}::ehr_craft::1"
            },
            "archetype_details": {
              "archetype_id": {
                "value": "openEHR-EHR-COMPOSITION.encounter.v1"
              },
              "template_id": {
                "value": "Medication_administration_v2"
              },
              "rm_version": "1.0.4"
            },
            "language": {
              "terminology_id": {
                "value": "openehr"
              },
              "code_string": "nb"
            },
            "territory": {
              "terminology_id": {
                "value": "openehr"
              },
              "code_string": "NO"
            },
            "category": {
              "defining_code": {
                "terminology_id": {
                  "value": "openehr"
                },
                "code_string": "433"
              }
            },
            "composer": {
              "_type": "PARTY_IDENTIFIED",
              "name": "default"
            },
            "context": {
              "start_time": {
                "value": "${new Date().toISOString()}"
              },
              "end_time": {
                "value": "${new Date().toISOString()}"
              },
              
              "setting": {
                "value": "secondary medical care",
                "defining_code": {
                  "terminology_id": {
                    "value": "openehr"
                  },
                  "code_string": "232"
                }
              },
              "other_context": {
                "_type": "ITEM_TREE",
                "archetype_node_id": "at0001",
                "name": {
                  "value": "Tree"
                }
              }
            },
            "content": [
              {
                "_type": "ACTION",
                "archetype_node_id": "openEHR-EHR-ACTION.medication.v1",
                "name": {
                  "value": "Legemiddelhåndtering"
                },
                "archetype_details": {
                  "archetype_id": {
                    "value": "openEHR-EHR-ACTION.medication.v1"
                  },
                  "template_id": {
                    "value": "Medication_administration_v2"
                  },
                  "rm_version": "1.0.4"
                },
                "language": {
                  "terminology_id": {
                    "value": "ISO_639-1"
                  },
                  "code_string": "nb"
                },
                "encoding": {
                  "terminology_id": {
                    "value": "IANA"
                  },
                  "code_string": "UTF-8"
                },
                "subject": {
                  "_type": "PARTY_SELF"
                },
                "time": {
                  "value": "${action.planned.toISOString()}"
                },
                "description": {
                  "_type": "ITEM_TREE",
                  "archetype_node_id": "at0017",
                  "name": {
                    "value": "Tree"
                  },
                  "items": [
                    {
                      "_type": "ELEMENT",
                      "archetype_node_id": "at0020",
                      "name": {
                        "value": "Legemiddel"
                      },
                      "value": {
                        "_type": "DV_TEXT",
                        "value": "${action.drug}"
                      }
                    },
                    {
                      "_type": "CLUSTER",
                      "archetype_node_id": "openEHR-EHR-CLUSTER.dosage.v1",
                      "name": {
                        "value": "Dosering"
                      },
                      "archetype_details": {
                        "archetype_id": {
                          "value": "openEHR-EHR-CLUSTER.dosage.v1"
                        },
                        "template_id": {
                          "value": "Medication_administration_v2"
                        },
                        "rm_version": "1.0.4"
                      },
                      "items": [
                        {
                          "_type": "ELEMENT",
                          "archetype_node_id": "at0144",
                          "name": {
                            "value": "Dosemengde"
                          },
                          "value": {
                            "_type": "DV_QUANTITY",
                            "magnitude": ${action.dose},
                            "units": "${action.doseUnits}"
                          }
                        }
                      ]
                    },
                    {
                      "_type": "CLUSTER",
                      "archetype_node_id": "at0140",
                      "name": {
                        "value": "Administreringsdetaljer"
                      },
                      "items": [
                        {
                          "_type": "ELEMENT",
                          "archetype_node_id": "at0147",
                          "name": {
                            "value": "Administreringsvei"
                          },
                          "value": {
                            "_type": "DV_CODED_TEXT",
                            "value": "${action.administrationType}",
                            "defining_code": {
                              "terminology_id": {
                                "value": "SNOMED-CT"
                              },
                              "code_string": "26643006"
                            }
                          }
                        }
                      ]
                    },
                    {
                      "_type": "ELEMENT",
                      "archetype_node_id": "at0043",
                      "name": {
                        "value": "Opprinnelig planlagt tid"
                      },
                      "value": {
                        "_type": "DV_DATE_TIME",
                        "value": "${action.planned.toISOString()}"
                      }
                    },
                    {
                      "_type": "ELEMENT",
                      "archetype_node_id": "at0149",
                      "name": {
                        "value": "Dobbeltkontrollert?"
                      },
                      "value": {
                        "_type": "DV_BOOLEAN",
                        "value": ${action.doubleCheck}
                      }
                    }
                  ]
                },
                "ism_transition": {
                  "current_state": {
                    "value": "scheduled",
                    "defining_code": {
                      "terminology_id": {
                        "value": "openehr"
                      },
                      "code_string": "529"
                    }
                  },
                  "careflow_step": {
                    "value": "Legemiddel autorisert",
                    "defining_code": {
                      "terminology_id": {
                        "value": "local"
                      },
                      "code_string": "at0153"
                    }
                  }
                }
              }
            ]
          }

        `;
    }
}