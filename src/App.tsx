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

        // Carrega o mapa atual em memória para validar movimentos
        const gridMatrix = parseGrid(activeStage.floor);
        console.log("Grid Matrix:", gridMatrix);

        let currX = playerGridPos[0];
        let currZ = playerGridPos[1];
        let currRot = playerRotation;

        // Pega altura inicial correta
        let currH = getBlockHeight(currX, currZ, gridMatrix);
        // Se por acaso começar num buraco, assume 0
        if (currH === -1) currH = 0;
        console.log("currH:", currH);

        setCurrentBlockHeight(currH);

        for (let char of chars) {
            await wait(500);

            let nextX = currX;
            let nextZ = currZ;
            let nextRot = currRot;

            // --- CÁLCULO DA PRÓXIMA POSIÇÃO ---
            switch (char) {
                case "f": // Frente (1 passo)
                    if (currRot === 0) nextZ += 1; // 0 é Sul no seu Player original? Ajuste se necessário
                    if (currRot === 1) nextX += 1;
                    if (currRot === 2) nextZ -= 1;
                    if (currRot === 3) nextX -= 1;
                    break;
                case "p": // Pula (2 passos)
                    if (currRot === 0) nextZ += 1;
                    if (currRot === 1) nextX *= 1;
                    if (currRot === 2) nextZ -= 1;
                    if (currRot === 3) nextX -= 1;
                    break;
                case "t": // Trás
                    nextRot = (currRot + 2) % 4;
                    break;
                case "e": // Esquerda
                    nextRot = (currRot + 1) % 4;
                    break;
                case "d": // Direita
                    nextRot = (currRot + 3) % 4;
                    break;
                case "b": // Botão
                    console.log(`Ação no bloco [${currX}, ${currZ}]`);
                    // TODO lógica do botão
                    break;
            }

            // --- VALIDAÇÕES DE MOVIMENTO (Apenas se houve tentativa de mover) ---
            if (nextX !== currX || nextZ !== currZ) {
                const nextH = getBlockHeight(nextX, nextZ, gridMatrix);

                // 1. Verifica se saiu do mapa (nextH será -1)
                if (nextH === -1) {
                    console.log("Movimento bloqueado: Fora do mapa");
                    // Não atualiza X e Z, boneco fica parado
                }
                // 2. Verifica diferença de altura (não pode ser > 1)
                else if (Math.abs(nextH - currH) > 1) {
                    console.log(`Movimento bloqueado: Altura incompatível (${currH} -> ${nextH})`);
                    // Não atualiza X e Z
                } else {
                    // Movimento Válido!
                    currX = nextX;
                    currZ = nextZ;
                    currH = nextH; // Atualiza a altura atual
                }
            }

            // Atualiza rotação (sempre válida)
            currRot = nextRot;

            // Atualiza Estados Visuais
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
