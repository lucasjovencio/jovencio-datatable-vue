import JovencioActionClousure from "./JovencioActionClousure";

export default interface JovencioClousure {
    (data: JovencioActionClousure[]): void;
}