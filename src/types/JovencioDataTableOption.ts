
export default interface JovencioDataTableOption {
    url: string,
    /**
     *  dataSrc was used to create a test environment during development. 
     *  Please return a dataset in the format expected by the datatable
     *  https://datatables.net/examples/server_side/return_search.html, 
     *  and there's no need for that closure to format the data.
     */
    dataSrc?(json:any):any,

    searchBuilder?: {
        enable: boolean,
        columns: number[],
    },

    classTable?: string
}