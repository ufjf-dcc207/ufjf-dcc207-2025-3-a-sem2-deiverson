import Braco from "./Braco";
import Cabeca from "./Cabeca";
import Perna from "./Perna";
import Torso from "./Torso";

export default function Player({ scale = 0.5 }: { scale?: number }) {
    return (
        <group scale={scale}>
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
