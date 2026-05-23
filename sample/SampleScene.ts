"use strict";

import { Assets, Entity, CollisionType, LineOfSightMask, Model, GLTFModel } from "../src";


// note: v1 has the rocks where zuk should be - we could use that in the future
// export const SampleSceneModel = Assets.getAssetUrl("models/scene-v3.glb");
import SampleSceneModel from "../src/assets/scene.glb";

export class SampleScene extends Entity {
  get collisionType() {
    return CollisionType.NONE;
  }

  get size() {
    return 1;
  }

  draw() {
    // force empty draw
  }

  get color() {
    return "#222222";
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  getPerceivedRotation() {
    return -Math.PI / 2;
  }

  create3dModel(): Model {
    return new GLTFModel(this, [SampleSceneModel], { scale: 1, verticalOffset: -6.8, originOffset: {
      x: -6.5,
      y: 12.5,
    }});
  }
}
