export default interface JovencioActionClousure {
    'selector': string,
    clousure(self:any): void,
    'lock': string,
    'timeout': any,
    'enable': boolean
}