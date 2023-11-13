import * as THREE from "three";
import { useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { usePerformanceMonitor } from "@react-three/drei";
import { FxMaterial, TFxMaterial } from "./fxMaterial";
import { useSample } from "./useSample";

// By using drei's shaderMaterial, you can enable key={FxMaterial.key} and use hotReload.
extend({ FxMaterial });

const CONFIG = {
   sampleFx: {
      someValue: 0.0,
   },
};

const CreateShaderFx = () => {
   const fxRef = useRef<TFxMaterial>();

   const size = useThree((state) => state.size);
   const dpr = useThree((state) => state.viewport.dpr);

   const [updateSample, setSample, sampleObj] = useSample({ size, dpr });

   // Please create the setParams function considering performance control according to the factor.
   usePerformanceMonitor({
      onChange({ factor }) {
         setSample({ someValue: factor });
      },
   });

   useFrame((props) => {
      const fx = updateSample(props, { someValue: CONFIG.sampleFx.someValue });
      fxRef.current!.u_fx = fx;
   });

   return (
      <mesh>
         <planeGeometry args={[2, 2]} />
         <fxMaterial key={FxMaterial.key} ref={fxRef} />
      </mesh>
   );
};

export default CreateShaderFx;
