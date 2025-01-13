export type MaskType = string | string[] | ((input: string) => string) | null

interface MaskNumber {
    locale?: string
    fraction?: number
    unsigned?: boolean
}

interface MaskToken {
    pattern: RegExp
    multiple?: boolean
    optional?: boolean
    repeated?: boolean
    transform?: (char: string) => string
}

interface MaskGroup {
    mask?: {
        mask?: MaskType
        tokens?: MaskToken,
        tokensReplace?: boolean
        eager?: boolean
        reversed?: boolean
        number?: MaskNumber
    },
    tokens?: MaskToken,
    number?: string | string[] | MaskNumber | null,
    preProcess?: string | ((input: string) => string),
    postProcess?: string | ((input: string) => string),
}

interface MaskaDatatableI18n {
    i18n?: {
        'pt-BR': MaskGroup;
        'en': MaskGroup;
    };
}

type MaskaDatatable = MaskaDatatableI18n | MaskGroup;

export default MaskaDatatable;