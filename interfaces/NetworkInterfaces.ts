export interface Cortex {
    id: number | undefined,
    name: string,
}

export interface Network {
    id: number | undefined,
    name: string,
    x: number,
    y: number,
    layers: Layer[],
    cortex: number
}

export interface Link {
    id: number | undefined,
    from_network: number,
    to_network: number,
    cortex: number
}

export interface DBNetwork {
    id: number | undefined,
    hdf5: string | undefined | null,
    name: string
}

export interface Layer {
    id: number,
    name: string,
    type: LayerType,
    position: number | null | undefined,
    options: {
        option: LayerOption,
        optionValue: string|number|undefined 
    }[]
}

export interface DBLayer {
    id: number,
    name: string,
    position: number,
    type: number,
    neural_network: number
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

export interface DBOption {
    id: number,
    option: number,
    option_value: string,
    layer: number
}