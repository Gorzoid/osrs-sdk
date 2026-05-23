import {
  Region,
  Location,
  UnitOptions,
  Assets,
  BasicModel,
  GLTFModel,
  MeleeWeapon,
  Mob,
  Unit,
  Pathing,
  Location3,
  Projectile,
  MagicWeapon,
  RangedWeapon,
  Random,
} from "../src";

import OlmHeadModel from "../src/assets/olm_head.glb";
import OlmLeftHandModel from "../src/assets/olm_left_hand.glb";
import OlmRightHandModel from "../src/assets/olm_right_hand.glb";

enum HeadDirection {
  LEFT,
  RIGHT,
  CENTER,
}

class OlmMagicWeapon extends MagicWeapon {
  constructor() {
    super({
      model: Assets.getAssetUrl("models/olm_magic_projectile.glb"),
    });
  }

  override _baseSpellDamage() {
    return 33;
  }

  override _magicDamageBonusMultiplier() {
    return 1;
  }
}

class OlmRangedWeapon extends RangedWeapon {
  constructor() {
    super({
      model: Assets.getAssetUrl("models/olm_range_projectile.glb"),
    });
  }

  override _maxHit() {
    return 33;
  }
}

export class OlmHead extends Mob {
  override mobName() {
    return "Olm Head";
  }

  override get combatLevel() {
    return 200;
  }

  override setStats() {
    this.weapons = {
      slash: new MeleeWeapon(),
      magic: new OlmMagicWeapon(),
      range: new OlmRangedWeapon(),
    };

    this.stats = {
      attack: 50,
      strength: 500,
      defence: 50,
      range: 50,
      magic: 50,
      hitpoint: 500,
    };
    this.currentStats = JSON.parse(JSON.stringify(this.stats));
  }

  override canMove() {
    // cannot move
    return false;
  }

  override get bonuses() {
    return {
      attack: {
        stab: 0,
        slash: 500,
        crush: 0,
        magic: 0,
        range: 0,
      },
      defence: {
        stab: 65,
        slash: 65,
        crush: 65,
        magic: 30,
        range: 5,
      },
      other: {
        meleeStrength: 40,
        rangedStrength: 0,
        magicDamage: 1,
        prayer: 0,
      },
    };
  }

  override get attackSpeed() {
    return 4;
  }

  attackStyleForNewAttack() {
    return this.attackStyle ?? "magic";
  }

  get attackRange() {
    return 100;
  }

  get size() {
    return 5;
  }

  override get idlePoseId() {
    return 1;
  }

  private didOlmAttack = false;

  override get attackAnimationId(): number | null {
    if (this.didOlmAttack) {
      return 2;
    }
    return null;
  }

  private lastHeadDirection: number = 0;
  private headDirection: number = 0;

  override getPerceivedRotation(tickPercent: number): number {
    const lastRotation = (this.lastHeadDirection * Math.PI) / 4;
    const targetRotation = (this.headDirection * Math.PI) / 4;
    if (tickPercent > 1) {
      return targetRotation;
    }
    return Pathing.linearInterpolation(lastRotation, targetRotation, tickPercent);
  }

  override timerStep() {
    this.lastHeadDirection = this.headDirection;
  }

  private leftHandDamage = 0;
  private rightHandDamage = 0;
  public onHandAttacked(side: "left" | "right", damage: number) {
    if (side === "left") {
      this.leftHandDamage += damage;
    } else {
      this.rightHandDamage += damage;
    }
  }

  private cycleNumber = 0;

