# pisces
Pisces scouting system for FRC 2015 Recycle Rush

Created by FRC Team 3184 Blaze Robotics
# Usage
The repo contains two pages, analysis and scouting. Analysis will let you search and rank teams, along with changing settings. Scouting is where the actual match data is collected.

## Setup
The pisces system is designed to have two separate computers recording each side of the match, since they are essentially different matches.

To begin scouting, enter the Analysis page and select 'Edit Regional' at the top right. Here you can create regionals and edit the match schedule. Enter a regional name in the text box and click 'New'. Select your regional from the dropdown box and input the match schedule.

You can copy regional data between computers by using the 'Raw' and 'Load' functions. Raw will give you the raw JSON to be put into the Load dialog

## Scouting
Enter the scouting page and select your regional, the match number, and which color you will be scouting for. It should autofill with the teams. Click 'Start Match' to begin the timer countdown. Use the buttons on the right to record events, such as a robot set in autonomous or litter being put in the landfill. To count stacks, select which team is making the stack, and then click however many totes and whether there is a can/litter on top. When the stack is complete, click 'Commit'. You can edit stacks later if you messed up or it gets knocked over.

## Analysis
The matches are displayed at the left. The details for each match is in the center, and team scores are on the right. You can filter matches by regional, team, and year, and teams by regional. The details of a match will allow you to see the stack log as well as change match points, or even delete the match.