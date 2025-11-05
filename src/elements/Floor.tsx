import { Box } from "@react-three/drei";

export default function Floor({
    gridSize = 10,
    gridHalfSize = gridSize / 2,
    cubeSize = 1,
    wallHeight = 2.5,
    wallThickness = 0.2,
}: {
    gridSize: number;
    gridHalfSize?: number;
    cubeSize?: number;
    wallHeight?: number;
    wallThickness?: number;
}) {
    const cubes = () => {
        const tempCubes = [];
        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                const posX = (x - gridHalfSize) * cubeSize + cubeSize / 2;
                const posZ = (z - gridHalfSize) * cubeSize + cubeSize / 2;
                const posY = -0.5 + (Math.random() - 0.5) * 0.1;

                tempCubes.push(
                    <Box
                        key={`floor-${x}-${z}`}
                        args={[cubeSize, 1, cubeSize]}
                        position={[posX, posY, posZ]}
                        receiveShadow
                    >
                        <meshStandardMaterial color="#666" />
                    </Box>
                );
            }
        }
        return tempCubes;
    };

    const walls = () => {
        const mapSize = gridSize * cubeSize;
        const wallYPos = wallHeight / 2;
        const wallEdge = mapSize / 2;

        const halfThickness = wallThickness / 2;

        return (
            <group>
                {/* Muro Traseiro (no Z negativo) */}
                <Box
                    key="wall-back"
                    args={[mapSize + wallThickness, wallHeight, wallThickness]}
                    // Posição Z corrigida
                    position={[0, wallYPos, -wallEdge - halfThickness]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial color="#888" />
                </Box>

                {/* Muro Frontal (no Z positivo) */}
                <Box
                    key="wall-front"
                    args={[mapSize + wallThickness, wallHeight, wallThickness]}
                    // Posição Z corrigida
                    position={[0, wallYPos, wallEdge + halfThickness]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial color="#888" />
                </Box>

                {/* Muro Esquerdo (no X negativo) */}
                <Box
                    key="wall-left"
                    args={[wallThickness, wallHeight, mapSize]}
                    // Posição X corrigida
                    position={[-wallEdge - halfThickness, wallYPos, 0]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial color="#888" />
                </Box>

                {/* Muro Direito (no X positivo) */}
                <Box
                    key="wall-right"
                    args={[wallThickness, wallHeight, mapSize]}
                    // Posição X corrigida
                    position={[wallEdge + halfThickness, wallYPos, 0]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial color="#888" />
                </Box>
            </group>
        );
    };

    return (
        <group position={[0, 0, 0]}>
            {cubes()}
            {walls()}
        </group>
    );
}