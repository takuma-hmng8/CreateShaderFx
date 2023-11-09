import { useRef } from "react";
import * as THREE from "three";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { usePerformanceMonitor } from "@react-three/drei";
import { FxMaterial, TFxMaterial } from "./fxMaterial";
import { CONFIG } from "./config";
import { useSample } from "./useSample";

// dreiのshaderMaterialを使うことで、key={FxMaterial.key}を有効にすることができ、hotReloadが使えます。
extend({ FxMaterial });

export const CreateKit = () => {
   const fxRef = useRef<TFxMaterial>();

   const size = useThree((state) => state.size);
   const dpr = useThree((state) => state.viewport.dpr);

   const [updateSample, setSample, sampleObj] = useSample({ size, dpr });

   // factorに応じたパフォーマンスコントロールを考慮して、setParams関数は作成してください。
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
