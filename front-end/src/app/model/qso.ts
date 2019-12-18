export class QSO {
    constructor(public id: number,
                public callsign: string,
                public date: Date,
                public time: Date,
                public frequency: string,
                public mode: string,
                public rst: string,
                public notes: string) {
    }
}
