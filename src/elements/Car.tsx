import { Box } from "@react-three/drei";
import type { MapObjectProps } from "../App";

export default function Car({ position }: MapObjectProps) {
    const bodyHeight = 0.4;
    const cabinHeight = 0.3;
    return (
        <group position={position}>
            <Box args={[1, bodyHeight, 0.5]} position={[0, bodyHeight / 2, 0]} castShadow>
                <meshStandardMaterial color="#A0A0A0" />
            </Box>
            <Box args={[0.6, cabinHeight, 0.4]} position={[0.1, bodyHeight + cabinHeight / 2, 0]} castShadow>
                <meshStandardMaterial color="#B0C4DE" />
            </Box>
        </group>
    );
}