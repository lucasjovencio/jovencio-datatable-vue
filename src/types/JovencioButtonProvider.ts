import JovencioDataTableMeta from "./JovencioDataTableMeta";
import JovencioButtonGenerate from "./JovencioButtonGenerate";

export default interface JovencioButtonProvider {
    object: Object,
    meta: JovencioDataTableMeta,
    key: String,
    buttons: JovencioButtonGenerate[]
}