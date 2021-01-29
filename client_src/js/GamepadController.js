const DefaultProfile = {
	name: "DEFUAULT",
	vendor: null,
	product: null,

	buttons: {
		square: 0,
		x: 1,
		circle: 2,
		triangle: 3,
		lb: 4,
		rb: 5,
		lt: 6,
		rt: 7,
		select: 8,
		start: 9,
		lstick: 10,
		rstick: 11,
		home: 12,
	},

	axes: {
		lstick_lr: 0,
		lstick_ud: 1,
		rstick_lr: 2,
		lt: 3,
		rt: 4,
		rstick_ud: 5,
		dpad: 9
	},

	axes_limits: {
		lstick_neutral: 0,
		lstick_l: -1,
		lstick_r: 1,
		lstick_u: 1,
		lstick_d: -1,
		rstick_neutral: 0,
		rstick_l: -1,
		rstick_r: 1,
		rstick_u: 1,
		rstick_d: -1,
		dpad_neutral: 1.28,
		dpad_l: 0.71429,
		dpad_r: -0.42857,
		dpad_u: -1,
		dpad_d: 0.14286,
		lt_neutral: -1,
		lt_full: 1,
		rt_neutral: -1,
		rt_full: 1
	},

	axes_deadzone: {
		lstick: 0,
		rstick: 0,
		dpad: 0,
		lt: 0,
		rt: 0
	},

	axes_normalizer: {
		lstick_lr: 1,
		lstick_ud: 1,
		rstick_lr: 1,
		lstick_ud: 1
	}
}

const PS5Profile = {
	name: "PS5",
	vendor: "054c",
	product: "0ce6",

	buttons: {
		square: 0,
		x: 1,
		circle: 2,
		triangle: 3,
		lb: 4,
		rb: 5,
		lt: 6,
		rt: 7,
		select: 8,
		start: 9,
		lstick: 10,
		rstick: 11,
		home: 12,
		touchpad: 13,
		screenshot: 14
	},

	axes: {
		lstick_lr: 0,
		lstick_ud: 1,
		rstick_lr: 2,
		lt: 3,
		rt: 4,
		rstick_ud: 5,
		dpad: 9
	},

	axes_limits: {
		lstick_neutral: 0,
		lstick_l: -1,
		lstick_r: 1,
		lstick_u: -1,
		lstick_d: 1,
		rstick_neutral: 0,
		rstick_l: -1,
		rstick_r: 1,
		rstick_u: -1,
		rstick_d: 1,
		dpad_neutral: 1.28,
		dpad_l: 0.71429,
		dpad_r: -0.42857,
		dpad_u: -1,
		dpad_d: 0.14286,
		dpad_ur: -0.71429,
		dpad_ul: 1,
		dpad_dr: -0.14286,
		dpad_dl: 0.42857,
		lt_neutral: -1,
		lt_full: 1,
		rt_neutral: -1,
		rt_full: 1
	},

	axes_deadzone: {
		lstick: 0.03,
		rstick: 0.03,
		dpad: 0.05,
		lt: 0,
		rt: 0
	},

	axes_normalizer: {
		lstick_lr: 1,
		lstick_ud: -1,
		rstick_lr: 1,
		rstick_ud: -1
	}
}

let profile_list = [PS5Profile];

