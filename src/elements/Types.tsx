export type MapObjectProps = {
    position: [number, number, number];
};

export type TileProps = {
    heigth: string;
    position: [number, number, number];
    steped?: boolean;
};

export type FloorProps = {
    grid: string;
    personaPosition?: [number, number];
};
