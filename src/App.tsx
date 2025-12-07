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
    const [activeButtons, setActiveButtons] = useState<string[]>([]);
    const [playerGridPos, setPlayerGridPos] = useState<[number, number]>(
        stagesList[0].playerPosition
    );

    const [currentBlockHeight, setCurrentBlockHeight] = useState(() => {
        const heightMatrix = parseGridToHeights(stagesList[0].floor);
        const [x, z] = stagesList[0].playerPosition;
        const h = getBlockHeight(x, z, heightMatrix);
        return h === -1 ? 0 : h;
    });

    const [playerRotation, setPlayerRotation] = useState<number>(0);
    const [commands, setCommands] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^[fedtpb]*$/i.test(val)) setCommands(val);
    };

    const executeCommands = async () => {
        if (isExecuting) return;
        setIsExecuting(true);

        const chars = commands.toLowerCase().split("");
        const heightMatrix = parseGridToHeights(activeStage.floor);

        let currX = playerGridPos[0];
        let currZ = playerGridPos[1];
        let currRot = playerRotation;
        let currH = currentBlockHeight;

        let currActiveButtons = [...activeButtons];

        for (let char of chars) {
            await wait(500);

            let targetX = currX;
            let targetZ = currZ;

            if (currRot === 0) targetZ += 1;
            else if (currRot === 1) targetX += 1;
            else if (currRot === 2) targetZ -= 1;
            else if (currRot === 3) targetX -= 1;

            const targetH = getBlockHeight(targetX, targetZ, heightMatrix);
            const isTargetValid = targetH !== -1;

            let nextX = currX;
            let nextZ = currZ;
            let nextH = currH;
            let nextRot = currRot;

            switch (char) {
                case "f":
                    if (isTargetValid) {
                        if (targetH === currH || targetH === currH - 1) {
                            nextX = targetX;
                            nextZ = targetZ;
                            nextH = targetH;
                        }
                    }
                    break;
                case "p":
                    if (isTargetValid) {
                        if (targetH === currH + 1) {
                            nextX = targetX;
                            nextZ = targetZ;
                            nextH = targetH;
                        }
                    } else if (targetH === currH) {
                        // Pula no lugar
                    }
                    break;
                case "t":
                    nextRot = (currRot + 2) % 4;
                    break;
                case "e":
                    nextRot = (currRot + 1) % 4;
                    break;
                case "d":
                    nextRot = (currRot + 3) % 4;
                    break;
                case "b":
                    const rawVal = getRawValue(currX, currZ, activeStage.floor);
                    const isButton = rawVal > 5 || rawVal === 0;

                    if (isButton) {
                        const key = `${currX}-${currZ}`;
                        if (currActiveButtons.includes(key)) {
                            currActiveButtons = currActiveButtons.filter((k) => k !== key);
                        } else {
                            currActiveButtons.push(key);
                        }
                        setActiveButtons([...currActiveButtons]);
                    }
                    break;
            }

            currX = nextX;
            currZ = nextZ;
            currRot = nextRot;
            currH = nextH;

            setPlayerGridPos([currX, currZ]);
            setPlayerRotation(currRot);
            setCurrentBlockHeight(currH);
        }
        setIsExecuting(false);
    };

    const handleChangeStage = (stage: Stage) => {
        setActiveStage(stage);
        setPlayerGridPos(stage.playerPosition);

        const heightMatrix = parseGridToHeights(stage.floor);
        const h = getBlockHeight(stage.playerPosition[0], stage.playerPosition[1], heightMatrix);
        setCurrentBlockHeight(h === -1 ? 0 : h);

        setPlayerRotation(0);
        setCommands("");
        setActiveButtons([]);
    };

    const mapRows = activeStage.floor.trim().split("\n");
    const mapDepth = mapRows.length;
    // Calcula a largura máxima do mapa
    const mapWidth = Math.max(...mapRows.map((r) => r.length));

    const visualPlayerX = playerGridPos[0] - mapWidth / 2 + 0.5;
    const visualPlayerZ = playerGridPos[1] - mapDepth / 2 + 0.5;

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

            <div className="controls-container">
                <div style={{ display: "flex", gap: 10 }}>
                    <input
                        type="text"
                        value={commands}
                        onChange={handleInputChange}
                        placeholder="Comandos: f, e, d, t, p, b"
                        disabled={isExecuting}
                        className="command-input"
                    />
                    <button
                        onClick={executeCommands}
                        disabled={isExecuting || commands.length === 0}
                        className={`exec-button ${isExecuting ? "disabled" : ""}`}
                    >
                        {isExecuting ? "..." : "Executar"}
                    </button>
                </div>
                <small style={{ color: "#aaa", fontSize: "0.8rem", marginTop: 5 }}>
                    f=frente, e=esq, d=dir, t=trás, p=pula, b=botão
                </small>
            </div>

            <div className="canvas-frame">
                <Canvas key={activeStage.id} shadows camera={{ position: [8, 8, 8], fov: 50 }}>
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[10, 15, 5]} intensity={1.5} castShadow />
                    <pointLight position={[-10, -5, -10]} intensity={0.2} />

                    <group position={[0, 0, 0]}>
                        <Floor grid={activeStage.floor} activeButtons={activeButtons} />

                        <Player
                            gridPosition={[visualPlayerX, visualPlayerZ]}
                            rotationIndex={playerRotation}
                            blockHeight={currentBlockHeight}
                        />
                    </group>
                    <OrbitControls />
                </Canvas>
            </div>
        </div>
    );
}

// _________________________ Functions__________________________ //
const parseGridToHeights = (gridString: string) => {
    return gridString
        .trim()
        .split("\n")
        .map((row) =>
            row.split("").map((char) => {
                if (char === " ") return 0;
                let val = parseInt(char);
                if (val > 5) val = val - 5;
                if (val === 0) val = 5;
                return val;
            })
        );
};

const getRawValue = (x: number, z: number, gridString: string) => {
    const rows = gridString.trim().split("\n");
    if (z < 0 || z >= rows.length) return -1;
    const row = rows[z].split("");
    if (x < 0 || x >= row.length) return -1;
    const char = row[x];
    if (char === " ") return 0;
    return parseInt(char);
};

const getBlockHeight = (x: number, z: number, heightMatrix: number[][]) => {
    if (z < 0 || z >= heightMatrix.length) return -1;
    if (x < 0 || x >= heightMatrix[z].length) return -1;
    return heightMatrix[z][x];
};