class Controller {
	constructor(gamepad) {
		this.gamepad = gamepad;
		for (let i = 0; i<profile_list.length; i++) {
			if(gamepad.id.includes(profile_list[i].vendor) && gamepad.id.includes(profile_list[i].product)){
				this.profile = profile_list[i];
				break;
			}
			if(i == profile_list.length - 1) {
				this.profile = DefaultProfile;
			}
		}
		if(this.profile.name == "PS5") {
			Object.defineProperty(this, 'touchpad', { get: function() { return this.gamepad.buttons[this.profile.buttons.touchpad]; } });
			Object.defineProperty(this, 'screenshot', { get: function() { return this.gamepad.buttons[this.profile.buttons.screenshot]; } });
		}
	}
	//FUNCTIONAL STUFF
	updateGamepad() {
		this.gamepad = navigator.getGamepads()[this.gamepad.index];
	}
	//DIGITALS
	get x() {
		return this.gamepad.buttons[this.profile.buttons.x];
	}
	get circle() {
		return this.gamepad.buttons[this.profile.buttons.circle];
	}
	get square() {
		return this.gamepad.buttons[this.profile.buttons.square];
	}
	get triangle() {
		return this.gamepad.buttons[this.profile.buttons.triangle];
	}
	get lb() {
		return this.gamepad.buttons[this.profile.buttons.lb];
	}
	get rb() {
		return this.gamepad.buttons[this.profile.buttons.rb];
	}
	get lt() {
		return this.gamepad.buttons[this.profile.buttons.lt];
	}
	get rt() {
		return this.gamepad.buttons[this.profile.buttons.rt];
	}
	get select() {
		return this.gamepad.buttons[this.profile.buttons.select];
	}
	get start() {
		return this.gamepad.buttons[this.profile.buttons.start];
	}
	get lstick() {
		return this.gamepad.buttons[this.profile.buttons.lstick];
	}
	get rstick() {
		return this.gamepad.buttons[this.profile.buttons.rstick];
	}
	get home() {
		return this.gamepad.buttons[this.profile.buttons.home];
	}

	//RAW ANALOGS
	get a_lstick_lr() {
		return this.gamepad.axes[this.profile.axes.lstick_lr] ;
	}
	get a_lstick_ud() {
		return this.gamepad.axes[this.profile.axes.lstick_ud];
	}
	get a_rstick_lr() {
		return this.gamepad.axes[this.profile.axes.rstick_lr];
	}
	get a_rstick_ud() {
		return this.gamepad.axes[this.profile.axes.rstick_ud];
	}
	get a_lt() {
		return this.gamepad.axes[this.profile.axes.lt];
	}
	get a_rt() {
		return this.gamepad.axes[this.profile.axes.rt];
	}
	get a_dpad() {
		return this.gamepad.axes[this.profile.axes.dpad];
	}

	//MAKES LEFT NEGATIVE AND DOWN NEGATIVE FOR ANALOG INPUTS
	//ALSO SCALES TO -1 and 1 AND APPLIES DEADZONES
	get n_lstick_lr() {
		let val = this.gamepad.axes[this.profile.axes.lstick_lr]/this.profile.axes_normalizer.lstick_lr
		if(val > this.profile.axes_deadzone.lstick || val < -this.profile.axes_deadzone.lstick){
			return val;
		} else {
			return 0;
		}
	}
	get n_lstick_ud() {
		let val = this.gamepad.axes[this.profile.axes.lstick_ud]/this.profile.axes_normalizer.lstick_ud
		if(val > this.profile.axes_deadzone.lstick || val < -this.profile.axes_deadzone.lstick){
			return val;
		} else {
			return 0;
		}
	}
	get n_rstick_lr() {
		let val = this.gamepad.axes[this.profile.axes.rstick_lr]/this.profile.axes_normalizer.rstick_lr
		if(val > this.profile.axes_deadzone.rstick || val < -this.profile.axes_deadzone.rstick){
			return val;
		} else {
			return 0;
		}
	}
	get n_rstick_ud() {
		let val = this.gamepad.axes[this.profile.axes.rstick_ud]/this.profile.axes_normalizer.rstick_ud
		if(val > this.profile.axes_deadzone.rstick || val < -this.profile.axes_deadzone.rstick){
			return val;
		} else {
			return 0;
		}
	}
	//THE NORMALS FOR THE TRIGGERS GO BETWEEN 0 AND 1
	get n_lt() {
		return (this.gamepad.axes[this.profile.axes.lt]-this.profile.axes_limits.lt_neutral)/
		      (this.profile.axes_limits.lt_full - this.profile.axes_limits.lt_neutral);
	}
	get n_rt() {
		return (this.gamepad.axes[this.profile.axes.rt]-this.profile.axes_limits.rt_neutral)/
		       (this.profile.axes_limits.rt_full - this.profile.axes_limits.rt_neutral);
	}

