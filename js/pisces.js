var regionals = {};
regionals.tenKLakes = "10k Lakes";
regionals.superior = "Lake Superior";
regionals.kansasCity = "Kansas City";
regionals.milwaukee = "Milwaukee";


var matches = TAFFY();
//matches.store("pisces");

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

//Scoring
function stack_score(stack) {
    return 2 * stack.size + (stack.can ? 4 * stack.size : 0) + (stack.litter ? 6 : 0);
}

function match_score(match) {
    var score = 0;
    if (match.stacks !== undefined) {
        for (var i = 0; i < match.stacks.length; i++) {
            score += stack_score(match.stacks[i]);
        }
    }
    score += match.landfill;
    score -= match.unprocessed * 4;
    return Math.max(score, 0);
}