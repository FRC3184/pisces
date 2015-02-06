var timeID = 0;
var time = 0;
var inMatch = false;
var match = {};
var curStack = {};
function bindLinks() {
    $(".scout-select").click(function() {
        $(this).toggleClass("scout-selected");
		updateStackScore();
    });
	$("#toggleMatch").click(function() {
		if (!inMatch) {
			startMatch();
		}
		else {
			endMatch();
		}
    });
	$(".newStack").click(function() {
		if (curStack['size'] !== undefined && curStack['size'] !== 0) {
			commitStack();
		}
		curStack = {};
		curStack.size = 0;
		curStack.can = false;
		curStack.litter = false;
		switch ($(this).attr("id")) {
			case "team1":
				curStack.team = match.teams[0];
				break;
			case "team2":
				curStack.team = match.teams[1];
				break;
			case "team3":
				curStack.team = match.teams[2];
				break;
		}
	});
	$("#commitStack").click(function() {
		commitStack();
	});
	$("#landfill").click(function() {
		match.landfill++;
		$("#litter-score").html(litterScore(match));
	});
	$("#no-landfill").click(function() {
		match.unprocessed++;
		$("#litter-score").html(litterScore(match));
	});
}
function startMatch() {
	match = {};
	match.teams = [parseInt($("#team1-in").val()), parseInt($("#team2-in").val()), parseInt($("#team3-in").val())];
	match.regional = regionals.superior;
	match.number = $("#match").val();
	match.year = 2015;
	match.side = $("#side").val();
	match.stacks = [];
	match.landfill = 0;
	match.unprocessed = 0;
	
	$("#team1").html("Team " + match.teams[0]);
	$("#team2").html("Team " + match.teams[1]);
	$("#team3").html("Team " + match.teams[2]);
	
	inMatch = true;
	$("#toggleMatch").html("End Match");
	time = 0;
	timeID = setInterval(function() {
		time++;
		$("#time").html(time + "s");
		if (time === (60*2) +  30) {
			endMatch();
		}
		
	}, 1000);
}
function endMatch() {
	addMatchRaw(match);
	inMatch = false;
	$("#toggleMatch").html("Start Match");
	clearInterval(timeID);
}
function commitStack() {
	
	curStack.time = time;
	$(".scout-selected").removeClass("scout-selected");
	match.stacks.push(curStack);
	curStack = {};
}
function updateStackScore() {
	curStack.size = $(".tote.scout-selected").size();
	curStack.can = $("#can").is(".scout-selected");
	curStack.litter = $("#litter").is(".scout-selected");
	$("#stack-score").html(stack_score(curStack));
}

//Page Init
bindLinks();