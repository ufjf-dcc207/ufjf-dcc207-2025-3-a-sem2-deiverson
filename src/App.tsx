import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./App.css";
import Tree from "./elements/Tree";
import Car from "./elements/Car";
import Bush from "./elements/Bush";
import Button from "./elements/Button";
import Floor from "./elements/Floor";

export type MapObjectProps = {
    position: [number, number, number];
};

function MapObjects() {
    return (
        <group>
            <Tree position={[-3, 0, -3]} />
            <Tree position={[4, 0, 2]} />
            <Car position={[0, 0, -2]} />
            <Bush position={[-2, 0, 1]} />
            <Bush position={[-2.3, 0, 1.3]} />
            <Button position={[2, 0, 3]} />
        </group>
    );
}

function App() {
    return (
        <div id="canvas-container">
            <Canvas shadows camera={{ position: [8, 8, 8], fov: 60 }}>

                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[10, 15, 5]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-far={50}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}

                    shadow-bias={-0.0005}
                />
                <pointLight position={[-10, -5, -10]} intensity={0.2} />

                <Floor gridSize={20} wallHeight={0.5} />

                <MapObjects />

                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default App;
