import JovencioDataTableMeta from "./JovencioDataTableMeta";

export default interface JovencioDataTableColumn {
    id: string,
    name: string,
    orderable: boolean,
    searchable: boolean,
    type?: string,
    class?: string,
    colspan?: Number,
    rowspan?: Number,
    render?(data: any, type: string, row: any, meta: JovencioDataTableMeta): void,
    triggers?(self:any): void
}