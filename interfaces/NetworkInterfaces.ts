export interface Cortex {
    id: number | undefined,
    name: string,
    links: Link[] | undefined
}

export interface Network {
    id: number | undefined,
    name: string,
    layers: Layer[]
}

export interface Link {
    id: number | undefined,
    from_network: Network,
    to_network: Network
}

export interface DBNetwork {
    id: number | undefined,
    name: string,
    layers: number[]
}

export interface Layer {
    id: number,
    name: string,
    type: LayerType,
    options: {
        option: LayerOption,
        optionValue: string|number|undefined 
    }[]
}

export interface DBLayer {
    id: number,
    name: string,
    type: number,
    options: number[]
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