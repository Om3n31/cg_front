export interface Network {
    id: number | undefined,
    name: string,
    layers: Layer[]
}

export interface DBNetwork {
    id: number | undefined,
    name: string,
    layers: number[]
}

export interface Layer {
    name: string,
    type: LayerType,
    options: {
        option: LayerOption,
        optionValue: string|number|undefined 
    }[]
}

export interface LayerType {
    id: number,
    name: string,
    options: number[]
}

export interface LayerOption {
    id: number,
    name: string,
    possible_values: string[],
    type: string
}