import { useMemo } from "react";
import * as THREE from "three";
import vertexShader from "./shader/main.vert";
import fragmentShader from "./shader/main.frag";

import { useAddMesh } from "@hmng8/use-shader-fx";

export class SampleMaterial extends THREE.ShaderMaterial {
   uniforms!: {
      uTime: { value: number };
      uVelocity: { value: number };
      uSomeValue: { value: number };
   };
}

export const useMesh = (scene: THREE.Scene) => {
   const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
   const material = useMemo(
      () =>
         new THREE.ShaderMaterial({
            uniforms: {
               uTime: { value: 0.0 },
               uVelocity: { value: 0.0 },
               uSomeValue: { value: 0.0 },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
         }),
      []
   );
   useAddMesh(scene, geometry, material);
   return material as SampleMaterial;
};
