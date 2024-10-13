import JovencioProviderClousure from "./JovencioProviderClousure";

export default interface JovencioClousure {
    (provider: JovencioProviderClousure): void;
}   