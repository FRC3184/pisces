var timeID = 0;
var time = 0;
var inMatch = false;
function bindLinks() {
    $(".scout-select").click(function() {
        $(this).toggleClass("scout-selected");
    });
	$("#toggleMatch").click(function() {
		inMatch = !inMatch;
        $(this).html(inMatch ? "End Match" : "Start Match");
		if (inMatch) {
			startMatch();
		}
		else {
			endMatch();
		}
    });
}
function startMatch() {
	time = 0;
	timeID = setInterval(function() {
		time++;
		$("#time").html(time + "s");
	}, 1000);
}
function endMatch() {
	clearInterval(timeID);
}

//Page Init
bindLinks();