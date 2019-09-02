/*
 * NAME:          update_results.js
 * AUTHOR:        Alan Davies
 * EMAIL:         alan.davies-2@manchester.ac.uk
 * PROFILE:       https://www.research.manchester.ac.uk/portal/alan.davies-2.html | https://alandavies.netlify.com/
 * DATE:          23/08/2019
 * INSTITUTION:   University of Manchester, School of Health Sciences
 * DESCRIPTION:   Ajax requests to rerun analysis and update results
*/

function UpdateResults()
{
    var updateResults = new Object();

    // update the results of the RF and display summary info
    updateResults.rerunAnalysis = function()
    {
        // show mask and loading gif
        var mask = document.getElementById("page-mask");
        var loader = document.getElementById("loader");
        loader.style.left = ((screen.width / 2) - (loader.offsetWidth / 2)) + "px";
        loader.style.top = ((screen.height / 2) - (loader.offsetHeight / 2)) + "px";
        mask.style.display = "block";
        loader.style.display = "block";

        // get the new parameters
        var selectedFeatures = new Array();
        var newTestSplit = parseInt(document.getElementById("display-test-split").innerHTML);
        var newNumTrees = parseInt(document.getElementById("display-num-trees").innerHTML);
        var tds = document.querySelectorAll('#feature-table tbody td'), i;

        for(i = 0; i < tds.length - 1; ++i) {
            if(tds[i+1].childNodes[0].checked) {
                selectedFeatures.push(tds[i].innerText);
            }
        }

        // send data to server
        flaskData = {"new_test_split":newTestSplit, "new_num_trees":newNumTrees, "selected_features":selectedFeatures};
        $.ajax({
            url:"/run_again",
            type: 'POST',
            cache: false,
            data: JSON.stringify(flaskData),
            contentType: 'application/json;charset=UTF-8',
            success: function(results) {
                // show results container and primary results
                document.getElementById("results-container").style.display = "block";
                document.getElementById("accuracy-report").innerHTML = String(results['accuracy'].toFixed(3));
                document.getElementById("precision-report").innerHTML = String(results['precision'].toFixed(3));
                document.getElementById("recall-report").innerHTML = String(results['recall'].toFixed(3));
                document.getElementById("fscore-report").innerHTML = String(results['fscore'].toFixed(3));

                // confusion matrix
                document.getElementById("cm-1").innerHTML = String(results['conf_mat'][0][0]);
                document.getElementById("cm-2").innerHTML = String(results['conf_mat'][0][1]);
                document.getElementById("cm-3").innerHTML = String(results['conf_mat'][1][0]);
                document.getElementById("cm-4").innerHTML = String(results['conf_mat'][1][1]);

                mask.style.display = "none";
                loader.style.display = "none";
                console.log(results);
            }
        });
    }

    // update the value of the number of trees
    updateResults.showNumTrees = function(val)
    {
        var numTrees = document.getElementById("display-num-trees");
        numTrees.innerHTML = String(val);

    }

    // update the training/test split
    updateResults.dataSplit = function(val)
    {
        var train = document.getElementById("train-prog");
        var trainText = document.getElementById("display-train-split");
        var test = document.getElementById("test-prog");
        var testText = document.getElementById("display-test-split");

        currentTest = parseInt(val);
        test.style.width = currentTest + "%";
        test.innerHTML = currentTest + "%";
        testText.innerHTML = currentTest;

        currentTrain = 100 - currentTest;
        train.style.width = currentTrain + "%";
        train.innerHTML = currentTrain + "%";
        trainText.innerHTML = currentTrain;
    }

    return updateResults;
}