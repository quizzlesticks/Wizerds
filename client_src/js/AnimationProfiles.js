const AnimationProfiles = {
    CharacterProfiles: {
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
                animations: {"KeyS": [0, 1],
                             "KeyD": [2, 3],
                             "KeyA": [4, 5],
                             "KeyW": [6, 7]}
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
                animations: {"KeyS": [0, 1],
                             "KeyD": [2, 3],
                             "KeyA": [4, 5],
                             "KeyW": [6, 7]}
            },
            Idle: {
                id: "RedRidingHoodMove",
                filename: "/Spritesheets/RedRidingHoodMovement.png",
                sprite_width: 34,
                sprite_height: 34,
                sprite_columns: 4,
                sprite_rows: 1,
                default_scale: 2,
                frame_delay: 8,
                animations: {"KeyS": [0],
                             "KeyD": [2],
                             "KeyA": [4],
                             "KeyW": [6]},
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
                animations: {"KeyS": [1, 2],
                             "KeyD": [4, 5],
                             "KeyA": [7, 8],
                             "KeyW": [10, 11]}
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
                animations: {"KeyS": [0, 1],
                             "KeyD": [2, 3],
                             "KeyA": [4, 5],
                             "KeyW": [6, 7]}
            },
            Idle: {
                id: "SciGuyMove",
                sprite_width: 34,
                sprite_height: 34,
                sprite_columns: 4,
                sprite_rows: 1,
                default_scale: 2,
                frame_delay: 8,
                filename: "/Spritesheets/SciGuyMovement.png",
                animations: {"KeyS": [0],
                              "KeyD": [1],
                              "KeyA": [2],
                              "KeyW": [9]}
            }
        }
    },

    BulletProfiles: {
        BlueBullet: {
            id: "BlueBullet",
            sprite_width: 34,
            sprite_height: 18,
            sprite_columns: 4,
            sprite_rows: 1,
            frame_delay: 3,
            default_scale: 1.2,
            filename: "/Spritesheets/BlueBullet.png",
            animation: [0, 3]
        }
    },

    BIGASS: {
        LASER: {
            id: "LASSSSER",
            sprite_width: 1000,
            sprite_height: 64,
            sprite_columns: 1,
            sprite_rows: 38,
            frame_delay: 2,
            default_scale: 3,
            filename: "/Spritesheets/BIGASSLASER.png",
            animation: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
            FOREVER: [36,37]
        }
    },

    EnemyProfiles: {
        BlueSlime: {
            Move: {
                id: "BlueSlimeMove",
                filename: "/Spritesheets/BlueSlimeMove.png",
                sprite_width: 32,
                sprite_height: 27,
                sprite_columns: 4,
                sprite_rows: 4,
                default_scale: 1,
                frame_delay: 8,
                animations: {"KeyS": [0, 1, 2, 3],
                             "KeyA": [4, 5, 6, 7],
                             "KeyD": [8, 9, 10, 11],
                             "KeyW": [12, 13, 14, 15]}
            },
            Attack: {
                id: "BlueSlimeIdle",
                filename: "/Spritesheets/BlueSlimeIdle.png",
                sprite_width: 32,
                sprite_height: 27,
                sprite_columns: 2,
                sprite_rows: 4,
                default_scale: 1,
                frame_delay: 3,
                animations: {"KeyS": [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
                              "KeyA": [2, 3, 2, 3, 2, 3, 2, 3, 3, 3, 3, 3, 3],
                              "KeyD": [4, 5, 4, 5, 4, 5, 4, 5, 5, 5, 5, 5, 5],
                              "KeyW": [6, 7, 6, 7, 6, 7, 6, 7, 7, 7, 7, 7, 7]}
            },
            Idle: {
                id: "BlueSlimeIdle",
                sprite_width: 32,
                sprite_height: 27,
                sprite_columns: 2,
                sprite_rows: 4,
                default_scale: 1,
                frame_delay: 16,
                filename: "/Spritesheets/BlueSlimeIdle.png",
                animations: {"KeyS": [0, 1],
                             "KeyA": [2, 3],
                             "KeyD": [4, 5],
                             "KeyW": [6, 7]}
            }
        }
    }
    }
