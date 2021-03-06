function bindLinks() {
    $("#update-team").click(function() {
        var val = $("#team-regional").val();
        if (val === "all") {
            updateTeamTable();
        } else {
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
    $("#match-data").click(function() {
        var data = JSON.stringify(filterMatches($("#match-regional").val(), $("#match-year").val(), $("#match-team").val()).get());
        window.prompt("Raw Match Data (Filtered): \nCopy and save this for backups", data);
    });
    $("#match-load").click(function() {
        var data = JSON.parse(window.prompt("Enter raw match data"));
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            matches.insert(data[i]);
        }
        updateMatchTable(filterMatches($("#match-regional").val(), $("#match-year").val(), $("#match-team").val()));
        updateTeamTable();
    });
	$("#edit-regionals").click(function() {
		$(".modal").modal();
	});
	$("#new-regional-button").click(function() {
		var matches = [];
		for (var i = 0; i < 100; i++) {
			matches.push({"blue":[], "red":[]});
		}
		regionals.insert({"name":$("#regional-new").val(), "matches":matches});
		populate();
	});
	$("#regional-edit").blur(function() {
		var reg = regionals({"name":$("#regional-edit").val()}).first();
		regionals({"name":$("#regional-edit").val()}).each(function(rec) {
			console.log(rec);
		});
		$(".wrapper table").html("<thead><tr><th>Match Number</th><th class='blue'>Team</th><th class='blue'>Team</th><th class='blue'>Team</th><th class='red'>Team</th><th class='red'>Team</th><th class='red'>Team</th></tr></thead><tbody></tbody>");
		for (var i = 0; i < 100; i++) {
			var num = (i+1);
			$('.wrapper table tr:last')
			.after('<tr class="reg-match"><th>' + num + '</th><th class="blue"><input value="'+reg.matches[i].blue[0]+'" type="number" class="teamnum" data-match="' + i + '" /></th><th class="blue"><input value="'+reg.matches[i].blue[1]+'" type="number" class="teamnum" data-match="' + i + '" /></th><th class="blue"><input value="'+reg.matches[i].blue[2]+'" type="number" class="teamnum" data-match="' + i + '" /></th><th class="red"><input value="'+reg.matches[i].red[0]+'" type="number" class="teamnum" data-match="' + i + '" /></th><th class="red"><input value="'+reg.matches[i].red[1]+'" type="number" class="teamnum" data-match="' + i + '" /></th><th class="red"><input value="'+reg.matches[i].red[2]+'" type="number" class="teamnum" data-match="' + i + '" /></th></tr>');
		}
	});
	$("#save-regional-button").click(function() {
		var name = regionals({"name":$("#regional-edit").val()}).first().name;
		var matches = [];
		$(".reg-match").each(function() {
			var blue = [];
			var red = [];
			$(this).children(".blue").each(function() {
				blue.push($(this).children().first().val());
			});
			$(this).children(".red").each(function() {
				red.push($(this).children().first().val());
			});
			matches.push({"blue":blue, "red":red});
		});
		console.log(matches);
		regionals({"name":name}).remove();
		regionals.insert({"name":name, "matches":matches})
		
	});
	$("#raw-regional-button").click(function() {
        var data = JSON.stringify(regionals().get());
        window.prompt("Raw Regional Data: \nCopy and save this for backups", data);
    });
    $("#load-regional-button").click(function() {
        var data = JSON.parse(window.prompt("Enter raw regional data"));
        for (var i = 0; i < data.length; i++) {
            regionals.insert(data[i]);
        }
        //updateMatchTable(filterMatches($("#match-regional").val(), $("#match-year").val(), $("#match-team").val()));
        //updateTeamTable();
    });
}
function regionalTeam(reg, match, side, num) {
	return safeArray(safeArray(reg.matches, match, ""), side, "");
}
//Update analysis tables
function updateMatchTable(query) {
    $("#matches").html("<tbody><tr><th>Regional</th><th>Match Number</th><th>Team</th><th>Team</th><th>Team</th><th>Color</th><th>Year</th></tr></tbody>");
    query.order("year desc, regional, number").each(function(match) {
        $('#matches tr:last').after('<tr><td>' + match.regional + '</td><td>' + match.number + '</td><td>' + match.teams[0] + '</td><td>' + match.teams[1] + '</td><td>' + match.teams[2] + '</td><td>' + match.side + '</td><td>' + match.year + '</td><td><a class="stack_ln detailsButton" id="' + match.___id + '" href="#">Details</a></td></tr>');
    });
    $(".stack_ln").each(function() {
        $(this).click(function() {
            $("#stack-window").html("<tbody><tr><th>Team</th><th>Stack Size</th><th>Can?</th><th>Litter?</th><th>Time</th><th>Score</th><th>Valid?</th></tr></tbody>");
            $(".stack_ln").parent().parent().removeClass("current_match");
			var id = this.id;
			var update = this.click;
            $(this).parent().parent().addClass("current_match");
            var match = matches(id).first();
			
            var total = match_score(match);
            for (var i = 0; i < match.stacks.length; i++) {
                var stack = match.stacks[i];
                var score = stack_score(stack);
                $('#stack-window tr:last').after('<tr data-num="'+i+'"><td>' + stack.team + '</td><td>' + stack.size + '</td><td><input class="stack_can" type="checkbox" '+(stack.can ? "checked" : "") + ' /></td><td><input class="stack_litter" type="checkbox" '+(stack.litter ? "checked" : "") + ' /></td><td>' + stack.time + 's</td><td>' + score + '</td><td><input class="stack_valid" type="checkbox" '+(stack.valid ? "checked" : "") + ' /></td></tr>');
            }
            $("#total").html(total);
            $("#landfill").html(match.landfill);
            $("#unprocessed").html(match.unprocessed);
            $("#auto-set").html(match.auto_set);
            $("#can-set").html('<input id="match_container_set" type="checkbox" '+(match.container_set ? "checked" : "") + ' />');
            $("#robot-set").html('<input id="match_robot_set" type="checkbox" '+(match.robot_set ? "checked" : "") + ' />');
			
			$("#commit-match").click(function() {
				$(".stack_can").each(function() {
					var num = parseInt($(this).parent().parent().data("num"));					
					match.stacks[num].can = $(this).is(":checked");
				});
				$(".stack_litter").each(function() {
					var num = parseInt($(this).parent().parent().data("num"));
					match.stacks[num].litter = $(this).is(":checked");
				});
				$(".stack_valid").each(function() {
					var num = parseInt($(this).parent().parent().data("num"));
					match.stacks[num].valid = $(this).is(":checked");
				});
				match.container_set = $("#match_container_set").is(":checked");
				match.robot_set = $("#match_robot_set").is(":checked");
				matches(id).remove();
				
				matches.insert(match);
				
				location.reload();
				//update();
			});
			$("#delete-match").click(function() {
				matches(id).remove();
				
				location.reload();
			});
        });
    });
}

function updateTeamTable(regional) {
    $("#teams").html("<tbody><tr><th>Number</th><th>Average Score</th><th>Position</th></tr></tbody>");
    var teams = {};
    var query;
    if (regional === undefined) {
        query = matches();
    } else {
        query = byRegional(regional);
    }
    query.each(function(match) {
        for (var i = 0; i < match.teams.length; i++) {
            var team = match.teams[i];
            if (teams[team] === undefined) {
                teams[team] = match_score(match);
            } else {
                teams[team] += match_score(match);
            }
        }
    });
    var sorted = sortObject(teams);

    for (var i = 0; i < sorted.length; i++) {
        var avg = sorted[i].value / byTeam(parseInt(sorted[i].key)).count();
        $('#teams tr:last').after('<tr><td>' + sorted[i].key + '</td><td>' + avg + '</td><td>' + (i + 1) + '</td></tr>');
    }
}
//Filtering Methods
function byTeam(team) {
    return matches(function() {
        return this.teams.indexOf(team) > -1;
    });
}

function byRegional(regional) {
    return matches({
        "regional": regional
    });
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

// Init Page
$(document).ready(function() {
	updateMatchTable(matches());
	updateTeamTable();
	bindLinks();
	populate();
	
});