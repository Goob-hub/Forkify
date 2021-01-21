//Contains a couple of re-used functions throughout our project, storing them in one central place for easy use and modification throughout the project

import { async } from 'regenerator-runtime';
import icons from 'url:../img/icons.svg';
import { TIMEOUT_SEC } from './config.js';

export const makeRequest = async function (url, uploadData = undefined) {
  try {
    //if upload data exists, make a post request, else make a fetch request
    const request = !uploadData
      ? fetch(url)
      : fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        });

    //Need to put all promises in an array
    //If the fetch promise takes longer than the timeout function promise, then res is an error and it is thrown!
    const res = await Promise.race([request, timeout(TIMEOUT_SEC)]);

    //Awaiting fetched data to be formatted
    const data = await res.json();

    //Checking for errors and throwing errors if there is one
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    //Returns data in json format
    return data;
  } catch (err) {
    //Rejects promise returned from this async function so that the error can be handled elsewhere
    throw err;
  }
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const showSpinner = function (parentEl) {
  parentEl.innerHTML = ` <div class="spinner">
   <svg>
     <use href="${icons}#icon-loader"></use>
   </svg>
 </div>`;
};

export const showError = function (msg, parentEL) {
  const html = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${msg}</p>
  </div>`;

  parentEL.innerHTML = html;
};

export const setBookmarks = function (bookmarks) {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

export const getBookmarks = function () {
  return localStorage.getItem('bookmarks')
    ? JSON.parse(localStorage.getItem('bookmarks'))
    : [];
};

/*
export const getJson = async function (url) {
  try {
    //Need to put all promises in an array
    //If the fetch promise takes longer than the timeout function promise, then res is an error and it is thrown!
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    //Awaiting fetched data to be formatted
    const { data } = await res.json();

    //Checking for errors and throwing errors if there is one
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    //Returns data in json format
    return data;
  } catch (err) {
    //Rejects promise returned from this async function so that the error can be handled elsewhere
    throw err;
  }
};

export const sendJson = async function (url, uploadData) {
  try {
    const post = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race(post, timeout(TIMEOUT_SEC));

    const { data } = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};
*/
