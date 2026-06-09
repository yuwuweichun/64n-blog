import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import BlogTunnelCard from "./BlogTunnelCard";
import styles from "./TimeTunnel.module.css";

const CAMERA_START_Z = 7;
const POST_SPACING_Z = -5;
const TUNNEL_RADIUS = 3.2;

function clampCameraZ(value, postCount) {
  const finalZ = CAMERA_START_Z + Math.max(postCount - 1, 0) * POST_SPACING_Z;
  return THREE.MathUtils.clamp(value, finalZ, CAMERA_START_Z);
}

function getPostPosition(index) {
  const angle = index * 0.72;

  return [
    Math.cos(angle) * TUNNEL_RADIUS,
    Math.sin(angle) * TUNNEL_RADIUS * 0.45,
    index * POST_SPACING_Z,
  ];
}

function CameraRig({ targetZ, postCount, onActiveChange }) {
  const { camera } = useThree();
  const activeIndexRef = useRef(0);

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    camera.lookAt(0, 0, camera.position.z - 12);

    const nextActiveIndex = THREE.MathUtils.clamp(
      Math.round((CAMERA_START_Z - camera.position.z) / Math.abs(POST_SPACING_Z)),
      0,
      Math.max(postCount - 1, 0)
    );

    if (activeIndexRef.current !== nextActiveIndex) {
      activeIndexRef.current = nextActiveIndex;
      onActiveChange(nextActiveIndex);
    }
  });

  return null;
}

function TunnelGrid({ postCount }) {
  const ringCount = Math.max(postCount + 6, 10);
  const finalZ = Math.min((postCount + 3) * POST_SPACING_Z, -36);

  const guideLines = useMemo(() => {
    return Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * Math.PI * 2;
      const x = Math.cos(angle) * TUNNEL_RADIUS;
      const y = Math.sin(angle) * TUNNEL_RADIUS * 0.45;

      return [
        [x, y, 2],
        [x, y, finalZ],
      ];
    });
  }, [finalZ]);

  return (
    <group>
      {Array.from({ length: ringCount }, (_, index) => (
        <mesh key={index} position={[0, 0, 2 + index * POST_SPACING_Z]}>
          <torusGeometry args={[TUNNEL_RADIUS, 0.01, 8, 96]} />
          <meshBasicMaterial
            color="#3e4451"
            opacity={index % 3 === 0 ? 0.34 : 0.18}
            transparent
          />
        </mesh>
      ))}
      {guideLines.map((points, index) => (
        <Line
          color="#3e4451"
          key={index}
          lineWidth={1}
          opacity={0.42}
          points={points}
          transparent
        />
      ))}
    </group>
  );
}

function PostNode({ active, index, onHover, onLeave, post }) {
  const groupRef = useRef(null);
  const glowRef = useRef(null);
  const position = useMemo(() => getPostPosition(index), [index]);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const targetScale = active ? 1.18 : 1;
    const nextScale = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      targetScale,
      0.12
    );

    groupRef.current.scale.setScalar(nextScale);

    if (glowRef.current) {
      glowRef.current.material.opacity = active ? 0.28 : 0.12;
      glowRef.current.rotation.z = clock.elapsedTime * 0.18;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <mesh
        onPointerOut={onLeave}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(index);
        }}
      >
        <sphereGeometry args={[0.14, 28, 28]} />
        <meshStandardMaterial
          color={active ? "#56b6c2" : "#61afef"}
          emissive={active ? "#56b6c2" : "#1b4f72"}
          emissiveIntensity={active ? 1.2 : 0.42}
          roughness={0.35}
        />
      </mesh>
      <mesh ref={glowRef}>
        <ringGeometry args={[0.28, 0.43, 48]} />
        <meshBasicMaterial
          color={active ? "#98c379" : "#61afef"}
          opacity={0.12}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <BlogTunnelCard
        active={active}
        onHover={() => onHover(index)}
        onLeave={onLeave}
        post={post}
      />
    </group>
  );
}

export default function BlogTunnelScene({ posts = [] }) {
  const [targetZ, setTargetZ] = useState(CAMERA_START_Z);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sceneFrameRef = useRef(null);

  const visibleActiveIndex = hoveredIndex ?? activeIndex;

  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setTargetZ((currentZ) =>
        clampCameraZ(currentZ - event.deltaY * 0.015, posts.length)
      );
    },
    [posts.length]
  );

  useEffect(() => {
    const sceneFrame = sceneFrameRef.current;

    if (!sceneFrame) {
      return undefined;
    }

    sceneFrame.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      sceneFrame.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  return (
    <div className={styles.tunnelRoot}>
      <div className={styles.sceneFrame} ref={sceneFrameRef}>
        <Canvas
          aria-hidden="true"
          camera={{
            far: 220,
            fov: 55,
            near: 0.1,
            position: [0, 0, CAMERA_START_Z],
          }}
          className={styles.canvas}
          dpr={[1, 1.75]}
        >
          <color args={["#282c34"]} attach="background" />
          <fog
            args={["#282c34", 16, Math.max(48, posts.length * 6)]}
            attach="fog"
          />
          <ambientLight intensity={0.52} />
          <pointLight color="#61afef" intensity={2.8} position={[0, 0, 5]} />
          <pointLight color="#98c379" intensity={1.2} position={[3, 2, -16]} />
          <TunnelGrid postCount={posts.length} />
          <CameraRig
            onActiveChange={setActiveIndex}
            postCount={posts.length}
            targetZ={targetZ}
          />
          {posts.map((post, index) => (
            <PostNode
              active={index === visibleActiveIndex}
              index={index}
              key={post.id}
              onHover={setHoveredIndex}
              onLeave={() => setHoveredIndex(null)}
              post={post}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
}
