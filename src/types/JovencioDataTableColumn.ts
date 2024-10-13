import JovencioClousure from "./JovencioClousure";
import JovencioDataTableMeta from "./JovencioDataTableMeta";
type Types = 'string' | 'num' | 'moment' | 'date';

export default interface JovencioDataTableColumn {
    id: string,
    name: string,
    orderable: boolean,
    searchable: boolean,
    type?: Types,
    class?: string,
    colspan?: Number,
    rowspan?: Number,
    render?(data: any, type: string, row: any, meta: JovencioDataTableMeta): void,
    triggers?(addClousure:JovencioClousure): void
}