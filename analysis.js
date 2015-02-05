function populate() {
    $(".regional-select option").each(function() {
        for (var regional in regionals) {
            $(this).after("<option value=\"" + regionals[regional] + "\">" + regionals[regional] + "</option>");
        }
    });
}
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
}
//Update analysis tables
function updateMatchTable(query) {
    $("#matches").html("<tbody><tr><th>Regional</th><th>Match Number</th><th>Team</th><th>Team</th><th>Team</th><th>Color</th><th>Year</th></tr></tbody>");
    query.order("year desc, regional, number").each(function(match) {
        $('#matches tr:last').after('<tr><td>' + match.regional + '</td><td>' + match.number + '</td><td>' + match.teams[0] + '</td><td>' + match.teams[1] + '</td><td>' + match.teams[2] + '</td><td>' + match.side + '</td><td>' + match.year + '</td><td><a class="stack_ln detailsButton" id="' + match.___id + '" href="#">Details</a></td></tr>');
    });
    $(".stack_ln").each(function() {
        $(this).click(function() {
            $("#stack-window").html("<tbody><tr><th>Team</th><th>Stack Size</th><th>Can?</th><th>Litter?</th><th>Time</th><th>Score</th></tr></tbody>");
            $(".stack_ln").parent().parent().removeClass("current_match");
            $(this).parent().parent().addClass("current_match");
            var match = matches(this.id).first();
            var total = match_score(match);
            for (var i = 0; i < match.stacks.length; i++) {
                var stack = match.stacks[i];
                var score = stack_score(stack);
                $('#stack-window tr:last').after('<tr><td>' + stack.team + '</td><td>' + stack.size + '</td><td>' + stack.can + '</td><td>' + stack.litter + '</td><td>' + stack.time + 's</td><td>' + score + '</td></tr>');
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
updateMatchTable(matches());
updateTeamTable();
bindLinks();
populate();