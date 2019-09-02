/*
 * NAME:          main.js
 * AUTHOR:        Alan Davies
 * EMAIL:         alan.davies-2@manchester.ac.uk
 * PROFILE:       https://www.research.manchester.ac.uk/portal/alan.davies-2.html | https://alandavies.netlify.com/
 * DATE:          20/07/2019
 * INSTITUTION:   University of Manchester, School of Health Sciences
 * DESCRIPTION:   Main JS page
*/

// system objects
var updateResults = null;
var animationManager = null;

// initialisation function
function initializeMain()
{
   // create objects
   animationManager = AnimationManager();
   updateResults = UpdateResults();
}
