export class QSO {
    constructor(public dateTime: Date,
                public callsign: string,
                public frequency: string,
                public mode: string,
                public rstSent: string,
                public rstReceived?: string,
                public power?: number,
                public name?: string,
                public qth?: string,
                public notes?: string,
                public id?: number) {
    }
}
