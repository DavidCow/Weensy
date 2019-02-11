import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';


  /**
   * Adds file 'pathToVideo'\n 
   * to a string
   */
  export function addToMergeFile(mergeFileAsStr, filePath) {
    mergeFileAsStr += "file '" + filePath + "'\n";
    return mergeFileAsStr;
  }

  /** 
   * Creates an ffmpeg command for single video with time frame to clip it
   * var command = '-y -i '+ RNFS.DocumentDirectoryPath   +'/konohasenpu.mp4 -ss 00:00:00.000 -to 00:00:03.500 -vf hflip -filter:v setpts=0.3*PTS '+ RNFS.DocumentDirectoryPath   +'/outnow2.mp4'; 
   * flip should look like "-vf hflip"
   */
  export function createCommand(inputFilename, outputFileName, start, end, flip) {
    var RNFS = require('react-native-fs');
    if (flip) {
      flip += " "; //add space to have correct command alignment
    }
    var command = '-y -i '+ inputFilename +' -ss '+start+' -to '+end+' '+flip+'' + outputFileName+'';
    return command;
  }


  /**
   * Executes ffmpeg command
   */
  export function executeCommand(command) {
    RNFFmpeg.execute(command);
    console.log("AFTER EXECUTE");
    RNFFmpeg.getLastReturnCode().then(result => {
      console.log("Last return code: " + result.lastRc);
    });

    RNFFmpeg.getLastCommandOutput().then(result => {
      console.log("Last command output: " + result.lastCommandOutput);
    });
    console.log("END");
  }