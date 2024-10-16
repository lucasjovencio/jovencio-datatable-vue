interface JovencioButtonGenerateBase {
    enable: boolean,
    name: string,
    show_name?: boolean,
    order: number,
    html_icon?:string,
    svg?: string,
}

interface JovencioButtonBlockGenerate extends JovencioButtonGenerateBase {
    key: 'block';
    svg_secondary?: string,
    custom_element?: string,
    class_id?: string;
    class?: string,
}

type AllowedKeys = 'edit' | 'delete';
interface JovencioButtonRegularGenerate extends JovencioButtonGenerateBase {
    key: AllowedKeys,
    class_id?: string;
    custom_element?: string,
    class?: string,
}

interface JovencioButtonCustomGenerate extends JovencioButtonGenerateBase {
    class_id: string;
    custom_element: string,
    key: string,
    svg_secondary?: string,
    class: string,
}

type JovencioButtonGenerate = JovencioButtonBlockGenerate | JovencioButtonCustomGenerate | JovencioButtonRegularGenerate;

export default JovencioButtonGenerate;