	//DIGITAL ANALOGS
	get dpad_left() {
		return (this.gamepad.axes[this.profile.axes.dpad] >=
		this.profile.axes_limits.dpad_l - this.profile.axes_deadzone.dpad) &&
		(this.gamepad.axes[this.profile.axes.dpad] <=
		this.profile.axes_limits.dpad_l + this.profile.axes_deadzone.dpad)
	}
	get dpad_right() {
		return (this.gamepad.axes[this.profile.axes.dpad] >=
		this.profile.axes_limits.dpad_r - this.profile.axes_deadzone.dpad) &&
		(this.gamepad.axes[this.profile.axes.dpad] <=
		this.profile.axes_limits.dpad_r + this.profile.axes_deadzone.dpad)
	}
	get dpad_up() {
		return (this.gamepad.axes[this.profile.axes.dpad] >=
		this.profile.axes_limits.dpad_u - this.profile.axes_deadzone.dpad) &&
		(this.gamepad.axes[this.profile.axes.dpad] <=
		this.profile.axes_limits.dpad_u + this.profile.axes_deadzone.dpad)
	}
	get dpad_down() {
		return (this.gamepad.axes[this.profile.axes.dpad] >=
		this.profile.axes_limits.dpad_d - this.profile.axes_deadzone.dpad) &&
		(this.gamepad.axes[this.profile.axes.dpad] <=
		this.profile.axes_limits.dpad_d + this.profile.axes_deadzone.dpad)
	}
	get dpad_up_left() {
		return (this.gamepad.axes[this.profile.axes.dpad] >=
		this.profile.axes_limits.dpad_ul - this.profile.axes_deadzone.dpad) &&
		(this.gamepad.axes[this.profile.axes.dpad] <=
		this.profile.axes_limits.dpad_ul + this.profile.axes_deadzone.dpad)
	}
	get dpad_up_right() {
		return (this.gamepad.axes[this.profile.axes.dpad] >=
		this.profile.axes_limits.dpad_ur - this.profile.axes_deadzone.dpad) &&
		(this.gamepad.axes[this.profile.axes.dpad] <=
		this.profile.axes_limits.dpad_ur + this.profile.axes_deadzone.dpad)
	}
	get dpad_down_left() {
		return (this.gamepad.axes[this.profile.axes.dpad] >=
		this.profile.axes_limits.dpad_dl - this.profile.axes_deadzone.dpad) &&
		(this.gamepad.axes[this.profile.axes.dpad] <=
		this.profile.axes_limits.dpad_dl + this.profile.axes_deadzone.dpad)
	}
	get dpad_down_right() {
		return (this.gamepad.axes[this.profile.axes.dpad] >=
		this.profile.axes_limits.dpad_dr - this.profile.axes_deadzone.dpad) &&
		(this.gamepad.axes[this.profile.axes.dpad] <=
		this.profile.axes_limits.dpad_dr + this.profile.axes_deadzone.dpad)
	}

	get lstick_left() {
		return this.gamepad.axes[this.profile.axes.lstick_lr]/
		       this.profile.axes_normalizer.lstick_lr <=
			     -this.profile.axes_deadzone.lstick
	}
	get lstick_right() {
		return this.gamepad.axes[this.profile.axes.lstick_lr]/
		       this.profile.axes_normalizer.lstick_lr >=
			     this.profile.axes_deadzone.lstick
	}
	get lstick_down() {
		return this.gamepad.axes[this.profile.axes.lstick_ud]/
		       this.profile.axes_normalizer.lstick_ud <=
			     -this.profile.axes_deadzone.lstick
	}
	get lstick_up() {
		return this.gamepad.axes[this.profile.axes.lstick_ud]/
		       this.profile.axes_normalizer.lstick_ud >=
			     this.profile.axes_deadzone.lstick
	}

	get rstick_left() {
		return this.gamepad.axes[this.profile.axes.rstick_lr]/
		       this.profile.axes_normalizer.rstick_lr <=
			     -this.profile.axes_deadzone.rstick
	}
	get rstick_right() {
		return this.gamepad.axes[this.profile.axes.rstick_lr]/
		       this.profile.axes_normalizer.rstick_lr >=
			     this.profile.axes_deadzone.rstick
	}
	get rstick_down() {
		return this.gamepad.axes[this.profile.axes.rstick_ud]/
		       this.profile.axes_normalizer.rstick_ud <=
			     -this.profile.axes_deadzone.rstick
	}
	get rstick_up() {
		return this.gamepad.axes[this.profile.axes.rstick_ud]/
		       this.profile.axes_normalizer.rstick_ud >=
			     this.profile.axes_deadzone.rstick
	}
}
