import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Floor from "./elements/Floor";
import Player from "./elements/player/Player";
import { stagesList } from "./elements/Stages";
import type { Stage } from "./elements/Types";
import "./App.css";

export default function App() {
    // Estado da fase ativa
    const [activeStage, setActiveStage] = useState<Stage>(stagesList[0]);

    // Estado da posição atual do jogador
    const [playerGridPos, setPlayerGridPos] = useState<[number, number]>(
        stagesList[0].playerPosition
    );

    const [currentBlockHeight, setCurrentBlockHeight] = useState(() => {
        const initialStage = stagesList[0];
        const grid = parseGrid(initialStage.floor);
        const [startX, startZ] = initialStage.playerPosition;

        // Busca a altura na matriz
        const h = getBlockHeight(startX, startZ, grid);

        // Retorna a altura (ou 0 se der erro)
        return h === -1 ? 0 : h;
    });

    const [playerRotation, setPlayerRotation] = useState<number>(0);
    const [commands, setCommands] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Regex: Aceita apenas os caracteres permitidos (case insensitive)
        if (/^[fedtpb]*$/i.test(val)) {
            setCommands(val);
        }
    };

    const executeCommands = async () => {
        if (isExecuting) return;
        setIsExecuting(true);

        const chars = commands.toLowerCase().split("");
        const gridMatrix = parseGrid(activeStage.floor);

        let currX = playerGridPos[0];
        let currZ = playerGridPos[1];
        let currRot = playerRotation;
        let currH = currentBlockHeight;

        for (let char of chars) {
            await wait(500);

            // Calcula qual é o bloco à frente do jogador
            let targetX = currX;
            let targetZ = currZ;

            if (currRot === 0) targetZ += 1;
            else if (currRot === 1) targetX += 1;
            else if (currRot === 2) targetZ -= 1;
            else if (currRot === 3) targetX -= 1;

            //  Pega a altura do alvo
            const targetH = getBlockHeight(targetX, targetZ, gridMatrix);
            const isTargetValid = targetH !== -1; // Verifica se está dentro do mapa

            // Variáveis para o próximo estado (inicialmente mantêm o atual)
            let nextX = currX;
            let nextZ = currZ;
            let nextH = currH;
            let nextRot = currRot;

            switch (char) {
                case "f": // FRENTE
                    // Regra: Só move se for mesma altura ou 1 abaixo
                    if (isTargetValid) {
                        if (targetH === currH || targetH === currH - 1) {
                            nextX = targetX;
                            nextZ = targetZ;
                            nextH = targetH;
                        } else {
                            console.log(`Bloqueado 'f': Altura alvo ${targetH} vs Atual ${currH}`);
                        }
                    } else {
                        console.log("Bloqueado 'f': Fim do mapa");
                    }
                    break;

                case "p": // PULO
                    if (isTargetValid) {
                        // Regra: Sobe 1 nível
                        if (targetH === currH + 1) {
                            nextX = targetX;
                            nextZ = targetZ;
                            nextH = targetH;
                        }
                        // Regra: Mesma altura -> Pula no lugar não se move
                        else if (targetH === currH) {
                            console.log("Pulo no lugar (mesma altura)");
                        }
                        // Qualquer outra diferença (muito alto, ou descendo) não faz nada
                        else {
                            console.log(`Bloqueado 'p': Altura inválida para pulo`);
                        }
                    }
                    break;

                // ROTAÇÕES (Sem verificação de colisão)
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
                    console.log(`Botão pressionado em [${currX}, ${currZ}]`);
                    break;
            }

            // Atualiza as variáveis locais para o próximo passo do loop
            currX = nextX;
            currZ = nextZ;
            currRot = nextRot;
            currH = nextH;

            // Atualiza os estados
            setPlayerGridPos([currX, currZ]);
            setPlayerRotation(currRot);
            setCurrentBlockHeight(currH);
        }

        setIsExecuting(false);
    };

    const handleChangeStage = (stage: Stage) => {
        setActiveStage(stage);
        setPlayerGridPos(stage.playerPosition);

        // Reseta altura inicial
        const grid = parseGrid(stage.floor);
        const h = getBlockHeight(stage.playerPosition[0], stage.playerPosition[1], grid);
        setCurrentBlockHeight(h === -1 ? 0 : h);

        setPlayerRotation(2);
        setCommands("");
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
                    f = frente, e = esq, d = dir, t = trás, p = pula, b = botão
                </small>
            </div>

            <div className="canvas-frame">
                <Canvas key={activeStage.id} shadows camera={{ position: [8, 8, 8], fov: 50 }}>
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[10, 15, 5]} intensity={1.5} castShadow />
                    <pointLight position={[-10, -5, -10]} intensity={0.2} />

                    <group position={[0, 0, 0]}>
                        <Floor grid={activeStage.floor} />
                        <Player
                            gridPosition={playerGridPos}
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

// ______________________________ Functions ______________________________ //

// Transforma a string do mapa em uma matriz de números para ajudar no controle da altura do player
const parseGrid = (gridString: string) => {
    return gridString
        .trim()
        .split("\n")
        .map((row) =>
            row.split("").map((char) => {
                if (char === " ") return 0;
                let value: number = parseInt(char);
                const button: boolean = value > 5 || value === 0;

                if (button) value = value === 0 ? 5 : value - 5;

                return value;
            })
        );
};

// Pega a altura de um bloco específico (retorna -1 se fora do mapa)
const getBlockHeight = (x: number, z: number, gridMatrix: number[][]) => {
    if (z < 0 || z >= gridMatrix.length) return -1; // Fora das linhas (Z)
    if (x < 0 || x >= gridMatrix[z].length) return -1; // Fora das colunas (X)
    return gridMatrix[z][x];
};
