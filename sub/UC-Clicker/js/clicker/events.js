var events = [
/**
 * posts
 **/
	{
		id: 1001,
		on: function() {
			return stats.posts >= 6;
		},
		give: function() {
			Materialize.toast(randomNames.getRandom() + " noticed you are spamming thank you posts everywhere! &nbsp; <span class='red-text lighten-3'>-15 rep</span>", 4000);
			setStat("reputation", stats.reputation - 15);
		}
	},
	{
		id: 1002,
		on: function() {
			return stats.posts >= 8;
		},
		give: function() {
			Materialize.toast("Maybe we should post some valuable content for once. Learning tab unlocked!", 4000);
			showContent("#tabbutton-learning");
		}
	},
	{
		id: 1003,
		on: function() {
			return stats.posts >= 20;
		},
		give: function() {
			Materialize.toast("You are beginning to gain some popularity on the forums. Keep it going!", 4000);
		}
	},
	{
		id: 1004,
		on: function() {
			return stats.posts >= 50;
		},
		give: function() {
			Materialize.toast("You have achieved the minimum post count required to join staff. Staff tab unlocked!", 4000);
			showContent("#tabbutton-staff");
			showContent("#tabcontent-staff");
		}
	},

/**
 * learning
 **/
	{
		id: 2001,
		on: function() {
			return stats.knowledge >= 1;
		},
		give: function() {
			Materialize.toast("Looks like someone is finally taking the effort to learn something!", 4000);
		}
	},
	{
		id: 2002,
		on: function() {
			return stats.knowledge >= 5;
		},
		give: function() {
			Materialize.toast("You've picked up basic knowledge!", 4000);
		}
	}
];