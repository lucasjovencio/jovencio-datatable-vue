import JovencioClousure from "./JovencioClousure";
import JovencioDataTableMeta from "./JovencioDataTableMeta";
import MaskaDatatable from "./MaskaDatatable";
type Types = 'string' | 'num' | 'moment';

export default interface JovencioDataTableColumn {
    id: string,
    name: string | (() => string),
    orderable: boolean,
    searchable: boolean,
    mask: MaskaDatatable,
    type?: Types,
    class?: string,
    colspan?: Number,
    rowspan?: Number,
    render?(data: any, type: string, row: any, meta: JovencioDataTableMeta): void,
    triggers?(addClousure:JovencioClousure): void
}