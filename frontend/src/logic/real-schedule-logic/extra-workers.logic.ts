import {SectionLogic} from "./section-logic.model";
import {DataRow} from "./data-row";

export class ExtraWorkersLogic implements SectionLogic {
    private extraWorkersInfoAsDataRows: { [key: string]: DataRow } = {};

    constructor(private extraWorkersData: { [key: string]: number[] }) {
        Object.keys(extraWorkersData).forEach((key) => {
            this.extraWorkersInfoAsDataRows[key] = new DataRow(key, extraWorkersData[key]);
        });
    }

    public get data() {
        return Object.values(this.extraWorkersInfoAsDataRows);
    }

    public get sectionData() {
        return this.data;
    }
c
    public get extraWorkers() {
        return this.extraWorkersInfoAsDataRows["liczba dodatkowych pracowników"]
            .rowData(true, false)
            .map((i) => parseInt(i));
    }

    public tryUpdate(row: DataRow) {
        if (Object.keys(this.extraWorkersInfoAsDataRows).includes(row.rowKey)) {
            this.extraWorkersInfoAsDataRows[row.rowKey] = row;
            return true;
        }
        return false;
    }
}