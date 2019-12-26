export class QSO {
    constructor(public date: Date,
                public time: Date,
                public callsign: string,
                public frequency: string,
                public mode: string,
                public rstSent: string,
                public rstReceived?: string,
                public id?: number,
                public power?: number,
                public name?: string,
                public qth?: string,
                public notes?: string) {
    }
}
