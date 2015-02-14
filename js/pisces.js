var matches = TAFFY();
var regionals = TAFFY();
matches.store("pisces-matches");
regionals.store("pisces-regionals");

//Misc Utility
function addMatch(regional, number, year, side, teams, stacks, landfill, unprocessed) {
    return matches.insert({
        "regional": regional,
        "number": number,
        "year": year,
        "side": side,
        "teams": teams,
        "stacks": stacks,
		"landfill": landfill,
		"unprocessed": unprocessed
    });
}
function addMatchRaw(match) {
	return matches.insert(match);
}
function populate() {
	$(".regional-select > option").not("[value='all']").remove();
    $(".regional-select > option").each(function() {
		var reg = regionals().get();
        for (var i = 0; i < reg.length; i++) {
			var regional = reg[i];
            $(this).after("<option value=\"" + regional.name + "\">" + regional.name + "</option>");
        }
    });
}

//Scoring
function stack_score(stack) {
    return 2 * stack.size + (stack.can ? 4 * stack.size : 0) + (stack.litter ? 6 : 0);
}

function match_score(match) {
    var score = 0;
    if (match.stacks !== undefined) {
        for (var i = 0; i < match.stacks.length; i++) {
			if (match.stacks[i].valid) {
				score += stack_score(match.stacks[i]);
			}
        }
    }
    score += litterScore(match);
	if (match.robot_set) {
		score += 4;
	}
	if (match.container_set) {
		score += 8;
	}
	if (match.auto_set === "set") {
		score += 6;
	}
	if (match.auto_set === "stack") {
		score += 20;
	}
    return Math.max(score, 0);
}
function litterScore(match) {
	var score = 0;
	score += match.landfill;
    score += match.unprocessed * 4;
	return score;
}