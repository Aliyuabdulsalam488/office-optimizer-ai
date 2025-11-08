import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import { Canvas as FabricCanvas } from "fabric";
import * as THREE from "three";

interface FloorPlan3DViewerProps {
  canvas: FabricCanvas | null;
}

const FloorPlan3DViewer = ({ canvas }: FloorPlan3DViewerProps) => {
  const generateMeshes = () => {
    if (!canvas) return [];

    const objects = canvas.getObjects();
    const meshes: JSX.Element[] = [];

    objects.forEach((obj, index) => {
      if (obj.type === "rect") {
        const width = (obj.width || 100) * (obj.scaleX || 1) / 50;
        const depth = (obj.height || 100) * (obj.scaleY || 1) / 50;
        const x = ((obj.left || 0) - 600) / 50;
        const z = ((obj.top || 0) - 400) / 50;

        meshes.push(
          <mesh key={`rect-${index}`} position={[x, 1.5, z]}>
            <boxGeometry args={[width, 3, depth]} />
            <meshStandardMaterial color="#3b82f6" opacity={0.6} transparent />
          </mesh>
        );
      } else if (obj.type === "circle") {
        const circleObj = obj as any;
        const radius = (circleObj.radius || 50) * (obj.scaleX || 1) / 50;
        const x = ((obj.left || 0) - 600) / 50;
        const z = ((obj.top || 0) - 400) / 50;

        meshes.push(
          <mesh key={`circle-${index}`} position={[x, 0.5, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[radius, radius, 1, 32]} />
            <meshStandardMaterial color="#22c55e" opacity={0.6} transparent />
          </mesh>
        );
      } else if (obj.type === "line") {
        const lineObj = obj as any;
        const points = [
          new THREE.Vector3(
            ((lineObj.x1 || 0) - 600) / 50,
            1.5,
            ((lineObj.y1 || 0) - 400) / 50
          ),
          new THREE.Vector3(
            ((lineObj.x2 || 0) - 600) / 50,
            1.5,
            ((lineObj.y2 || 0) - 400) / 50
          ),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        meshes.push(
          <line key={`line-${index}`}>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial attach="material" color="#1f2937" linewidth={2} />
          </line>
        );
      }
    });

    return meshes;
  };

  return (
    <div className="w-full h-[600px] bg-gradient-to-b from-blue-50 to-white rounded-lg overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />
        <OrbitControls enablePan enableZoom enableRotate />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} />
        
        <Grid
          args={[50, 50]}
          cellSize={1}
          cellColor="#6b7280"
          sectionSize={5}
          sectionColor="#3b82f6"
          fadeDistance={100}
          fadeStrength={1}
          position={[0, 0, 0]}
        />

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#f3f4f6" />
        </mesh>

        {generateMeshes()}
      </Canvas>
    </div>
  );
};

export default FloorPlan3DViewer;
