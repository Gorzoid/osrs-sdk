"use strict";

import { Assets, Entity, CollisionType, LineOfSightMask, Model, GLTFModel, Location, Settings } from "../src";

export class InvisWall extends Entity {
  get collisionType() {
    return CollisionType.BLOCK_MOVEMENT;
  }

  get size() {
    return 1;
  }

  //   override drawUILayer(
  //     tickPercent: number,
  //     screenPosition: Location,
  //     context: OffscreenCanvasRenderingContext2D,
  //     scale: number,
  //     hitsplatAbove = true,
  //   ) {
  //     context.fillStyle = "#000073";
  //     context.fillRect(
  //       this.location.x * Settings.tileSize,
  //       (this.location.y - this.size + 1) * Settings.tileSize,
  //       this.size * Settings.tileSize,
  //       this.size * Settings.tileSize,
  //     );
  //   }

  override draw(tickPercent: number, context: OffscreenCanvasRenderingContext2D) {
    context.fillStyle = "#000073";
    context.fillRect(
      this.location.x * Settings.tileSize,
      (this.location.y - this.size + 1) * Settings.tileSize,
      this.size * Settings.tileSize,
      this.size * Settings.tileSize,
    );
  }

  get lineOfSight() {
    return LineOfSightMask.NONE;
  }

  getPerceivedRotation() {
    return -Math.PI / 2;
  }

  Model = Assets.getAssetUrl("models/player_black_chinchompa.glb");
  create3dModel(): Model {
    return new GLTFModel(this, [this.Model], {
      scale: 1,
      verticalOffset: 0,
      originOffset: {
        x: 0,
        y: 0,
      },
    });
  }
}
