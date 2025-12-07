import { RoundedBox } from "@react-three/drei";
import type { TileProps } from "./Types";

export default function Tile({ position, heigth, steped = false }: TileProps) {
    const tiles = [];
    let heightInt = parseInt(heigth);
    const button = heightInt > 5 || heightInt === 0;

    if (button) heightInt = heightInt === 0 ? 5 : heightInt - 5;

    for (let i = 0; i < heightInt; i++) {
        const isTopBox = i === heightInt - 1;

        tiles.push(
            <RoundedBox
                key={i}
                position={[position[0], position[1] + i * 0.5, position[2]]}
                args={[1, 0.5, 1]}
                radius={0.03}
                smoothness={1}
                receiveShadow
                castShadow
            >
                {isTopBox && steped ? (
                    button ? (
                        <meshStandardMaterial
                            color="hsla(211, 61%, 59%, 1.00)"
                            emissive={"yellow"}
                            emissiveIntensity={0.75}
                        />
                    ) : (
                        <meshStandardMaterial
                            color="hsla(211, 61%, 59%, 1.00)"
                            emissive={"hsla(211, 61%, 39%, 1.00)"}
                            emissiveIntensity={0.75}
                        />
                    )
                ) : (
                    <meshStandardMaterial
                        color={
                            isTopBox && button
                                ? "hsla(211, 61%, 39%, 1.00)"
                                : "hsla(211, 61%, 59%, 1.00)"
                        }
                    />
                )}
            </RoundedBox>
        );
    }
    if (steped)
        tiles.push(
            <group position={[position[0], (heightInt - 1) * 0.5, position[2]]}>
                {/* <Player /> */}
            </group>
        );

    return <group>{tiles}</group>;
}
