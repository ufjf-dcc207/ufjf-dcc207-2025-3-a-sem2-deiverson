import Braco from "./Braco";
import Cabeca from "./Cabeca";
import Perna from "./Perna";
import Torso from "./Torso";

type PlayerProps = {
    scale?: number;
    gridPosition: [number, number];
    rotationIndex: number;
    blockHeight?: number;
};

export default function Player({
    scale = 0.5,
    gridPosition,
    rotationIndex,
    blockHeight = 0,
}: PlayerProps) {
    // Posição do Grid
    const worldX = gridPosition[0];
    const worldZ = gridPosition[1];
    const worldY = (blockHeight - 1) * 0.5;

    // Converte o índice (0-3) para radianos (0, 90, 180, 270 graus)
    const rotationY = rotationIndex * (Math.PI / 2);

    return (
        <group
            // Aplica a posição e rotação"
            position={[worldX, worldY, worldZ]}
            rotation={[0, rotationY, 0]}
            scale={scale}
        >
            <group position={[0, 2.5, 0]}>
                {/* Cabeça */}
                <Cabeca position={[0, 0.85, 0]} />
                {/* Torso */}
                <Torso position={[0, 0, 0]} />

                {/* Braço esquerdo */}
                <Braco position={[-0.5, 0.35, 0]} />

                {/* Braço direito */}
                <Braco position={[0.5, 0.35, 0]} />

                {/* Pernas */}
                <Perna position={[-0.18, -0.6, 0]} />
                <Perna position={[0.18, -0.6, 0]} />
            </group>
        </group>
    );
}
