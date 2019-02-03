
import firebase from 'react-native-firebase';
import { GS_PATH } from '../../constants';


/**
 * example gs://... url returns end url to download from https://weensy1.firebase.com/konoha.mp4
 * @param {} googleStorageUrl 
 */
export function getDownloadUrlFromFirebaseStorage(googleStorageUrl) {
    return firebase.storage().refFromURL(googleStorageUrl).getDownloadURL().then(downloadFilePath => {
      return downloadFilePath;
    })
    .catch(err => console.log("getDownloadUrlFromFirebaseStorage" + err));
}

/**
 * Not yet tested
 * @param {*} googleStorageUrl 
 * @param {*} localFilePath 
 */
export function downloadFileFromFirebaseStorage(googleStorageUrl, localFilePath) {
    firebase.storage().refFromURL(googleStorageUrl).downloadFile(localFilePath).then(result => {
      console.log(result);
      return true;
   })
   .catch(err => {
       console.log(err);
        }
    );
    return false;
}

/**
 * Get JSON list of videos from Firebase Storage
 * e.g. for beats.json console.log("Beats loaded and ready4: "+this.state.beats["cap"].clippings);
 */
export function getJsonListFromFirebaseStorage(filename, foldername="/") {
    var firebaseUrl = GS_PATH + foldername + filename;
    return getDownloadUrlFromFirebaseStorage(firebaseUrl).then(downloadUrl => {
        return fetch(downloadUrl,
            {
                method: "GET"
            })
            .then((response) => response.json())
            .then(response => {
            return response;
        })
        .catch(err => {
            console.log("getVideofeedList: " + err);
        });
    });
}