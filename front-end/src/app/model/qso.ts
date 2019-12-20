export class QSO {
    constructor(public id: number,
                public date: Date,
                public time: Date,
                public callsign: string,
                public frequency: string,
                public mode: string,
                public name: string,

                public qth?: string,
                public power?: number,
                public rstSent?: number,
                public rstReceived?: number,
                public notes?: string) {
    }
}
