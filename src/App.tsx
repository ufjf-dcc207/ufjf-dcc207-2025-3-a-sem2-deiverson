import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Floor from "./elements/Floor";
import "./App.css";

type Stage = {
    floor: string;
    playerPosition: [number, number];
    position?: [number, number, number];
};

const stageOne: Stage = {
    floor: `1
2 716
8 1 2
4 1 1
0 4 7
448 2
`,
    playerPosition: [0, 2],
    position: [0, 0, 0],
};
const stageTwo: Stage = {
    floor: `1111
1221
1282
1626
`,
    playerPosition: [1, 1],
    position: [-10, 0, 10],
};

const stageThree: Stage = {
    floor: `11111
17771
17371
17771
11111
`,
    playerPosition: [2, 2],
    position: [-20, 0, 20],
};

export default function App() {
    return (
        <div id="canvas-container">
            <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <directionalLight position={[10, 15, 5]} intensity={1.5} castShadow />
                <pointLight position={[-10, -5, -10]} intensity={0.2} />

                <group position={stageOne.position}>
                    <Floor grid={stageOne.floor} playerPosition={stageOne.playerPosition} />
                </group>
                <group position={stageTwo.position}>
                    <Floor grid={stageTwo.floor} playerPosition={stageTwo.playerPosition} />
                </group>{" "}
                <group position={stageThree.position}>
                    <Floor grid={stageThree.floor} playerPosition={stageThree.playerPosition} />
                </group>

                <OrbitControls />
            </Canvas>
        </div>
    );
}
