import ColumnDataTableMeta from "./ColumnDataTableMeta";

export default interface ColumnDataTable {
    id: string,
    name: string,
    orderable: boolean,
    searchable: boolean,
    type?: string,
    class?: string,
    colspan?: Number,
    rowspan?: Number,
    render?(data: any, type: string, row: object, meta: ColumnDataTableMeta): void,
    triggers?(self:any): void
}