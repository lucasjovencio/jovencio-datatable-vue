export default interface JovencioActionClousure {
    'selector': string,
    clousure(self:any): void,
    'lock': boolean,
    'timeout': any,
    'enable': boolean
}