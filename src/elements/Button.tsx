import { Cylinder } from "@react-three/drei";
import type { MapObjectProps } from "../App";

export default function Button({ position }: MapObjectProps) {
    const height = 0.1;
    return (
        <Cylinder args={[0.3, 0.3, height, 32]} position={[position[0], height / 2, position[2]]} castShadow>
            <meshStandardMaterial color="red" />
        </Cylinder>
    );
}