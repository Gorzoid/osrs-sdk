import { Player } from "../../src/sdk/Player";
import { World } from "../../src/sdk/World";
import { Random } from "../../src/sdk/Random";
import { Viewport } from "../../src/sdk/Viewport";
import { TestRegion } from "../../src/sdk/testing/TestRegion";
import { Settings } from "../../src";
import { OlmHead } from "../../sample/Olm";

describe("Olm attack rotation", () => {
  test("Olm performs 4-tick rotation: attack, null, attack, special", () => {
    Settings.inputDelay = 0;
    const region = new TestRegion(60, 60);
    const world = new World();
    region.world = world;
    world.addRegion(region);

    // Player positioned in front of Olm's center
    const player = new Player(region, { x: 30, y: 15 }); // Moved to y=15 to ensure dy=-8 and not "under" olm (size=5)
    player.setStats();
    player.currentStats.hitpoint = 99; // Give the player HP
    region.addPlayer(player);
    Viewport.setupViewport(region, true);
    Viewport.viewport.setPlayer(player);

    const olmHead = new OlmHead(region, { x: 30, y: 25 }, {});
    olmHead.attackDelay = -1; // Initialize attack delay so it starts firing immediately
    olmHead.age = 0; // Needs age <= 0 to attack
    olmHead.frozen = 0;
    olmHead.stunned = 0;
    region.addMob(olmHead);
    
    // Aggro Olm onto player and let it detect the player
    olmHead.setAggro(player);
    
    // Let the simulation naturally tick a few times so the attack loop picks up the target
    // Cycle 0: Basic Attack
    for (let i = 0; i < 4; i++) {
        olmHead.hasLOS = true;
        world.tickWorld(1);
    }

    // Reset cycle to ensure we track from the beginning of our test assertions
    (olmHead as any).cycleNumber = 0;
    olmHead.attackDelay = 0; // reset attack delay too so it attacks on next tick

    let attacksFired = 0;
    const magicSpy = jest.spyOn(olmHead.weapons.magic, "attack").mockImplementation(() => {
      attacksFired++;
      return true;
    });
    const rangeSpy = jest.spyOn(olmHead.weapons.range, "attack").mockImplementation(() => {
      attacksFired++;
      return true;
    });

    // Cycle 0: Basic Attack
    world.tickWorld(4);
    expect(attacksFired).toBe(1);
    expect((olmHead as any).cycleNumber % 4).toBe(1);

    // Cycle 1: Null
    world.tickWorld(4);
    expect(attacksFired).toBe(1); // No new attack
    expect((olmHead as any).cycleNumber % 4).toBe(2);

    // Cycle 2: Basic Attack
    world.tickWorld(4);
    expect(attacksFired).toBe(2);
    expect((olmHead as any).cycleNumber % 4).toBe(3);

    // Cycle 3: Special (Placeholder basic attack)
    world.tickWorld(4);
    expect(attacksFired).toBe(3);
    expect((olmHead as any).cycleNumber % 4).toBe(0); // Rotates back to 0

    magicSpy.mockRestore();
    rangeSpy.mockRestore();
  });
});
