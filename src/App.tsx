import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Floor from "./elements/Floor";

import Player from "./elements/player/Player";

import { stagesList } from "./elements/Stages";
import type { Stage } from "./elements/Types";
import "./App.css";

export default function App() {
    const [activeStage, setActiveStage] = useState<Stage>(stagesList[0]);

    const [playerGridPos, setPlayerGridPos] = useState<[number, number]>(
        stagesList[0].playerPosition
    );

    const [playerRotation, setPlayerRotation] = useState<number>(2);

    const handleChangeStage = (stage: Stage) => {
        setActiveStage(stage);
        setPlayerGridPos(stage.playerPosition);
        setPlayerRotation(2);
    };

    return (
        <div className="main-container">
            <div className="menu-container">
                <h2>Selecione a Fase</h2>
                <div className="button-group">
                    {stagesList.map((stage) => (
                        <button
                            key={stage.id}
                            className={activeStage.id === stage.id ? "active" : ""}
                            onClick={() => handleChangeStage(stage)}
                        >
                            {stage.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="canvas-frame">
                <Canvas key={activeStage.id} shadows camera={{ position: [8, 8, 8], fov: 50 }}>
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[10, 15, 5]} intensity={1.5} castShadow />
                    <pointLight position={[-10, -5, -10]} intensity={0.2} />

                    <group position={[0, 0, 0]}>
                        <Floor grid={activeStage.floor} />
                        <Player gridPosition={playerGridPos} rotationIndex={playerRotation} />
                    </group>

                    <OrbitControls />
                </Canvas>
            </div>
        </div>
    );
}
