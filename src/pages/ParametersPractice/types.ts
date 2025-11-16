export interface Range {
    min: number | string;
    max: number | string;
}

export interface Parameter {
    name: string;
    healthyRange: Range;
    unhealthyRange: Range;
}
