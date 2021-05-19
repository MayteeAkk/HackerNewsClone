"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(evt){
  console.debug('navSubmitClick', evt);
  hidePageComponents();
  $allStoriesList.show();
  $submittedStories.show();
}

$navSubmit.on('click', navSubmitClick);

function navFavoriteClick(evt){
  console.debug('navFavoriteClick', evt);
  hidePageComponents();
  displayFavorites();
}

$body.on('click', '#nav-favorites', navFavoriteClick);

function navMyStoryClick(evt){
  console.debug('navMyStoryClick', evt);
  hidePageComponents();
  addNewStoriesToPage();
  $userStories.show();
}

$body.on('click', '#nav-my-stories', navMyStoryClick);



