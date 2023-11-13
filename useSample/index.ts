import { useCallback, useMemo } from "react";
import * as THREE from "three";
import { useMesh } from "./useMesh";
import { RootState, Size } from "@react-three/fiber";
import {
   useCamera,
   usePointer,
   useSingleFBO,
   setUniform,
   useParams,
} from "@/packages/use-shader-fx/src";
import { HooksReturn } from "@/packages/use-shader-fx/src/hooks/types";

export type SampleParams = {
   /** some comments */
   someValue: number;
};

export type SampleObject = {
   scene: THREE.Scene;
   material: THREE.Material;
   camera: THREE.Camera;
   renderTarget: THREE.WebGLRenderTarget;
};

export const SAMPLE_PARAMS: SampleParams = {
   someValue: 0.0,
};

export const useSample = ({
   size,
   dpr,
}: {
   size: Size;
   dpr: number;
}): HooksReturn<SampleParams, SampleObject> => {
   const scene = useMemo(() => new THREE.Scene(), []);
   const material = useMesh(scene);
   const camera = useCamera(size);
   const updatePointer = usePointer();
   const [renderTarget, updateRenderTarget] = useSingleFBO({
      scene,
      camera,
      size,
      dpr,
   });

   const [params, setParams] = useParams<SampleParams>(SAMPLE_PARAMS);

   const updateFx = useCallback(
      (props: RootState, updateParams?: SampleParams) => {
         const { gl, clock, pointer } = props;

         updateParams && setParams(updateParams);

         setUniform(material, "uSomeValue", params.someValue!);
         setUniform(material, "uTime", clock.getElapsedTime());

         const { velocity } = updatePointer(pointer);
         setUniform(
            material,
            "uVelocity",
            Math.min(1.0, velocity.length() * 500)
         );

         const outPutTexture = updateRenderTarget(gl);
         return outPutTexture;
      },
      [updateRenderTarget, material, setParams, params, updatePointer]
   );

   return [
      updateFx,
      setParams,
      {
         scene: scene,
         material: material,
         camera: camera,
         renderTarget: renderTarget,
      },
   ];
};
