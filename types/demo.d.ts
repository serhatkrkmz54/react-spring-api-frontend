/* FullCalendar Types */
import { EventApi, EventInput } from '@fullcalendar/core';

/* Chart.js Types */
import { ChartData, ChartOptions } from 'chart.js';

declare namespace Demo {

    interface Futbolcu {
        id: number;
        pName: string;
        pSurname: string;
        filePath: string; 
        formaNo: number;
        pValue: number;
        pCountry: string;
        pWeight: number;
        pHeight: number;
        pPosition: string;
        pPlayerAge: number;
        yas: number;
        pFoot: string; 
        toTeams: Takim[];
        toCountry: Ulkeler[];
        transferFee: number;
        transferDate: string;
        toTeam: Takim[];
        fromTeam: Takim[];
     }

    type Futbolcu = {
        id?: number;
        pName?: string;
        pSurname?: string;
        filePath?: string; 
        formaNo?: number;
        pValue?: number;
        pCountry?: string;
        pWeight?: number;
        pHeight?: number;
        pPosition?: string;
        pPlayerAge?: number;
        yas?: number;
        pFoot?: string; 
        toTeams?: Takim[];
        toCountry?: Ulkeler[];
    }

     interface Takim {
        id: number;
        tName: string;
        filePath: string;
        tValue: number;
        deger: number;
        resim:string;
    }

    interface Ulkeler {
        id: number;
        cName: string;
    }

    interface Ayak {
        name: string;
        code: string;
    }
    
    interface Mevki {
        name: string;
        code: string;
    }

    interface DialogConfig {
        visible: boolean;
        header: string;
        newTask: boolean;
    }
}