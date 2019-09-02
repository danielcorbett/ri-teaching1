/*
 * NAME:          animation_manager.js
 * AUTHOR:        Alan Davies
 * EMAIL:         alan.davies-2@manchester.ac.uk
 * PROFILE:       https://www.research.manchester.ac.uk/portal/alan.davies-2.html | https://alandavies.netlify.com/
 * DATE:          20/07/2019
 * INSTITUTION:   University of Manchester, School of Health Sciences
 * DESCRIPTION:   System for controlling th animated elements
*/

function AnimationManager()
{
    var animationManager = new Object();
    animationManager.currentBlock = 1;
    animationManager.imagesRoot = "images/";
    animationManager.imageArray = new Array();
    animationManager.currentImage = 0;
    //animationManager.treeAnatomyImages = ["anat1.png"];

    // show the next block of the tutorial content
    animationManager.showNextBlock = function(currentBlockElement)
    {
        document.getElementById("example-block-" + currentBlockElement).style.display = "none";
        this.currentBlock++;
        var nextBlock = document.getElementById("example-block-" + this.currentBlock).style.display = "block";
    }

    // build images in sequence
    animationManager.buildImageSequence = function(imageRootName, numImages)
    {
        for(var i = 0; i < numImages; i++) {
            this.imageArray.push(this.imagesRoot + imageRootName + (i + 1));
        }
    }

    // view images sequence
    animationManager.viewImageSequence = function(elementID, action)
    {
        var imageContainer = document.getElementById(elementID);
        if(action == "next" && this.currentImage < this.imageArray.length - 1) {
            this.currentImage++;
        }
        else if (action == "back" && this.currentImage > 0) {
            this.currentImage--;
        }
        imageContainer.style.backgroundImage = "url(./static/" + this.imageArray[this.currentImage] + ".png)";
    }

    // show the about box
    animationManager.showAboutBox = function()
    {
        document.getElementById("page-mask").style.display = "block";
        var aboutBox = document.getElementById("about-box");
        aboutBox.style.display = "block";
        aboutBox.style.left = ((screen.width / 2) - (aboutBox.offsetWidth / 2)) + "px";
    }

    // close the about box
    animationManager.closeAbout = function()
    {
        document.getElementById("page-mask").style.display = "none";
        document.getElementById("about-box").style.display = "none";
    }

    // reposition the next button if the page scrolls
    animationManager.repositionNextOnScroll = function()
    {
        nextButton = document.getElementById("rf_next");
        if(nextButton) {
            nextButton.style.top = (($(window).scrollTop() + $(window).height()) - 15) + "px";
        }
    }

    // show the desired section
    animationManager.showSection = function(sectionId)
    {
        var currentBlock = null;
        var blockText = "example-block-";
        var desiredBlock = document.getElementById(blockText + (sectionId));

        for(var i = 0; i < 13; i++) {
            currentBlock = document.getElementById(blockText + (i + 1));
            currentBlock.style.display = "none";
            console.log("hiding block ", currentBlock.id);
        }
        desiredBlock.style.display = "block";
    }

    return animationManager;
}