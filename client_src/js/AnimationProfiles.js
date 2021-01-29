const AnimationProfiles = {
    CharacterClasses: {
        RedRidingHood: {
            Move: {
                id: "RedRidingHoodMove",
                filename: "/Spritesheets/RedRidingHoodMovement.png",
                sprite_width: 34,
                sprite_height: 34,
                sprite_columns: 8,
                sprite_rows: 1,
                default_scale: 2,
                frame_delay: 8,
                animations: {"KeyS": {start: 0, stop: 1},
                             "KeyD": {start: 2, stop: 3},
                             "KeyA": {start: 4, stop: 5},
                             "KeyW": {start: 6, stop: 7}}
            },

            Attack: {
                id: "RedRidingHoodAttack",
                filename: "/Spritesheets/RedRidingHoodAttack.png",
                sprite_width: 46,
                sprite_height: 34,
                sprite_columns: 2,
                sprite_rows: 4,
                default_scale: 2,
                frame_delay: 8,
                animations: {"KeyS": {start: 0, stop: 1},
                             "KeyD": {start: 2, stop: 3},
                             "KeyA": {start: 4, stop: 5},
                             "KeyW": {start: 6, stop: 7}}
            },

            Idle: {
                id: "RedRidingHoodIdle",
                filename: "/Spritesheets/RedRidingHoodIdle.png",
                sprite_width: 34,
                sprite_height: 34,
                sprite_columns: 4,
                sprite_rows: 1,
                default_scale: 2,
                frame_delay: 8,
                animations: {"KeyS": {start: 0, stop: 0},
                             "KeyD": {start: 1, stop: 1},
                             "KeyA": {start: 2, stop: 2},
                             "KeyW": {start: 3, stop: 3}},
            }
        },

        SciGuy: {
            Move: {
                id: "SciGuyMove",
                filename: "/Spritesheets/SciGuyMovement.png",
                sprite_width: 34,
                sprite_height: 34,
                sprite_columns: 3,
                sprite_rows: 4,
                default_scale: 2,
                frame_delay: 8,
                animations: {"KeyS": {start: 1, stop: 2},
                             "KeyD": {start: 4, stop: 5},
                             "KeyA": {start: 7, stop: 8},
                             "KeyW": {start: 10, stop: 11}}
            },

            Attack: {
                id: "SciGuyAttack",
                filename: "/Spritesheets/SciGuyAttack.png",
                sprite_width: 34,
                sprite_height: 34,
                sprite_columns: 2,
                sprite_rows: 4,
                default_scale: 2,
                frame_delay: 8,
                animations: {"KeyS": {start: 0, stop: 1},
                             "KeyD": {start: 2, stop: 3},
                             "KeyA": {start: 4, stop: 5},
                             "KeyW": {start: 6, stop: 7}}
            },

            Idle: {
                id: "SciGuyIdle",
                sprite_width: 34,
                sprite_height: 34,
                sprite_columns: 4,
                sprite_rows: 1,
                default_scale: 2,
                frame_delay: 8,
                filename: "/Spritesheets/SciGuyIdle.png",
                animations: {"KeyS": {start: 0, stop: 0},
                              "KeyD": {start: 1, stop: 1},
                              "KeyA": {start: 2, stop: 2},
                              "KeyW": {start: 3, stop: 3}},
            }
        }
    }
}
