var regionals = {};
regionals.tenKLakes = "10k Lakes";
regionals.superior = "Lake Superior";
regionals.kansasCity = "Kansas City";
regionals.milwaukee = "Milwaukee";


var matches = TAFFY([
	{
		"regional": "Milwaukee",
		"number": 88,
		"year": 2016,
		"side": "blue",
		"teams": [4057, 4419, 1820],
		"stacks": [{"team": 4057, "size" : 4, "can": true, "litter": false, time: 40}],
		"landfill": 7,
		"unprocessed": 5
	},
	{
		"regional": "10k Lakes",
		"number": 8,
		"year": 2018,
		"side": "blue",
		"teams": [4318, 2155, 2689],
		"stacks": [{"team": 2155, "size" : 2, "can": true, "litter": true, time: 50}],
		"landfill": 7,
		"unprocessed": 5
	},
	{
		"regional": "10k Lakes",
		"number": 35,
		"year": 2019,
		"side": "red",
		"teams": [42, 1135, 912],
		"stacks": [{"team": 42, "size" : 6, "can": true, "litter": true, time: 20}],
		"landfill": 7,
		"unprocessed": 5
	},
	{
		"regional": "Milwaukee",
		"number": 66,
		"year": 2016,
		"side": "red",
		"teams": [1720, 2077, 2728],
		"stacks": [{"team": 1720, "size" : 3, "can": true, "litter": false, time: 70}],
		"landfill": 7,
		"unprocessed": 5
	},
	{
		"regional": "Kansas City",
		"number": 39,
		"year": 2017,
		"side": "blue",
		"teams": [1396, 972, 836],
		"stacks": [{"team": 972, "size" : 6, "can": true, "litter": false, time: 80}],
		"landfill": 7,
		"unprocessed": 5
	},
	{
		"regional": "Lake Superior",
		"number": 67,
		"year": 2018,
		"side": "red",
		"teams": [2186, 1936, 1980],
		"stacks": [{"team": 2186, "size" : 3, "can": false, "litter": false, time: 40}],
		"landfill": 7,
		"unprocessed": 5
	}
]);
//matches.store("pisces");

//Filtering Methods
function byTeam(team) {
	return matches(function() {
		return this.teams.indexOf(team) > -1;
	});
}
function byRegional(regional) {
	return matches({"regional": regional})
}
function filterMatches(regional, year, team) {
	return matches(function() {
		if (regional !== "all") {
			if (this.regional !== regional) {
				return false;
			}
		}
		if (year !== "") {
			if (this.year !== parseInt(year)) {
				return false;
			}
		}
		if (team !== "") {
			if (this.teams.indexOf(parseInt(team)) === -1) {
				return false;
			}
		}
		return true;
	});
}


//Update analysis tables
function updateMatchTable(query) {
	$("#matches").html("<tbody><tr><th>Regional</th><th>Match Number</th><th>Team</th><th>Team</th><th>Team</th><th>Color</th><th>Year</th></tr></tbody>");
	query.order("year desc, regional, number").each(function(match) {
		$('#matches tr:last').after('<tr><td>'+match.regional+'</td><td>'+match.number+'</td><td>'+match.teams[0]+'</td><td>'+match.teams[1]+'</td><td>'+match.teams[2]+'</td><td>'+match.side+'</td><td>'+match.year+'</td><td><a class="stack_ln detailsButton" id="'+match.___id+'" href="#">Details</a></td></tr>');
	});
	$(".stack_ln").each(function(index) {
		$(this).click(function() {
			$("#stack-window").html("<tbody><tr><th>Team</th><th>Stack Size</th><th>Can?</th><th>Litter?</th><th>Time</th><th>Score</th></tr></tbody>");
			$(".stack_ln").parent().parent().removeClass("current_match");
			$(this).parent().parent().addClass("current_match");
			var match = matches(this.id).first();
			var total = match_score(match);
			for (var i = 0; i < match.stacks.length; i++) {
				var stack = match.stacks[i];
				var score = stack_score(stack);
				$('#stack-window tr:last').after('<tr><td>'+stack.team+'</td><td>'+stack.size+'</td><td>'+stack.can+'</td><td>'+stack.litter+'</td><td>'+stack.time+'s</td><td>'+score+'</td></tr>');
			}
			$("#total").html(total);
			$("#landfill").html(match.landfill);
			$("#unprocessed").html(match.unprocessed);
		});
	});
}
function updateTeamTable(regional) {
	$("#teams").html("<tbody><tr><th>Number</th><th>Average Score</th><th>Position</th></tr></tbody>");
	var teams = {};
	var query;
	if (regional === undefined) {
		query = matches();
	}
	else {
		query = byRegional(regional);
	}
	query.each(function(match) {
		for (var i = 0; i < match.teams.length; i++) {
			var team = match.teams[i];
			if (teams[team] === undefined) {
				teams[team] = match_score(match);
			}
			else {
				teams[team] += match_score(match);
			}
		}
	});
	var sorted = sortObject(teams);
	
	for (var i = 0; i < sorted.length; i++) {
		var avg = sorted[i].value / byTeam(parseInt(sorted[i].key)).count();
		$('#teams tr:last').after('<tr><td>'+sorted[i].key+'</td><td>'+avg+'</td><td>'+(i+1)+'</td></tr>');
	}
}

//Misc Utility
function addMatch(regional, number, year, side, teams) {
	return matches.insert({"regional":regional, "number":number, "year":year, "side":side, "teams":teams, "stacks":[]});
}

function bindLinks() {
	$("#update-team").click(function() {
		var val = $("#team-regional").val();
		if (val === "all") {
			updateTeamTable();
		}
		else {
			updateTeamTable(val);
		}
	});
	$("#update-match").click(function() {
		updateMatchTable(filterMatches($("#match-regional").val(), $("#match-year").val(), $("#match-team").val()));
	});
	$("#match-filter-toggle").click(function() {
		$("#match-filter").toggle();
	});
	$("#team-filter-toggle").click(function() {
		$("#team-filter").toggle();
	});
}
function populate() {
	$(".regional-select option").each(function() {
		for (var regional in regionals) {
			$(this).after("<option value=\""+regionals[regional]+"\">"+regionals[regional]+"</option>");
		}
	});
}

//Scoring
function stack_score(stack) {
	return 2*stack.size + (stack.can ? 4*stack.size : 0) + (stack.litter ? 6 : 0);
}
function match_score(match) {
	var score = 0;
	if (match.stacks !== undefined) {
		for (var i = 0; i < match.stacks.length; i++) {
			score += stack_score(match.stacks[i]);
		}
	}
	score += match.landfill;
	score -= match.unprocessed*4;
	return Math.max(score, 0);
}

// Init Page
updateMatchTable(matches());
updateTeamTable();
bindLinks();
populate();