  override attack(): boolean {
    if (!this.aggro) {
      return false;
    }

    const centerY = this.location.y - 2;
    const dy = this.aggro.location.y - centerY;

    // Handle turning
    if (!this.didOlmAttack && this.leftHandDamage && dy >= 0) {
      this.headDirection = -1;
    } else if (!this.didOlmAttack && this.rightHandDamage && dy <= 0) {
      this.headDirection = 1;
    } else if (dy >= 6) {
      this.headDirection = -1;
    } else if (dy <= -6) {
      this.headDirection = 1;
    } else {
      this.headDirection = 0;
    }

    this.leftHandDamage = this.rightHandDamage = 0;

    // Only attack if looking in the right direction
    let isLookingAtTarget = false;
    switch (this.headDirection) {
      case -1:
        isLookingAtTarget = dy >= 0;
        break;
      case 1:
        isLookingAtTarget = dy <= 0;
        break;
      case 0:
        isLookingAtTarget = Math.abs(dy) < 6;
        break;
    }

    if (!isLookingAtTarget) {
      this.didOlmAttack = false;
      return false; // don't progress cycle if we aren't looking at them
    }

    console.log(`Olm attack YES! cycle=${this.cycleNumber % 4}`);

    this.didOlmAttack = true;

    const cycle = this.cycleNumber % 4;
    this.cycleNumber++;

    if (cycle === 0 || cycle === 2) {
      // Basic Attack
      this.attackStyle = Random.get() > 0.5 ? "magic" : "range";
      return super.attack();
    } else if (cycle === 1) {
      // Null cycle
      this.didOlmAttack = false; // no attack anim
      return true; // Return true so attackDelay is reset
    } else if (cycle === 3) {
      // Special attack (placeholder to basic attack for now)
      this.attackStyle = Random.get() > 0.5 ? "magic" : "range";
      return super.attack();
    }

    return true;
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, OlmHeadModel);
  }
}

export class OlmHand extends Mob {
  constructor(
    private readonly side: "left" | "right",
    private readonly head: OlmHead,
    region: Region,
    location: Location,
    options?: UnitOptions,
  ) {
    super(region, location, options);
    this.autoRetaliate = false;
  }

  override mobName() {
    return `Olm ${this.side.charAt(0).toUpperCase()}${this.side.substring(1)} Hand`;
  }

  override get combatLevel() {
    return 200;
  }

  override setStats() {
    this.stats = {
      attack: 50,
      strength: 500,
      defence: 50,
      range: 50,
      magic: 50,
      hitpoint: 500,
    };
    this.currentStats = JSON.parse(JSON.stringify(this.stats));
  }

  override canMove() {
    // cannot move
    return false;
  }

  getPerceivedOffsets(tickPercent: number): Location3[] {
    return [{ x: 0, y: -1, z: 0 }];
  }

  override canAttack(): boolean {
    return false;
  }

  override get bonuses() {
    return {
      attack: {
        stab: 0,
        slash: 500,
        crush: 0,
        magic: 0,
        range: 0,
      },
      defence: {
        stab: 65,
        slash: 65,
        crush: 65,
        magic: 30,
        range: 5,
      },
      other: {
        meleeStrength: 40,
        rangedStrength: 0,
        magicDamage: 0,
        prayer: 0,
      },
    };
  }

  override get attackSpeed() {
    return 4;
  }

  get attackRange() {
    return 0;
  }

  get size() {
    return 5;
  }

  get idlePoseId() {
    return 1;
  }

  create3dModel() {
    return GLTFModel.forRenderable(this, this.side === "left" ? OlmLeftHandModel : OlmRightHandModel);
  }

  override addProjectile(projectile: Projectile) {
    super.addProjectile(projectile);
    if (projectile.damage > 0) {
      this.head.onHandAttacked(this.side, projectile.damage);
    }
  }
}

// class OlmLeftHand extends OlmHand {

// }

// class OlmRightHand extends OlmHand {

// }

// export class OlmController {
//   private readonly head: OlmHead;
//   private readonly leftHand: OlmLeftHand;
//   private readonly rightHand: OlmRightHand;

//   constructor(private readonly region: Region, headPosition: Location) {
//     this.head = new OlmHead(region, head);
//   }

//   spawn() {
//     this.region.addMob(this.head);
//     this.region.addMob(this.leftHand);
//     this.region.addMob(this.rightHand);
//   }
// }
