export type MapObjectProps = {
    position: [number, number, number];
};

export type TileProps = {
    height: number;
    position: [number, number, number];
    isButton?: boolean; 
    isActive?: boolean; 
};

export type FloorProps = {
    grid: string;
    personaPosition?: [number, number];
};

export type Stage = {
    id: number;
    name: string;
    floor: string;
    playerPosition: [number, number];
};
