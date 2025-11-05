import { Icosahedron } from "@react-three/drei";
import type { MapObjectProps } from "../App";

export default function Bush({ position }: MapObjectProps) {
    const radius = 0.4;
    return (
        <Icosahedron args={[radius, 0]} position={[position[0], radius, position[2]]} castShadow>
            <meshStandardMaterial color="#228B22" />
        </Icosahedron>
    );
}