"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * - showDelete: shows the delete button if needed
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelete = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showFav = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        ${showDelete ? deleteButton() : ""}
        ${showFav ? favoriteIcon(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handles Submitting of a New Story */ 
async function submitUserStory(e){
  console.debug('submitUserStory');
  e.preventDefault();

  const newTitle = $('#new-title').val();
  const newAuthor = $('#new-author').val();
  const newURL = $('#new-url').val();
  const username = currentUser.username;
  const newStoryData = {newTitle, newURL, newAuthor, username};

  const newStory = await storyList.addStory(currentUser, newStoryData);

  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);

  $submittedStories.slideUp('slow');
  $submittedStories.trigger('reset');

}

$submittedStories.on('submit', submitUserStory);

function addNewStoriesToPage(){
  console.debug('addNewStoriesToPage');

  $userStories.empty;

  for(let story of currentUser.ownStories){
    let $story = generateStoryMarkup(story, true);
    $userStories.append($story);
  }
}

$userStories.show();

function deleteButton(){
  return `
      <span class = 'delete-button'>
        <i class="fas fa-trash"></i>
      </span>
        `;
}

function favoriteIcon(story, user){
  const isFav = user.isFavorite(story);
  const icon = isFav ? 'fas' : 'far';
  return `
      <span class = 'fav'>
        <i class="${icon} fa-bookmark"></i>
      </span>
        `;
}

async function delStory(e){
  console.debug('delStory');

  const $storyDeleted = $(e.target).closest('li');
  const storyID = $storyDeleted.attr('id');

  await storyList.removeStory(currentUser, storyID);

  await addNewStoriesToPage();
}

$userStories.on('click', '.delete-button', delStory)

async function toggleFav(e){
  console.debug('toggleFav');

  const $storyChosen = $(e.target);
  const $closest = $storyChosen.closest('li');
  const storyID = $closest.attr('id');
  const story = storyList.stories.find(tempStory => {
    tempStory.storyId == storyID
  });

  if($storyChosen.hasClass('fas')){
    await currentUser.removeFavoriteStory(story);
    $storyChosen.closest('i').toggleClass('fas far');
  }
  else{
    await currentUser.favoriteStory(story);
    $storyChosen.closest('i').toggleClass('fas far');
  }
}

$allStoriesList.on('click', '.fav', toggleFav);

function displayFavorites(){
  console.debug('displayFavorites');
  $favStories.empty();

  for(let story of currentUser.favorites){
    const $chosenStory = generateStoryMarkup(story);
    $favStories.append($chosenStory);
  }

  $favStories.show();
}