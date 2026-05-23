import {
  AmuletOfTorture,
  BastionPotion,
  CardinalDirection,
  DizanasQuiver,
  DragonArrows,
  FerociousGloves,
  InfernalCape,
  Location,
  MasoriBodyF,
  MasoriChapsF,
  MasoriMaskF,
  NecklaceOfAnguish,
  PegasianBoots,
  Player,
  PrimordialBoots,
  Region,
  SaradominBrew,
  BladeOfSaeldor,
  StaminaPotion,
  SuperRestore,
  TorvaFullhelm,
  TorvaPlatebody,
  TorvaPlatelegs,
  TwistedBow,
  UltorRing,
} from "../src";
import { InvisWall } from "./InvisWall";
import { OlmHead, OlmHand } from "./Olm";
import { SampleScene } from "./SampleScene";

export class SampleRegion extends Region {
  get initialFacing() {
    return CardinalDirection.NORTH;
  }

  getName() {
    return "Sample";
  }

  get width(): number {
    return 51;
  }

  get height(): number {
    return 57;
  }

  initialiseRegion(): { player: Player } {
    const player = new Player(this, {
      x: 25,
      y: 25,
    });
    this.addPlayer(player);
    const loadout = {
      equipment: {
        weapon: new BladeOfSaeldor(),
        offhand: null,
        helmet: new TorvaFullhelm(),
        necklace: new AmuletOfTorture(),
        cape: new InfernalCape(),
        ammo: new DragonArrows(),
        chest: new TorvaPlatebody(),
        legs: new TorvaPlatelegs(),
        feet: new PrimordialBoots(),
        gloves: new FerociousGloves(),
        ring: new UltorRing(),
      },
      inventory: [
        new TwistedBow(),
        new MasoriBodyF(),
        new DizanasQuiver(),
        new PegasianBoots(),
        new NecklaceOfAnguish(),
        new MasoriChapsF(),
        new MasoriMaskF(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        new SaradominBrew(),
        new SaradominBrew(),
        new SuperRestore(),
        new SuperRestore(),
        new BastionPotion(),
        new StaminaPotion(),
        new SuperRestore(),
        new SuperRestore(),
      ],
    };
    player.setUnitOptions(loadout);
  
    const head = new OlmHead(this, { x: 16, y: 18 }, {});
    this.addMob(head);
    this.addMob(new OlmHand('left', head, this, { x: 17, y: 23 }, {}));
    this.addMob(new OlmHand('right', head, this, { x: 17, y: 13 }, {}));


    this.addEntity(new SampleScene(this, { x: 0, y: 48 }));

    let boxTopLeft: Location = { x: 22, y: 8 };
    let boxBottomRight: Location = { x: 31, y: 25 };
    for (let x = boxTopLeft.x; x <= boxBottomRight.x; ++x) {
      this.addEntity(new InvisWall(this, {x, y: boxTopLeft.y - 1}));
      this.addEntity(new InvisWall(this, {x, y: boxBottomRight.y + 1}));
    }
    for (let y = boxTopLeft.y; y <= boxBottomRight.y; ++y) {
      this.addEntity(new InvisWall(this, {x: boxTopLeft.x - 1, y}));
      this.addEntity(new InvisWall(this, {x: boxBottomRight.x + 1, y}));
    }

    this.addEntity(new InvisWall(this, {x: boxBottomRight.x, y: boxTopLeft.y}));

    return { player };
  }
}
