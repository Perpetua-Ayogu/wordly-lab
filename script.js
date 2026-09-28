// get things from html

const form =
  document.querySelector("#search-form");

const input =
  document.querySelector("#word-input");

const message =
  document.querySelector("#message");

const result =
  document.querySelector("#result");

const wordText =
  document.querySelector("#word");

const pronunciationText =
  document.querySelector("#pronunciation");

const partOfSpeechText =
  document.querySelector("#part-of-speech");

const definitionText =
  document.querySelector("#definition");

const exampleText =
  document.querySelector("#example");

const synonymsText =
  document.querySelector("#synonyms");

const audio =
  document.querySelector("#audio");

const saveButton =
  document.querySelector("#save-button");

const favoriteList =
  document.querySelector("#favorite-list");



// keep current word

let currentWord = "";



// keep favorite words

let favorites =
  JSON.parse(localStorage.getItem("favorites")) || [];



// show favorites when page opens

showFavorites();



// when user clicks search

form.addEventListener("submit", function(event) {

  // stop page from refreshing

  event.preventDefault();


  // get what user typed

  const word =
    input.value.trim();


  if (word === "") {

    message.textContent =
      "Please enter a word.";

    return;
  }


  searchWord(word);

});



// search word from api

async function searchWord(word) {

  message.textContent =
    "Searching...";


  result.style.display =
    "none";


  try {

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );


    if (!response.ok) {

      throw new Error("Word not found");

    }


    const data =
      await response.json();


    console.log(data);


    showWord(data);


  } catch (error) {

    message.textContent =
      "Sorry, word not found.";

    result.style.display =
      "none";

  }

}



// show word on page

function showWord(data) {

  const wordData =
    data[0];


  const meaning =
    wordData.meanings[0];


  const definition =
    meaning.definitions[0];


  currentWord =
    wordData.word;



  // show word

  wordText.textContent =
    wordData.word;



  // show pronunciation

  if (wordData.phonetic) {

    pronunciationText.textContent =
      "Pronunciation: " +
      wordData.phonetic;

  } else {

    pronunciationText.textContent =
      "Pronunciation not available";

  }



  // show part of speech

  partOfSpeechText.textContent =
    "Part of Speech: " +
    meaning.partOfSpeech;



  // show definition

  definitionText.textContent =
    "Definition: " +
    definition.definition;



  // show example

  if (definition.example) {

    exampleText.textContent =
      "Example: " +
      definition.example;

  } else {

    exampleText.textContent =
      "Example not available";

  }



  // show synonyms

  if (
    meaning.synonyms &&
    meaning.synonyms.length > 0
  ) {

    synonymsText.textContent =
      "Synonyms: " +
      meaning.synonyms.slice(0, 5).join(", ");

  } else {

    synonymsText.textContent =
      "Synonyms not available";

  }



  // find audio

  const audioData =
    wordData.phonetics.find(function(item) {

      return item.audio;

    });



  if (audioData) {

    let audioLink =
      audioData.audio;


    if (audioLink.startsWith("//")) {

      audioLink =
        "https:" + audioLink;

    }


    audio.src =
      audioLink;


    audio.style.display =
      "block";

  } else {

    audio.style.display =
      "none";

  }



  // check if word is already favorite

  if (favorites.includes(currentWord)) {

    saveButton.textContent =
      "Saved";

    saveButton.classList.add("saved");

  } else {

    saveButton.textContent =
      "Save Favorite";

    saveButton.classList.remove("saved");

  }



  // remove searching message

  message.textContent =
    "";


  // show result

  result.style.display =
    "block";

}



// save favorite

saveButton.addEventListener("click", function() {

  if (currentWord === "") {

    return;

  }


  if (!favorites.includes(currentWord)) {

    favorites.push(currentWord);


    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );


    saveButton.textContent =
      "Saved";


    saveButton.classList.add("saved");


    message.textContent =
      currentWord + " saved!";


    showFavorites();

  } else {

    message.textContent =
      currentWord + " is already saved.";

  }

});



// show favorites

function showFavorites() {

  favoriteList.innerHTML =
    "";


  if (favorites.length === 0) {

    const item =
      document.createElement("li");


    item.textContent =
      "No favorite words yet";


    favoriteList.appendChild(item);


    return;

  }


  favorites.forEach(function(word) {

    const item =
      document.createElement("li");


    item.textContent =
      word;


    item.classList.add(
      "favorite-word"
    );


    // click favorite word to search again

    item.addEventListener("click", function() {

      input.value =
        word;


      searchWord(word);

    });


    favoriteList.appendChild(item);

  });

}