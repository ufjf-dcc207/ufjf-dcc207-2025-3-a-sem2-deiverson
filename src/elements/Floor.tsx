import Tile from "./Tile";

export default function Floor({
    grid,
    playerPosition,
}: {
    grid: string;
    playerPosition?: [number, number];
}) {
    return grid.split("\n").map((line, z) =>
        line.split("").map((heigth, x) => {
            const player = playerPosition && x === playerPosition[0] && z === playerPosition[1];
            if (heigth) {
                return (
                    <Tile
                        key={`tile-${x}-${z}`}
                        position={[x, 0, z]}
                        heigth={heigth}
                        steped={player}
                    />
                );
            }
            return null;
        })
    );
}
